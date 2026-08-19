// src/constants/options.jsx

export const SelectTravelList = [
  {
    id: 1,
    title: "Just Me",
    desc: "A sole traveler in exploration",
    icon: "🧑",
    people: "Solo",
    label: "🧑 Solo",
  },
  {
    id: 2,
    title: "A Couple",
    desc: "Two travelers in tandem",
    icon: "👫",
    people: "Couple",
    label: "👫 Couple",
  },
  {
    id: 3,
    title: "Family",
    desc: "A group of fun-loving adventurers",
    icon: "👨‍👩‍👧",
    people: "Family",
    label: "👨‍👩‍👧 Family",
  },
  {
    id: 4,
    title: "Friends",
    desc: "A bunch of thrill-seekers",
    icon: "👨‍👩‍👧‍👦",
    people: "Group",
    label: "👨‍👩‍👧‍👦 Group",
  },
];

export const SelectBudgetOptions = [
  {
    id: 1,
    title: "Budget",
    desc: "Stay conscious of costs",
    icon: "💰",
    value: "$",
    label: "💰 Budget",
  },
  {
    id: 2,
    title: "Moderate",
    desc: "Keep costs on the average side",
    icon: "💵",
    value: "$$",
    label: "💵 Moderate",
  },
  {
    id: 3,
    title: "Luxury",
    desc: "Don't worry about costs",
    icon: "💎",
    value: "$$$",
    label: "💎 Luxury",
  },
];

export const AI_PROMPT = `Generate a detailed travel plan for location: {location}, for {totalDays} days for {traveler} people with a {budget} budget. 
Provide the output as a single, strict JSON object with no markdown, no code fences, and no extra text.
The JSON object must follow this exact schema:
{
  "hotels": [
    {
      "name": "string",
      "address": "string",
      "price": "string (e.g. '$150/night')",
      "imageUrl": "string (a real, publicly accessible image URL from unsplash.com or similar)",
      "rating": "string",
      "description": "string"
    }
  ],
  "itinerary": [
    {
      "day": number,
      "title": "string (e.g. 'Cultural Day')",
      "activities": [
        {
          "time": "string (e.g. '9:00 AM')",
          "location": "string",
          "description": "string",
          "imageUrl": "string (a real, publicly accessible image URL, must be different hotel/place images)",
          "ticketPricing": "string (e.g. 'Free' or '$20/person')",
          "timeToVisit": "string (e.g. '2-3 hours')"
        }
      ]
    }
  ]
}
Return ONLY the JSON object. No explanation, no markdown, no code block. Make sure all imageUrls are real, public URLs.`;
