// src/pages/MyTrips.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  collection,
  query,
  where,
  getDocs,
  orderBy,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { db, auth } from "../service/firebaseConfig";
import Header from "../components/Header";
import { SkeletonGrid } from "../components/LoadingSkeleton";
import { Search, Trash2, Calendar, Users, DollarSign, CheckCircle, Clock } from "lucide-react";
import { toast } from "sonner";
import { formatDate, getImageUrl, getRelativeTime } from "../constants/uiConfig";

function TripCard({ trip, onDelete }) {
  const navigate = useNavigate();
  const firstHotelImg = trip.tripData?.hotels?.[0]?.imageUrl;
  const [imgSrc, setImgSrc] = useState(firstHotelImg);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await deleteDoc(doc(db, "AITrips", trip.id));
      toast.success("Trip deleted successfully");
      onDelete(trip.id);
    } catch (err) {
      console.error("Delete error:", err);
      toast.error("Failed to delete trip");
    } finally {
      setDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  // Check if trip is completed or upcoming
  const endDate = trip.userSelection?.endDate ? new Date(trip.userSelection.endDate) : null;
  const isCompleted = endDate && endDate < new Date();
  const tripStatus = isCompleted ? "completed" : "upcoming";

  return (
    <div className="group relative rounded-2xl overflow-hidden bg-white border border-gray-200 hover:border-teal-400 transition-all duration-500 hover:shadow-2xl hover:shadow-teal-500/20 hover:scale-105 h-full">
      {/* Status Badge - Top Left */}
      <div className="absolute top-4 left-4 z-20">
        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold backdrop-blur-md border ${
          isCompleted 
            ? "bg-green-100 border-green-400 text-green-700" 
            : "bg-blue-100 border-blue-400 text-blue-700"
        }`}>
          {isCompleted ? (
            <>
              <CheckCircle className="w-3 h-3" />
              Completed
            </>
          ) : (
            <>
              <Clock className="w-3 h-3" />
              Upcoming
            </>
          )}
        </div>
      </div>

      {/* Image Section with Overlay */}
      <div className="relative h-56 overflow-hidden bg-gradient-to-br from-teal-100 to-cyan-100">
        <img
          src={getImageUrl(imgSrc)}
          alt={trip.userSelection?.destination}
          className="w-full h-full object-cover group-hover:scale-125 transition-transform duration-500 brightness-100 group-hover:brightness-110"
          onError={() =>
            setImgSrc(
              "https://images.unsplash.com/photo-1488085061387-422e29b40080?w=600&q=80"
            )
          }
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/30" />
        
        {/* Duration Badge - Top Right */}
        <div className="absolute top-4 right-4">
          <div className="px-4 py-2 bg-gradient-to-r from-orange-400 to-orange-500 text-white font-bold text-sm rounded-full backdrop-blur-md">
            {trip.userSelection?.days} days
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-6 relative z-10">
        <h3 className="font-black text-2xl text-gray-900 mb-4 group-hover:text-teal-600 transition-colors line-clamp-2">
          {trip.userSelection?.destination}
        </h3>

        {/* Badges with Icons */}
        <div className="grid grid-cols-3 gap-3 mb-5">
          <div className="flex flex-col items-center p-3 bg-orange-100 rounded-lg group-hover:bg-orange-200 transition-colors">
            <DollarSign className="w-4 h-4 text-orange-600 mb-1" />
            <span className="text-xs text-orange-900 text-center font-semibold">{trip.userSelection?.budget}</span>
          </div>
          <div className="flex flex-col items-center p-3 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
            <Users className="w-4 h-4 text-blue-600 mb-1" />
            <span className="text-xs text-blue-900 text-center font-semibold line-clamp-1">{trip.userSelection?.traveler?.split(" ")[0]}</span>
          </div>
          <div className="flex flex-col items-center p-3 bg-teal-100 rounded-lg group-hover:bg-teal-200 transition-colors">
            <Calendar className="w-4 h-4 text-teal-600 mb-1" />
            <span className="text-xs text-teal-900 text-center font-semibold">{getRelativeTime(trip.createdAt)}</span>
          </div>
        </div>

        {/* Date Info */}
        <p className="text-xs text-gray-500 mb-5 font-medium">
          Created {formatDate(trip.createdAt)}
        </p>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={() => navigate(`/view-trip/${trip.id}`)}
            className="flex-1 px-4 py-3 bg-gradient-to-r from-teal-500 to-cyan-500 text-white rounded-lg hover:from-teal-600 hover:to-cyan-600 font-bold text-sm transition-all duration-300 hover:shadow-lg hover:shadow-teal-500/30 group/btn"
          >
            View Trip →
          </button>
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="p-3 text-red-500 hover:bg-red-100 rounded-lg transition-all duration-300 hover:text-red-700"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
          <div className="absolute inset-0 bg-black/90 backdrop-blur-md rounded-2xl flex flex-col items-center justify-center gap-6 z-50 p-6">
            <div className="text-4xl">⚠️</div>
            <p className="text-gray-100 font-bold text-center text-lg">
              Delete this trip permanently?
            </p>
            <p className="text-gray-300 text-sm text-center">
              This action cannot be undone.
            </p>
            <div className="flex gap-3 w-full">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                disabled={deleting}
                className="flex-1 px-4 py-3 bg-gray-600 hover:bg-gray-700 rounded-lg text-sm font-bold transition-colors disabled:opacity-50 text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 rounded-lg text-sm font-bold transition-all disabled:opacity-50 text-white shadow-lg"
              >
                {deleting ? "Deleting..." : "Delete Trip"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function MyTrips() {
  const navigate = useNavigate();
  const [allTrips, setAllTrips] = useState([]);
  const [filteredTrips, setFilteredTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("newest");

  // Auth listener
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      if (u) {
        setUser(u);
        fetchTrips(u.email);
      } else {
        navigate("/");
      }
    });
    return unsub;
  }, [navigate]);

  // Fetch trips from Firestore - Fixed for Firestore indexing
  const fetchTrips = async (email) => {
    try {
      const q = query(
        collection(db, "AITrips"),
        where("userEmail", "==", email)
      );
      const snapshot = await getDocs(q);
      const trips = snapshot.docs.map((d) => {
        const data = d.data();
        return { ...data, id: d.id }; // Ensure ID is included
      });
      
      // Sort client-side instead of in query
      trips.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      
      setAllTrips(trips);
      setFilteredTrips(trips);
      console.log("✅ Trips loaded successfully:", trips.length);
    } catch (err) {
      console.error("❌ Failed to fetch trips:", err.message);
      // Still show empty state instead of error toast
      setAllTrips([]);
      setFilteredTrips([]);
    } finally {
      setLoading(false);
    }
  };

  // Handle search and filter
  useEffect(() => {
    let result = allTrips;

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter((trip) =>
        trip.userSelection?.destination?.toLowerCase().includes(query)
      );
    }

    // Sort
    switch (sortBy) {
      case "newest":
        result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      case "oldest":
        result.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        break;
      case "name":
        result.sort((a, b) =>
          (a.userSelection?.destination || "").localeCompare(
            b.userSelection?.destination || ""
          )
        );
        break;
      default:
        break;
    }

    setFilteredTrips(result);
  }, [searchQuery, sortBy, allTrips]);

  // Handle trip deletion
  const handleTripDelete = (tripId) => {
    setAllTrips(allTrips.filter((t) => t.id !== tripId));
  };

  // Separate trips into upcoming and completed
  const upcomingTrips = filteredTrips.filter((trip) => {
    const endDate = trip.userSelection?.endDate ? new Date(trip.userSelection.endDate) : null;
    return !endDate || endDate >= new Date();
  });

  const completedTrips = filteredTrips.filter((trip) => {
    const endDate = trip.userSelection?.endDate ? new Date(trip.userSelection.endDate) : null;
    return endDate && endDate < new Date();
  });

  return (
    <div className="min-h-screen bg-white">
      <Header user={user} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
        {/* Header Section */}
        <div className="mb-12">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 mb-8">
            <div>
              <h1 className="text-5xl sm:text-6xl font-black mb-3 bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">
                My Trips
              </h1>
              <p className="text-gray-600 text-lg">
                {allTrips.length} amazing <span className="text-teal-600 font-bold">{allTrips.length !== 1 ? "adventures" : "adventure"}</span> created
              </p>
            </div>
            <button
              onClick={() => navigate("/create-trip")}
              className="group relative w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-teal-500 to-cyan-500 text-white font-black rounded-xl hover:shadow-2xl hover:shadow-teal-500/40 transition-all duration-300 overflow-hidden text-lg"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-teal-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <span className="relative z-10">+ Create New Trip</span>
            </button>
          </div>

          {/* Search and Sort with Enhanced Design */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative group">
              <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-hover:text-teal-500 transition-colors pointer-events-none" />
              <input
                type="text"
                placeholder="Search destinations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-gray-50 border border-gray-300 group-hover:border-teal-300 pl-12 pr-4 py-3 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/30 transition-all text-lg"
              />
            </div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-6 py-3 bg-gray-50 border border-gray-300 hover:border-teal-300 rounded-xl text-gray-900 focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/30 transition-all font-semibold"
            >
              <option value="newest" className="bg-white">✨ Newest First</option>
              <option value="oldest" className="bg-white">📅 Oldest First</option>
              <option value="name" className="bg-white">A-Z Destination</option>
            </select>
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <SkeletonGrid count={6} />
        ) : allTrips.length === 0 ? (
          <div className="text-center py-32">
            <div className="text-8xl mb-6 animate-bounce">🗺️</div>
            <h2 className="text-4xl font-black mb-3 text-gray-900">No trips yet</h2>
            <p className="text-gray-600 text-lg mb-10 max-w-md mx-auto leading-relaxed">
              Ready to explore? Create your first AI-powered trip and discover amazing adventures!
            </p>
            <button
              onClick={() => navigate("/create-trip")}
              className="px-10 py-4 bg-gradient-to-r from-teal-500 to-cyan-500 text-white font-black rounded-xl hover:shadow-2xl hover:shadow-teal-500/40 transition-all text-lg"
            >
              ✨ Plan Your First Trip
            </button>
          </div>
        ) : (
          <div className="space-y-16">
            {/* ✈️ UPCOMING TRIPS DASHBOARD */}
            <section>
              <div className="flex items-center gap-3 mb-8">
                <div className="text-3xl">✈️</div>
                <div>
                  <h2 className="text-3xl sm:text-4xl font-black text-gray-900">Upcoming Trips</h2>
                  <p className="text-gray-600 text-sm mt-1">{upcomingTrips.length} trip{upcomingTrips.length !== 1 ? "s" : ""} planned</p>
                </div>
              </div>
              
              {upcomingTrips.length === 0 ? (
                <div className="text-center py-16 bg-gray-50 border-2 border-dashed border-gray-300 rounded-2xl">
                  <div className="text-5xl mb-3">🗓️</div>
                  <p className="text-gray-500 text-lg">No upcoming trips yet</p>
                  <button
                    onClick={() => navigate("/create-trip")}
                    className="mt-4 px-6 py-2 bg-teal-100 hover:bg-teal-200 border border-teal-400 text-teal-700 font-bold rounded-lg transition-all"
                  >
                    Plan a trip
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {upcomingTrips.map((trip, i) => (
                    <TripCard
                      key={i}
                      trip={trip}
                      onDelete={handleTripDelete}
                    />
                  ))}
                </div>
              )}
            </section>

            {/* ✅ COMPLETED TRIPS DASHBOARD */}
            {completedTrips.length > 0 && (
              <section className="pt-8 border-t border-gray-300">
                <div className="flex items-center gap-3 mb-8">
                  <div className="text-3xl">✅</div>
                  <div>
                    <h2 className="text-3xl sm:text-4xl font-black text-gray-900">Completed Adventures</h2>
                    <p className="text-gray-600 text-sm mt-1">{completedTrips.length} trip{completedTrips.length !== 1 ? "s" : ""} completed</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {completedTrips.map((trip, i) => (
                    <TripCard
                      key={i}
                      trip={trip}
                      onDelete={handleTripDelete}
                    />
                  ))}
                </div>
              </section>
            )}

            {/* No results message */}
            {filteredTrips.length === 0 && (
              <div className="text-center py-32">
                <div className="text-8xl mb-6">🔍</div>
                <h2 className="text-4xl font-black mb-3 text-gray-900">No trips found</h2>
                <p className="text-gray-600 text-lg mb-10">
                  Try adjusting your search or sorting options
                </p>
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setSortBy("newest");
                  }}
                  className="px-8 py-4 bg-white/10 hover:bg-white/20 rounded-xl transition-all font-bold text-lg"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
