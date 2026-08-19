// src/App.jsx
import { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";
import ErrorBoundary from "./ErrorBoundary";
import { ThemeProvider } from "./context/ThemeContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import LandingPage from "./pages/LandingPage";
import SignUpPage from "./pages/SignUpPage";
import SignInPage from "./pages/SignInPage";
import CreateTrip from "./create-trip/index";
import ViewTrip from "./view-trip/[tripId]/index";
import MyTrips from "./pages/MyTrips";

export default function App() {
  // Load Google Maps API on app initialization
  useEffect(() => {
    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
    console.log("🔍 Checking Google Maps API key...", apiKey ? "✅ Present" : "❌ Missing");

    if (!apiKey) {
      console.error("❌ VITE_GOOGLE_MAPS_API_KEY not found in environment");
      return;
    }

    // If SDK is already loaded (e.g. HMR), resolve immediately
    if (window.google?.maps?.places) {
      console.log("✅ Google Maps API already loaded");
      if (!window._mapsReadyPromise) {
        window._mapsReadyPromise = Promise.resolve();
      }
      return;
    }

    // Create a promise that resolves once the Maps SDK fires onload
    if (!window._mapsReadyPromise) {
      window._mapsReadyPromise = new Promise((resolve, reject) => {
        window._mapsReadyResolve = resolve;
        window._mapsReadyReject = reject;
      });
    }

    // Prevent duplicate script loading
    if (document.getElementById("google-maps-script")) {
      console.log("ℹ️ Google Maps script already queued");
      return;
    }

    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
    script.async = true;
    script.defer = true;
    script.id = "google-maps-script";

    script.onload = () => {
      console.log("✅ Google Maps + Places API loaded successfully");
      window._mapsReadyResolve?.();
    };

    script.onerror = (err) => {
      console.error("❌ Failed to load Google Maps API");
      console.error("   - Check API key is correct");
      console.error("   - Ensure Maps JavaScript API AND Places API are enabled in Google Cloud Console");
      console.error("   - API Key prefix:", apiKey?.substring(0, 10) + "...");
      window._mapsReadyReject?.(err);
    };

    document.head.appendChild(script);
  }, []);

  return (
    <ThemeProvider>
      <ErrorBoundary>
        <BrowserRouter>
          <Toaster richColors position="top-center" />
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/signup" element={<SignUpPage />} />
            <Route path="/signin" element={<SignInPage />} />
            <Route
              path="/create-trip"
              element={
                <ProtectedRoute>
                  <CreateTrip />
                </ProtectedRoute>
              }
            />
            <Route
              path="/view-trip/:tripId"
              element={
                <ProtectedRoute>
                  <ViewTrip />
                </ProtectedRoute>
              }
            />
            <Route
              path="/my-trips"
              element={
                <ProtectedRoute>
                  <MyTrips />
                </ProtectedRoute>
              }
            />
          </Routes>
        </BrowserRouter>
      </ErrorBoundary>
    </ThemeProvider>
  );
}
