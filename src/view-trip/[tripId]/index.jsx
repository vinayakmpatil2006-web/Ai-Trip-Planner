// src/view-trip/[tripId]/index.jsx
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { db, auth } from "../../service/firebaseConfig";
import Header from "../../components/Header";
import { SkeletonHeader } from "../../components/LoadingSkeleton";
import TripSummaryBar from "../../components/TripSummaryBar";
import BudgetBreakdown from "../../components/BudgetBreakdown";
import TransportCard from "../../components/TransportCard";
import MapSection from "../../components/MapSection";
import { toast } from "sonner";
import { MapPin, Clock, DollarSign, Share2, Printer, ChevronRight, Check, Star, Sun, Sunset, Moon } from "lucide-react";
import { validateHotelLocation } from "../../constants/uiConfig";
import { GetPlaceDetails } from "../../service/GlobalApi";

const FALLBACK = "https://via.placeholder.com/400x300?text=Image+Not+Available";

// ─── PlaceImage ───────────────────────────────────────────────────────────────
function PlaceImage({ alt, className, placeQuery }) {
  const [imgSrc, setImgSrc] = useState("");
  const [loaded, setLoaded] = useState(false);
  const [fetching, setFetching] = useState(!!placeQuery);

  useEffect(() => {
    let mounted = true;
    if (!placeQuery) { setImgSrc(FALLBACK); setFetching(false); return; }
    setFetching(true);
    setLoaded(false);
    GetPlaceDetails(placeQuery)
      .then(url => { if (mounted) setImgSrc(url || FALLBACK); })
      .catch(() => { if (mounted) setImgSrc(FALLBACK); })
      .finally(() => { if (mounted) setFetching(false); });
    return () => { mounted = false; };
  }, [placeQuery]);

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {fetching && <div className="absolute inset-0 bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 animate-pulse" />}
      <img
        src={imgSrc || FALLBACK}
        alt={alt}
        loading="lazy"
        className={`w-full h-full object-cover transition-opacity duration-300 ${loaded && !fetching ? "opacity-100" : "opacity-0"}`}
        onLoad={() => setLoaded(true)}
        onError={() => { if (imgSrc !== FALLBACK) setImgSrc(FALLBACK); }}
      />
    </div>
  );
}

// ─── HotelCard ────────────────────────────────────────────────────────────────
function HotelCard({ hotel, destination, days }) {
  const photoQuery   = destination ? `${hotel.name}, ${destination}` : hotel.name;
  const mapsLink     = `https://www.google.com/maps/search/${encodeURIComponent(`${hotel.name} ${hotel.address || destination}`)}`;
  const rating       = parseFloat(hotel.rating || 4.0);
  const displayRating = rating.toFixed(1);
  let reviewText = "Good";
  if (rating >= 4.5) reviewText = "Exceptional";
  else if (rating >= 4.0) reviewText = "Excellent";
  else if (rating >= 3.5) reviewText = "Very good";

  const typeColor = {
    "Budget": "bg-green-100 text-green-700",
    "3-Star": "bg-blue-100 text-blue-700",
    "4-Star": "bg-indigo-100 text-indigo-700",
    "5-Star": "bg-purple-100 text-purple-700",
  }[hotel.hotelType] || "bg-gray-100 text-gray-600";

  return (
    <div className="flex flex-col sm:flex-row border border-gray-200 rounded-lg overflow-hidden bg-white mb-4 shadow-sm hover:shadow-md transition-shadow">
      {/* Image */}
      <div className="w-full sm:w-[220px] h-52 sm:h-auto relative shrink-0">
        <PlaceImage alt={hotel.name} className="w-full h-full" placeQuery={photoQuery} />
        <span className={`absolute top-2 left-2 text-xs font-bold px-2 py-0.5 rounded ${typeColor}`}>
          {hotel.hotelType || "Hotel"}
        </span>
      </div>

      {/* Info */}
      <div className="flex-1 p-4 flex flex-col md:flex-row">
        <div className="flex-1 pr-0 md:pr-4">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <h3 className="text-lg font-bold text-[#003B95]">{hotel.name}</h3>
            {hotel.rating && (
              <span className="flex text-yellow-500 text-xs">
                {Array.from({ length: Math.floor(rating) }).map((_, i) => <Star key={i} size={12} fill="currentColor" />)}
              </span>
            )}
          </div>
          <div className="flex items-start gap-1 mb-2">
            <MapPin size={14} className="text-[#003B95] shrink-0 mt-0.5" />
            <a href={mapsLink} target="_blank" rel="noreferrer" className="text-sm text-[#003B95] font-semibold hover:underline">
              {hotel.address}
            </a>
          </div>
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">{hotel.description}</p>
          {hotel.amenities?.length > 0 && (
            <div className="hidden sm:flex flex-wrap gap-x-3 gap-y-1">
              {hotel.amenities.slice(0, 5).map((a, i) => (
                <span key={i} className="flex items-center gap-1 text-xs text-gray-600">
                  <Check size={11} className="text-green-600" /> {a}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Price panel */}
        <div className="w-full md:w-36 flex flex-col justify-between items-start md:items-end mt-4 md:mt-0 md:border-l border-gray-200 md:pl-4">
          <div className="flex items-center gap-2 md:flex-col md:items-end">
            <span className="hidden md:block text-xs text-gray-500 text-right font-medium">{reviewText}</span>
            <div className="bg-[#003B95] text-white font-bold px-2 py-1 rounded text-base min-w-[38px] text-center">
              {displayRating}
            </div>
          </div>
          <div className="mt-4 text-left md:text-right w-full">
            <div className="text-xs text-gray-400 mb-0.5">{days} night{days > 1 ? "s" : ""}</div>
            <div className="text-xl font-black text-gray-900">{hotel.price}</div>
            <div className="text-xs text-gray-400 mb-3">+₹0 taxes</div>
            <a
              href={`https://www.booking.com/searchresults.html?ss=${encodeURIComponent(hotel.name + " " + (destination || ""))}`}
              target="_blank" rel="noreferrer"
              className="inline-flex items-center gap-1 bg-[#003B95] hover:bg-[#0057B8] text-white font-bold px-3 py-2 rounded text-sm transition-colors"
            >
              Book Now <ChevronRight size={14} />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Time-of-day helpers ──────────────────────────────────────────────────────
const TOD_META = {
  morning:   { label: "Morning",   Icon: Sun,    color: "text-amber-500",  bg: "bg-amber-50",  border: "border-amber-200" },
  afternoon: { label: "Afternoon", Icon: Sunset, color: "text-orange-500", bg: "bg-orange-50", border: "border-orange-200" },
  evening:   { label: "Evening",   Icon: Moon,   color: "text-indigo-500", bg: "bg-indigo-50", border: "border-indigo-200" },
};
const todKey = (a) => ["morning", "afternoon", "evening"].includes(a.timeOfDay) ? a.timeOfDay : "morning";

// ─── ActivityCard ─────────────────────────────────────────────────────────────
function ActivityCard({ activity, destination }) {
  const mapsUrl    = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(activity.location || activity.placeName)}`;
  const placeQuery = `${activity.location || activity.placeName} ${destination || ""}`.trim();
  const tod        = TOD_META[todKey(activity)];

  return (
    <div className="flex border border-gray-200 rounded-lg overflow-hidden bg-white mb-3">
      <div className="w-24 sm:w-40 shrink-0 relative">
        <PlaceImage alt={activity.location || activity.placeName} className="absolute inset-0 w-full h-full" placeQuery={placeQuery} />
      </div>
      <div className="flex-1 p-3 sm:p-4">
        <div className="flex items-start justify-between gap-2 mb-1 flex-wrap">
          <h4 className="text-base font-bold text-[#003B95] hover:underline">
            <a href={mapsUrl} target="_blank" rel="noreferrer">{activity.location || activity.placeName}</a>
          </h4>
          {activity.ticketPrice && (
            <span className="text-xs font-bold text-green-700 bg-green-50 border border-green-200 px-2 py-0.5 rounded shrink-0">
              {activity.ticketPrice}
            </span>
          )}
        </div>
        <p className="text-sm text-gray-600 mb-2 line-clamp-2">{activity.description || activity.placeDetails}</p>
        <div className="flex flex-wrap gap-3">
          {activity.time && (
            <span className="flex items-center gap-1 text-xs font-semibold text-gray-500">
              <Clock size={13} /> {activity.time}
            </span>
          )}
          {activity.ticketPricing && !activity.ticketPrice && (
            <span className="flex items-center gap-1 text-xs font-semibold text-green-700">
              <DollarSign size={13} /> {activity.ticketPricing}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── DaySection ───────────────────────────────────────────────────────────────
function DaySection({ day, destination }) {
  const grouped = { morning: [], afternoon: [], evening: [] };
  (day.activities || []).forEach(a => grouped[todKey(a)].push(a));
  const hasGroups = grouped.morning.length || grouped.afternoon.length || grouped.evening.length;

  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden mb-4">
      <div className="px-5 py-3 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
        <h3 className="font-bold text-gray-900">Day {day.day}{day.title ? `: ${day.title}` : ""}</h3>
        <span className="text-xs text-gray-400">{day.activities?.length || 0} activities</span>
      </div>

      {hasGroups ? (
        <div className="p-4 space-y-4">
          {["morning", "afternoon", "evening"].map(tod => {
            const acts = grouped[tod];
            if (!acts.length) return null;
            const meta = TOD_META[tod];
            const MetaIcon = meta.Icon;
            return (
              <div key={tod}>
                <div className={`flex items-center gap-2 mb-2 px-2 py-1 rounded-md ${meta.bg} border ${meta.border} w-fit`}>
                  <MetaIcon size={13} className={meta.color} />
                  <span className={`text-xs font-bold ${meta.color}`}>{meta.label}</span>
                </div>
                {acts.map((activity, i) => (
                  <ActivityCard key={i} activity={activity} destination={destination} />
                ))}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="p-4">
          {(day.activities || []).map((activity, i) => (
            <ActivityCard key={i} activity={activity} destination={destination} />
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function ViewTrip() {
  const { tripId } = useParams();
  const navigate   = useNavigate();
  const [trip, setTrip]       = useState(null);
  const [user, setUser]       = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeFilters, setActiveFilters] = useState([]);

  useEffect(() => { const u = onAuthStateChanged(auth, setUser); return u; }, []);

  useEffect(() => {
    if (!tripId) return;
    (async () => {
      try {
        const snap = await getDoc(doc(db, "AITrips", tripId));
        if (snap.exists()) setTrip({ ...snap.data(), id: tripId });
        else navigate("/my-trips");
      } catch { navigate("/my-trips"); }
      finally { setLoading(false); }
    })();
  }, [tripId, navigate]);

  const handleShare = async () => {
    const url = `${window.location.origin}/view-trip/${tripId}`;
    try {
      if (navigator.share) await navigator.share({ title: "My Trip", url });
      else await navigator.clipboard.writeText(url);
      toast.success("Link copied!");
    } catch {}
  };

  const toggleFilter = (id) =>
    setActiveFilters(prev => prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]);

  if (loading) return <div className="min-h-screen bg-[#f5f5f5]"><Header user={user} /><SkeletonHeader /></div>;
  if (!trip) return null;

  const { userSelection, tripData } = trip;
  const allHotels  = tripData?.hotels || [];
  const itinerary  = tripData?.itinerary || [];
  const budget     = tripData?.budget_breakdown;
  const transports = tripData?.transport || [];

  const getRating = h => parseFloat(h.rating || h.hotelRating || 4.0);
  const hotels = activeFilters.length === 0 ? allHotels : allHotels.filter(h => {
    const r = getRating(h);
    if (activeFilters.includes("exceptional") && r >= 4.5) return true;
    if (activeFilters.includes("excellent")   && r >= 4.0) return true;
    if (activeFilters.includes("very_good")   && r >= 3.5) return true;
    return false;
  });

  const days = parseInt(userSelection?.days) || 1;

  return (
    <div className="min-h-screen bg-[#f5f5f5] text-[#1a1a1a] font-sans pb-16">
      <Header user={user} />

      {/* Blue header bar */}
      <div className="bg-[#003B95] py-5 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
          <div className="text-white">
            <h1 className="text-xl md:text-2xl font-bold">
              {userSelection?.destination}: {allHotels.length} properties found
            </h1>
            <p className="text-white/75 text-sm mt-0.5">
              {userSelection?.startDate
                ? `${userSelection.startDate} – ${userSelection.endDate}`
                : `${days} night${days > 1 ? "s" : ""}`
              } • {userSelection?.traveler}
            </p>
          </div>
          <div className="flex gap-2">
            <button onClick={() => window.print()} className="bg-white/10 hover:bg-white/20 text-white font-bold px-4 py-2 rounded text-sm border border-white/30 flex items-center gap-2 transition-colors">
              <Printer size={15} /> Print
            </button>
            <button onClick={handleShare} className="bg-white text-[#003B95] font-bold px-4 py-2 rounded text-sm flex items-center gap-2 hover:bg-gray-100 transition-colors">
              <Share2 size={15} /> Share
            </button>
          </div>
        </div>
      </div>

      {/* Trip summary strip */}
      <TripSummaryBar userSelection={userSelection} tripData={tripData} />

      <main className="max-w-7xl mx-auto px-4 pt-6 flex flex-col lg:flex-row gap-6">

        {/* ── Sidebar ── */}
        <aside className="w-full lg:w-64 shrink-0 hidden lg:block space-y-4">
          {/* Trip details */}
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
              <h3 className="font-bold text-sm text-gray-900">Trip Details</h3>
            </div>
            <div className="p-4 space-y-3 text-sm">
              <Detail label="Budget"    value={userSelection?.budget ? `₹${Number(userSelection.budget).toLocaleString("en-IN")}` : "—"} />
              <Detail label="Travelers" value={userSelection?.traveler} />
              <Detail label="Duration"  value={`${days} night${days > 1 ? "s" : ""}`} />
              {userSelection?.travelersInfo?.length > 0 && (
                <div className="pl-3 border-l-2 border-gray-200 space-y-1">
                  {userSelection.travelersInfo.map((t, i) => (
                    <div key={i} className="text-xs text-gray-500">{t.name} ({t.age}, {t.gender})</div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Rating filters */}
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <h3 className="font-bold text-sm text-gray-900 mb-3 border-b pb-2">Filter by Rating</h3>
            <div className="space-y-2">
              {[
                { id: "exceptional", label: "Exceptional: 4.5+" },
                { id: "excellent",   label: "Excellent: 4.0+"   },
                { id: "very_good",   label: "Very good: 3.5+"   },
              ].map(f => (
                <label key={f.id} className="flex items-center gap-2 text-sm cursor-pointer">
                  <input type="checkbox" className="w-4 h-4 cursor-pointer accent-[#003B95]"
                    checked={activeFilters.includes(f.id)} onChange={() => toggleFilter(f.id)} />
                  {f.label}
                </label>
              ))}
            </div>
          </div>
        </aside>

        {/* ── Main content ── */}
        <div className="flex-1 min-w-0">

          {/* 1. Hotels */}
          <section className="mb-6">
            <h2 className="text-lg font-bold text-gray-900 mb-3">
              🏨 Recommended Hotels
              <span className="ml-2 text-sm font-normal text-gray-500">({hotels.length} options)</span>
            </h2>
            {hotels.length === 0
              ? <p className="text-gray-500 text-sm">No hotels match the selected filters.</p>
              : hotels.map((hotel, i) => (
                  <HotelCard key={i} hotel={hotel} destination={userSelection?.destination} days={days} />
                ))
            }
          </section>

          {/* 2. Budget Breakdown */}
          {budget ? (
            <section className="mb-6">
              <h2 className="text-lg font-bold text-gray-900 mb-3">💰 Budget Breakdown</h2>
              <BudgetBreakdown budgetData={budget} days={days} />
            </section>
          ) : null}

          {/* 3. Transport */}
          {transports.length > 0 && (
            <section className="mb-6">
              <h2 className="text-lg font-bold text-gray-900 mb-3">🚆 Transport Options</h2>
              <TransportCard transports={transports} destination={userSelection?.destination} />
            </section>
          )}

          {/* 4. Itinerary */}
          <section className="mb-6">
            <h2 className="text-lg font-bold text-gray-900 mb-3">
              📋 Day-wise Itinerary
              <span className="ml-2 text-sm font-normal text-gray-500">({itinerary.length} days)</span>
            </h2>
            {itinerary.map((day, i) => (
              <DaySection key={i} day={day} destination={userSelection?.destination} />
            ))}
          </section>

          {/* 5. Map */}
          <section className="mb-6">
            <h2 className="text-lg font-bold text-gray-900 mb-3">📍 Explore on Map</h2>
            <MapSection destination={userSelection?.destination} />
          </section>

        </div>
      </main>
    </div>
  );
}

function Detail({ label, value }) {
  return (
    <div>
      <span className="font-bold text-gray-700 block text-xs uppercase tracking-wide mb-0.5">{label}</span>
      <span className="text-gray-800">{value || "—"}</span>
    </div>
  );
}