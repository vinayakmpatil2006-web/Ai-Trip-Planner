// Common constants and utilities
export const BUDGET_OPTIONS = [
  { id: "cheap", label: "💰 Budget", description: "₹50,000-1,00,000 (Whole Trip)", value: "Budget (₹50,000-1,00,000)" },
  { id: "moderate", label: "💵 Moderate", description: "₹1,00,000-3,00,000 (Whole Trip)", value: "Moderate (₹1,00,000-3,00,000)" },
  { id: "luxury", label: "💎 Luxury", description: "₹3,00,000+ (Whole Trip)", value: "Luxury (₹3,00,000+)" },
];

export const TRAVELER_OPTIONS = [
  { id: "solo", label: "🧑 Solo", description: "Just me" },
  { id: "couple", label: "👫 Couple", description: "Me and 1 other" },
  { id: "group", label: "👨‍👩‍👧‍👦 Group", description: "3 + people" },
  { id: "family", label: "👨‍👩‍👧 Family", description: "With kids" },
];

export const FEATURES = [
  {
    icon: "🏨",
    title: "Hotel Recommendations",
    description: "Best stays curated by AI",
  },
  {
    icon: "📋",
    title: "Daily Itinerary",
    description: "Hour-by-hour activities",
  },
  {
    icon: "💰",
    title: "Budget Planning",
    description: "Cost estimates included",
  },
  {
    icon: "🗺️",
    title: "Interactive Maps",
    description: "All locations on map",
  },
  {
    icon: "⚡",
    title: "AI Generated",
    description: "In seconds, not hours",
  },
  {
    icon: "✈️",
    title: "Instant Sharing",
    description: "Share with friends",
  },
];

// Location mapping for common destinations
export const DESTINATION_LOCATION_MAP = {
  "Rajasthan": { state: "Rajasthan", cities: ["Jaipur", "Udaipur", "Jodhpur", "Pushkar", "Bikaner"], verifyKeywords: ["Rajasthan", "Jaipur", "Udaipur", "Jodhpur", "Pushkar", "Bikaner"] },
  "Goa": { state: "Goa", cities: ["Panaji", "North Goa", "South Goa", "Anjuna", "Calangute"], verifyKeywords: ["Goa", "Panaji", "North Goa", "South Goa"] },
  "Kerala": { state: "Kerala", cities: ["Kochi", "Thiruvananthapuram", "Munnar", "Alleppey", "Kumarakom"], verifyKeywords: ["Kerala", "Kochi", "Thiruvananthapuram", "Munnar", "Alleppey"] },
  "Mumbai": { city: "Mumbai", state: "Maharashtra", verifyKeywords: ["Mumbai", "Maharashtra"] },
  "Delhi": { city: "Delhi", state: "Delhi", verifyKeywords: ["Delhi", "New Delhi"] },
  "Bangalore": { city: "Bangalore", state: "Karnataka", verifyKeywords: ["Bangalore", "Bengaluru", "Karnataka"] },
};

export const AI_TRIP_PROMPT = `You are an expert Indian travel planner. Generate a complete travel plan for {destination} for {days} days for {traveler} with total budget {budget}. Return ONLY valid JSON — no markdown, no backticks, no extra text. Use this EXACT structure:

{
  "hotels": [
    {
      "name": "Hotel Name",
      "description": "1-2 line description",
      "address": "Full address including {destination}",
      "price": "₹AMOUNT per night",
      "pricePerNight": 2500,
      "hotelType": "Budget",
      "rating": 4.2,
      "amenities": ["WiFi", "AC", "Restaurant"],
      "imageUrl": "https://images.unsplash.com/photo-UNIQUEID?w=600&q=80"
    }
  ],
  "budget_breakdown": {
    "hotelCost": 10000,
    "foodCost": 5000,
    "localTransport": 3000,
    "activities": 4000,
    "travelCost": 3000,
    "total": 25000,
    "category": "Budget"
  },
  "transport": [
    {
      "mode": "Train",
      "icon": "🚆",
      "provider": "IRCTC",
      "price": "₹500 - ₹1500",
      "duration": "8 hours",
      "notes": "Book Mandovi Express or Konkan Kanya",
      "recommended": true
    }
  ],
  "itinerary": [
    {
      "day": 1,
      "title": "Arrival & Exploration",
      "activities": [
        {
          "time": "9:00 AM",
          "timeOfDay": "morning",
          "location": "Place Name",
          "description": "Activity description with cost",
          "ticketPrice": "₹50",
          "imageUrl": "https://images.unsplash.com/photo-UNIQUEID?w=600&q=80"
        }
      ]
    }
  ]
}

=== HOTEL RULES ===
1. Provide EXACTLY 5 hotels ALL in {destination}
2. Every address MUST include "{destination}" or its main city name
3. pricePerNight is a plain integer (no ₹ symbol, no commas)
4. hotelType is one of: Budget | 3-Star | 4-Star | 5-Star
5. Offer variety: 1 budget, 1 economy, 1 mid-range, 1 premium, 1 luxury
6. Max pricePerNight = floor(total_budget_number / {days} * 0.40)
7. Each hotel must have a UNIQUE imageUrl

=== BUDGET_BREAKDOWN RULES ===
1. ALL values are plain integers (no ₹, no commas)
2. hotelCost = mid-range hotel pricePerNight × {days}
3. foodCost = realistic food budget for {days} days for {traveler}
4. localTransport = local auto/taxi/bus costs for all {days} days
5. activities = sum of all entry fees in the itinerary
6. travelCost = realistic one-way fare to reach {destination} from nearest metro city
7. total = hotelCost + foodCost + localTransport + activities + travelCost
8. category: "Budget" if total ≤ 50000 | "Mid-Range" if ≤ 200000 | "Luxury" otherwise

=== TRANSPORT RULES ===
1. Suggest 2-3 realistic options to REACH {destination} from nearest major city
2. Include Train if rail connection exists (provider = IRCTC, specific train names in notes)
3. Include Bus for distances under 500km (use real state RTC: MSRTC, KSRTC, etc.)
4. Include Flight only if distance > 600km OR category is Mid-Range/Luxury
5. Mark exactly ONE option as recommended: true (best value for budget)

=== ITINERARY RULES ===
1. Provide EXACTLY {days} days with 3-4 activities each
2. timeOfDay must be exactly: "morning" | "afternoon" | "evening"
3. ticketPrice must be "₹AMOUNT" or "Free" — never blank
4. All activities must be in {destination} only
5. Each activity must have a UNIQUE imageUrl
6. Mix activity types: cultural, adventure, food, shopping

=== PRICE FORMAT ===
- budget_breakdown values: plain integers
- hotel price field: "₹AMOUNT per night" string
- ticketPrice: "₹AMOUNT" or "Free"

VALIDATION: Before returning, verify ALL 5 hotels are in {destination}, total equals sum of all breakdown items, and {days} days of itinerary are provided.`;




export const DEFAULT_IMAGE = "https://images.unsplash.com/photo-1488646953529-28fb3691c099?w=500&h=300&fit=crop";

export const TOAST_MESSAGES = {
  TRIP_CREATED: "🎉 Trip created successfully!",
  TRIP_DELETED: "🗑️ Trip deleted",
  TRIP_SHARED: "📋 Link copied to clipboard!",
  AUTH_REQUIRED: "Please sign in to continue",
  ERROR_GENERIC: "Something went wrong. Please try again.",
  LOADING_TRIP: "Generating your perfect itinerary...",
  LOADING_TRIPS: "Loading your trips...",
};

// Helper to format date nicely
export const formatDate = (date) => {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

// Helper to get relative time (e.g., "2 days ago", "1 week ago")
export const getRelativeTime = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);
  const diffWeeks = Math.floor(diffDays / 7);
  const diffMonths = Math.floor(diffDays / 30);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins} minute${diffMins !== 1 ? "s" : ""} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours !== 1 ? "s" : ""} ago`;
  if (diffDays < 7) return `${diffDays} day${diffDays !== 1 ? "s" : ""} ago`;
  if (diffWeeks < 4) return `${diffWeeks} week${diffWeeks !== 1 ? "s" : ""} ago`;
  if (diffMonths < 12) return `${diffMonths} month${diffMonths !== 1 ? "s" : ""} ago`;
  
  const diffYears = Math.floor(diffDays / 365);
  return `${diffYears} year${diffYears !== 1 ? "s" : ""} ago`;
};

// Helper to get image URL with fallback
export const getImageUrl = (url) => {
  if (!url) return DEFAULT_IMAGE;
  try {
    new URL(url);
    return url;
  } catch {
    return DEFAULT_IMAGE;
  }
};

// Location validation utility
export const validateHotelLocation = (hotelAddress, destination) => {
  if (!hotelAddress || !destination) return false;
  
  const addressLower = hotelAddress.toLowerCase();
  const destLower = destination.toLowerCase();
  
  // Direct match
  if (addressLower.includes(destLower)) return true;
  
  // Check destination location map
  const destInfo = DESTINATION_LOCATION_MAP[destination];
  if (destInfo && destInfo.verifyKeywords) {
    return destInfo.verifyKeywords.some(keyword => 
      addressLower.includes(keyword.toLowerCase())
    );
  }
  
  return false;
};

// Helper to extract location from address
export const extractLocationFromAddress = (address) => {
  if (!address) return "";
  // Try to extract the last meaningful part (usually city/state)
  const parts = address.split(",");
  return parts.slice(-2).join(",").trim();
};
