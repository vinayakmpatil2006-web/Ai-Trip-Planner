// src/service/GlobalApi.js
// ─────────────────────────────────────────────────────────────────────────────
// How this works:
//
//  DEV  (npm run dev)
//    • Vite proxies  /places-api/*  →  https://maps.googleapis.com/maps/api/*
//    • We fetch('/places-api/place/textsearch/json?query=...&key=...')
//    • Response contains real photo_reference strings
//    • We build the Place Photo URL using the Google REST format
//    • <img src> uses that URL directly — browsers follow the Google redirect
//      without CORS errors (CORS only blocks fetch/XHR, not <img> tags)
//
//  PROD (built app / Firebase Hosting)
//    • Vite proxy is not available
//    • We fall back to the Google Maps JS SDK PlacesService.textSearch()
//      which uses the already-loaded script tag (no CORS issue)
//    • photo.getUrl() returns a valid signed URL
//
//  Both paths return a usable image URL or null on failure.
// ─────────────────────────────────────────────────────────────────────────────

const photoCache = new Map();
const API_KEY    = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
const IS_DEV     = import.meta.env.DEV; // true during `npm run dev`

// ─── Helper: build the Place Photo REST URL ───────────────────────────────────
// Works as <img src> because browsers follow Google's 302 redirect without
// triggering CORS. Do NOT use this with fetch() — that WILL get blocked.
export const getPlacePhotoUrl = (photoReference, maxWidth = 800) => {
  if (!photoReference || !API_KEY) return null;
  return `https://maps.googleapis.com/maps/api/place/photo?maxwidth=${maxWidth}&photo_reference=${encodeURIComponent(photoReference)}&key=${API_KEY}`;
};

// ─── Main export ─────────────────────────────────────────────────────────────
export const GetPlaceDetails = async (query) => {
  if (!query?.trim()) return null;

  // Return cached value instantly (null = "tried, found nothing")
  if (photoCache.has(query)) {
    return photoCache.get(query);
  }

  let url = null;

  try {
    if (IS_DEV) {
      url = await fetchViaProxy(query);
    } else {
      url = await fetchViaSdk(query);
    }
  } catch (err) {
    console.error(`[Places] Unhandled error for "${query}":`, err.message);
  }

  // Only cache definitive results — don't cache null from transient errors
  if (url !== undefined) {
    photoCache.set(query, url);
  }

  return url || null;
};

// ─── Strategy 1: Vite proxy → Places REST API (dev only) ─────────────────────
async function fetchViaProxy(query) {
  const endpoint = `/places-api/place/textsearch/json?query=${encodeURIComponent(query)}&key=${API_KEY}`;

  let res;
  try {
    const controller = new AbortController();
    const timeout    = setTimeout(() => controller.abort(), 8000);
    res = await fetch(endpoint, { signal: controller.signal });
    clearTimeout(timeout);
  } catch (err) {
    if (err.name === 'AbortError') {
      console.warn(`[Places] Proxy request timed out for: "${query}"`);
    } else {
      console.warn(`[Places] Proxy fetch error for "${query}":`, err.message);
    }
    // On any fetch error in dev, try the SDK as a second chance
    return fetchViaSdk(query);
  }

  if (!res.ok) {
    console.warn(`[Places] Proxy HTTP ${res.status} for: "${query}"`);
    return fetchViaSdk(query);
  }

  const data = await res.json();

  if (data.status === 'REQUEST_DENIED') {
    console.error(
      '[Places] ❌ REQUEST_DENIED — Make sure "Places API" is enabled in',
      'Google Cloud Console → APIs & Services → Library',
      '\n  Key prefix:', API_KEY?.slice(0, 12) + '...'
    );
    return null;
  }

  if (data.status === 'OVER_QUERY_LIMIT') {
    console.warn('[Places] ⚠️ OVER_QUERY_LIMIT — rate limited. Result not cached so it can retry.');
    return undefined; // undefined = don't cache
  }

  if (data.status === 'ZERO_RESULTS' || !data.results?.length) {
    console.info(`[Places] Zero results for: "${query}"`);
    return null;
  }

  if (data.status !== 'OK') {
    console.warn(`[Places] Unexpected status "${data.status}" for: "${query}"`);
    return null;
  }

  // Find first result that actually has photos
  const place = data.results.find((r) => r.photos?.length > 0);
  if (!place?.photos?.[0]?.photo_reference) {
    console.info(`[Places] No photo_reference in results for: "${query}"`);
    return null;
  }

  const photoRef = place.photos[0].photo_reference;
  const photoUrl = getPlacePhotoUrl(photoRef);
  console.log(`[Places] ✅ Real photo for "${query}": ${photoUrl.slice(0, 80)}...`);
  return photoUrl;
}

// ─── Strategy 2: Maps JS SDK (production / fallback) ─────────────────────────
async function fetchViaSdk(query) {
  // If SDK isn't loaded yet, try to wait for it
  if (!window.google?.maps?.places) {
    try {
      if (window._mapsReadyPromise) {
        await Promise.race([
          window._mapsReadyPromise,
          new Promise((_, rej) => setTimeout(() => rej(new Error('timeout')), 6000)),
        ]);
      } else {
        return null;
      }
    } catch {
      console.warn('[Places] SDK not ready within timeout for:', query);
      return null;
    }
  }

  return new Promise((resolve) => {
    const div     = document.createElement('div');
    const service = new window.google.maps.places.PlacesService(div);
    const timer   = setTimeout(() => {
      console.warn(`[Places] SDK textSearch timed out for: "${query}"`);
      resolve(null);
    }, 8000);

    service.textSearch({ query }, (results, status) => {
      clearTimeout(timer);
      const OK   = window.google.maps.places.PlacesServiceStatus.OK;
      const ZERO = window.google.maps.places.PlacesServiceStatus.ZERO_RESULTS;

      if (status === OK && results?.length) {
        const place = results.find((r) => r.photos?.length > 0);
        if (place) {
          try {
            const url = place.photos[0].getUrl({ maxWidth: 800, maxHeight: 600 });
            console.log(`[Places] ✅ SDK photo for "${query}"`);
            resolve(url);
          } catch (e) {
            console.warn(`[Places] SDK getUrl() failed:`, e.message);
            resolve(null);
          }
        } else {
          resolve(null);
        }
      } else if (status === 'OVER_QUERY_LIMIT') {
        console.warn('[Places] SDK OVER_QUERY_LIMIT');
        resolve(undefined); // undefined = don't cache
      } else {
        if (status !== ZERO) {
          console.warn(`[Places] SDK status "${status}" for: "${query}"`);
        }
        resolve(null);
      }
    });
  });
}
