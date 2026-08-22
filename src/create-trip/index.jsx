// src/create-trip/index.jsx
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { GoogleAuthProvider, signInWithPopup, onAuthStateChanged } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { db, auth } from "../service/firebaseConfig";
import { chatSession } from "../service/AIModel";
import { AI_TRIP_PROMPT, BUDGET_OPTIONS, TRAVELER_OPTIONS } from "../constants/uiConfig";
import { toast } from "sonner";
import Header from "../components/Header";
import { Loader, MapPin, Calendar, IndianRupee, Users, Info } from "lucide-react";

function useGooglePlacesAutocomplete(inputRef, onSelect) {
  useEffect(() => {
    if (!inputRef.current || !window.google) return;
    const autocomplete = new window.google.maps.places.Autocomplete(
      inputRef.current,
      { types: ["(cities)"] }
    );
    autocomplete.addListener("place_changed", () => {
      const place = autocomplete.getPlace();
      if (place?.formatted_address) {
        onSelect(place.formatted_address);
      }
    });
  }, [inputRef, onSelect]);
}

export default function CreateTrip() {
  const navigate = useNavigate();
  
  // Form State
  const [destination, setDestination] = useState("");
  const [days, setDays] = useState("");
  const [budget, setBudget] = useState("");
  const [traveler, setTraveler] = useState("");
  const [travelers, setTravelers] = useState([]);
  const [currentMember, setCurrentMember] = useState({ 
    name: "", age: "", gender: "", healthIssues: "", recentFever: false, type: "adult", phone: "" 
  });
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  
  // UI State
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const [errors, setErrors] = useState({});
  
  const destinationRef = useRef(null);
  useGooglePlacesAutocomplete(destinationRef, setDestination);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => setUser(u));
    return unsub;
  }, []);

  useEffect(() => {
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      if (end >= start) {
        const tripDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
        setDays(tripDays.toString());
      }
    }
  }, [startDate, endDate]);

  const addFamilyMember = () => {
    if (currentMember.name.trim() && currentMember.age && currentMember.gender) {
      setTravelers([...travelers, { ...currentMember, id: Date.now() }]);
      setCurrentMember({ name: "", age: "", gender: "", healthIssues: "", recentFever: false, type: "adult", phone: "" });
      setErrors({...errors, travelers: ""});
    } else {
      toast.error("Please fill Name, Age and Gender");
    }
  };

  const removeFamilyMember = (id) => {
    setTravelers(travelers.filter((m) => m.id !== id));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!destination.trim()) newErrors.destination = "Destination is required";
    if (!startDate) newErrors.startDate = "Start date is required";
    if (!endDate) newErrors.endDate = "End date is required";
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      if (start >= end) newErrors.endDate = "End date must be after start date";
    }
    if (!budget || isNaN(budget) || +budget < 10000) newErrors.budget = "Valid budget required (min ₹10,000)";
    if (!traveler) newErrors.traveler = "Please select your travel group";
    
    const needsMembers = traveler.includes("Family") || traveler.includes("Group") || traveler.includes("Couple");
    if (needsMembers && travelers.length === 0) {
      newErrors.travelers = "Please add at least one member";
    }
    
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      toast.error("Please fix the errors in the form.");
    }
    return Object.keys(newErrors).length === 0;
  };

  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      if (result.user) {
        setUser(result.user);
        setShowAuthDialog(false);
        toast.success(`Welcome, ${result.user.displayName}! 🎉`);
        setTimeout(() => generateTrip(result.user), 500);
      }
    } catch (err) {
      toast.error("Sign-in failed. Check setup.");
    }
  };

  const generateTrip = async (currentUser) => {
    if (!validateForm()) return;
    setLoading(true);
    try {
      const budgetText = `₹${Number(budget).toLocaleString('en-IN')}`;
      let travelerInfo = traveler;
      const needsMembers = traveler.includes("Family") || traveler.includes("Group") || traveler.includes("Couple");
      if (needsMembers && travelers.length > 0) {
        travelerInfo += " with " + travelers.length + " members";
      }
      
      const prompt = AI_TRIP_PROMPT
        .replace("{destination}", destination)
        .replace("{days}", days || "1")
        .replace("{traveler}", travelerInfo)
        .replace("{budget}", budgetText);

      toast.loading("Searching for the best options...", { id: "trip-gen" });
      const response = await chatSession.generateContent(prompt);
      const rawText = response.response.text();
      
      const cleaned = rawText.replace(/```json|```|`/gi, "").trim();
      let tripData;
      try {
        tripData = JSON.parse(cleaned);
      } catch {
        throw new Error("The AI returned an incomplete itinerary. Please try again with fewer nights.");
      }

      const docId = Date.now().toString();
      await setDoc(doc(db, "AITrips", docId), {
        userSelection: { destination, days: days || "1", budget, traveler, travelersInfo: travelers, startDate, endDate },
        tripData,
        userEmail: currentUser.email,
        id: docId,
        createdAt: new Date().toISOString(),
      });

      toast.dismiss("trip-gen");
      toast.success("Done!");
      navigate(`/view-trip/${docId}`);
    } catch (err) {
      toast.dismiss("trip-gen");
      console.error("Trip generation failed:", err);

      const status = err?.status || err?.response?.status;
      const message = err?.message || "";
      if (!import.meta.env.VITE_GROQ_API_KEY) {
        toast.error("Groq API key is missing. Add VITE_GROQ_API_KEY to .env and restart the app.");
      } else if (status === 401 || message.toLowerCase().includes("invalid api key")) {
        toast.error("Groq API key is invalid or expired. Check your .env file.");
      } else if (status === 429 || message.toLowerCase().includes("rate limit")) {
        toast.error("AI rate limit reached. Please wait a moment and try again.");
      } else if (status === 404 || message.toLowerCase().includes("decommissioned") || message.toLowerCase().includes("model")) {
        toast.error("The configured AI model is unavailable. Set VITE_GROQ_MODEL in .env and restart the app.");
      } else if (message.includes("incomplete itinerary")) {
        toast.error(message);
      } else if (err?.code === "permission-denied" || err?.code === "failed-precondition") {
        toast.error("Trip generated, but Firebase could not save it. Check Firestore rules.");
      } else {
        toast.error("Trip generation failed. Check the console for details and try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = () => {
    if (!user) setShowAuthDialog(true);
    else generateTrip(user);
  };

  return (
    <div className="trip-form min-h-screen bg-[#f5f5f5] text-[#1a1a1a] dark:bg-slate-950 dark:text-slate-100 font-sans">
      <Header user={user} />

      <main className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Plan your perfect trip</h1>
        
        <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-lg shadow-sm p-6 space-y-6">
          {/* Destination & Dates */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block font-bold text-sm mb-1">Destination</label>
              <div className="relative border border-gray-300 rounded focus-within:ring-2 focus-within:ring-booking-link overflow-hidden">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MapPin className="text-gray-400" size={20} />
                </div>
                <input
                  ref={destinationRef}
                  type="text"
                  value={destination}
                  onChange={(e) => { setDestination(e.target.value); setErrors({...errors, destination: ""}); }}
                  className="w-full pl-10 pr-3 py-3 outline-none"
                  placeholder="Where are you going?"
                />
              </div>
              {errors.destination && <p className="text-[#d4111e] text-sm mt-1">{errors.destination}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-sm mb-1">Check-in Date</label>
                <div className="relative border border-gray-300 rounded focus-within:ring-2 focus-within:ring-booking-link">
                  <input
                    type="date"
                    value={startDate}
                    min={new Date().toISOString().split('T')[0]}
                    onChange={(e) => { setStartDate(e.target.value); setErrors({...errors, startDate: ""}); }}
                    className="w-full px-3 py-3 outline-none bg-transparent"
                  />
                </div>
                {errors.startDate && <p className="text-[#d4111e] text-sm mt-1">{errors.startDate}</p>}
              </div>
              <div>
                <label className="block font-bold text-sm mb-1">Check-out Date</label>
                <div className="relative border border-gray-300 rounded focus-within:ring-2 focus-within:ring-booking-link">
                  <input
                    type="date"
                    value={endDate}
                    min={startDate || new Date().toISOString().split('T')[0]}
                    onChange={(e) => { setEndDate(e.target.value); setErrors({...errors, endDate: ""}); }}
                    className="w-full px-3 py-3 outline-none bg-transparent"
                  />
                </div>
                {errors.endDate && <p className="text-[#d4111e] text-sm mt-1">{errors.endDate}</p>}
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block font-bold text-sm mb-1">Duration (Nights)</label>
              <div className="border border-gray-300 rounded bg-gray-100">
                <input
                  type="text"
                  value={days ? `${days} night${days > 1 ? 's' : ''}` : ""}
                  className="w-full px-3 py-3 outline-none bg-transparent text-gray-500 cursor-not-allowed"
                  placeholder="Auto-calculated"
                  readOnly
                />
              </div>
            </div>
            
            <div>
              <label className="block font-bold text-sm mb-1">Total Budget (₹)</label>
              <div className="relative border border-gray-300 rounded focus-within:ring-2 focus-within:ring-booking-link">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <IndianRupee className="text-gray-400" size={20} />
                </div>
                <input
                  type="number"
                  value={budget}
                  onChange={(e) => { setBudget(e.target.value); setErrors({...errors, budget: ""}); }}
                  className="w-full pl-10 pr-3 py-3 outline-none"
                  placeholder="e.g. 50000"
                />
              </div>
              {errors.budget && <p className="text-[#d4111e] text-sm mt-1">{errors.budget}</p>}
            </div>
          </div>

          <hr className="border-gray-200" />

          {/* Travelers */}
          <div>
            <label className="block font-bold text-lg mb-4">Who is traveling?</label>
            <div className="grid grid-cols-2 gap-4">
              {TRAVELER_OPTIONS.map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => { setTraveler(opt.label); setErrors({...errors, traveler: ""}); }}
                  className={`p-4 border rounded text-left transition-all ${
                    traveler === opt.label 
                      ? "border-booking-link bg-[#f0f6ff] ring-1 ring-booking-link" 
                      : "border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  <div className="font-bold">{opt.label}</div>
                  <div className="text-sm text-gray-500">{opt.description}</div>
                </button>
              ))}
            </div>
            {errors.traveler && <p className="text-[#d4111e] text-sm mt-2">{errors.traveler}</p>}
          </div>

          {(traveler.includes("Family") || traveler.includes("Group") || traveler.includes("Couple")) && (
            <div className="bg-[#f0f6ff] p-5 rounded border border-[#cce1ff] mt-4">
              <h3 className="font-bold text-booking-link mb-4 flex items-center gap-2"><Info size={18}/> Add Member Details</h3>
              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <input type="text" placeholder="Name" className="p-2 border border-gray-300 rounded focus:border-booking-link outline-none" value={currentMember.name} onChange={e => setCurrentMember({...currentMember, name: e.target.value})} />
                <input type="number" placeholder="Age" className="p-2 border border-gray-300 rounded focus:border-booking-link outline-none" value={currentMember.age} onChange={e => setCurrentMember({...currentMember, age: e.target.value})} />
                <select className="p-2 border border-gray-300 rounded focus:border-booking-link outline-none" value={currentMember.gender} onChange={e => setCurrentMember({...currentMember, gender: e.target.value})}>
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
                <input type="tel" placeholder="Phone Number" className="p-2 border border-gray-300 rounded focus:border-booking-link outline-none" value={currentMember.phone || ""} onChange={e => setCurrentMember({...currentMember, phone: e.target.value})} />
                <input type="text" placeholder="Any Disease/Health Issues (Optional)" className="p-2 border border-gray-300 rounded focus:border-booking-link outline-none" value={currentMember.healthIssues} onChange={e => setCurrentMember({...currentMember, healthIssues: e.target.value})} />
                <div className="flex items-center gap-2 p-2 bg-white border border-gray-300 rounded">
                  <input type="checkbox" id="recentFever" checked={currentMember.recentFever} onChange={e => setCurrentMember({...currentMember, recentFever: e.target.checked})} className="w-4 h-4 text-booking-link" />
                  <label htmlFor="recentFever" className="cursor-pointer">Recent Fever?</label>
                </div>
              </div>
              <button onClick={addFamilyMember} className="px-4 py-2 bg-white border border-booking-link text-booking-link rounded font-bold hover:bg-[#f0f6ff] transition-colors">Add Member</button>
              
              {travelers.length > 0 && (
                <div className="mt-6 space-y-2">
                  <h4 className="font-bold text-sm">Added Members:</h4>
                  {travelers.map(member => (
                    <div key={member.id} className="flex justify-between items-center bg-white p-3 rounded border border-gray-200">
                      <div>
                        <span className="font-bold">{member.name}</span> <span className="text-gray-500">({member.age}, {member.gender})</span>
                        {member.phone && <span className="text-sm"> • {member.phone}</span>}
                        {member.healthIssues && <span className="text-sm text-[#d4111e] ml-2">[{member.healthIssues}]</span>}
                        {member.recentFever && <span className="text-sm text-[#d4111e] ml-2">[Recent Fever]</span>}
                      </div>
                      <button onClick={() => removeFamilyMember(member.id)} className="text-[#d4111e] hover:underline text-sm font-bold">Remove</button>
                    </div>
                  ))}
                </div>
              )}
              {errors.travelers && <p className="text-[#d4111e] text-sm mt-2">{errors.travelers}</p>}
            </div>
          )}

          <div className="pt-4 border-t border-gray-200">
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full py-4 rounded text-white font-bold text-xl bg-booking-link hover:bg-[#0057B8] transition-colors flex items-center justify-center gap-2"
            >
              {loading ? <Loader className="animate-spin" /> : "Search"}
            </button>
          </div>
        </div>
      </main>

      {/* Auth Dialog */}
      {showAuthDialog && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-8 max-w-sm w-full shadow-xl relative">
            <h3 className="text-2xl font-bold mb-2">Sign in or create an account</h3>
            <p className="text-gray-600 mb-6 text-sm">You need to be signed in to save and view your trips.</p>
            <button onClick={handleGoogleLogin} className="w-full py-3 bg-white border border-gray-300 rounded font-bold hover:bg-gray-50 transition-all flex items-center justify-center gap-3 mb-4">
              <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-5 h-5"/> Continue with Google
            </button>
            <button onClick={() => setShowAuthDialog(false)} className="w-full text-booking-link hover:underline font-bold text-sm">Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}
