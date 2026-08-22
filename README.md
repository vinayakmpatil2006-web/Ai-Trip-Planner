AI Trip Planner

An intelligent travel planning application powered by Groq AI and Firebase. Create personalized trip itineraries with AI-generated recommendations, manage multiple trips, search and filter your itineraries, and explore destination details with integrated Google Maps.

**[Full UI Documentation →](./UI_SYSTEM.md)**

## ✨ Features

### Core Features
- **AI-Powered Itineraries**: Generate personalized trip plans using Groq and Llama 3.3 in seconds
- **Hotel Recommendations**: Curated hotel suggestions with prices and ratings
- **Daily Itineraries**: Hour-by-hour activity plans with Google Maps integration
- **Multi-Trip Management**: Create, view, search, filter, and delete trips
- **User Authentication**: Secure Google Sign-in with persistent sessions

### UI/UX Features
- **Professional Dashboard**: Beautiful, modern interface with dark theme
- **Search & Filter**: Find trips by destination or sort by date/name
- **Trip Sharing**: Copy shareable links to your itineraries
- **Responsive Design**: Works seamlessly on mobile, tablet, and desktop
- **Real-time Validation**: Inline form validation with helpful error messages
- **Loading States**: Smooth skeleton screens and loading indicators
- **Responsive Navigation**: Sticky header with mobile menu

## Tech Stack

- **Frontend**: React 18.3, React Router 6
- **Styling**: Tailwind CSS, PostCSS, Autoprefixer
- **UI Components**: Lucide React Icons
- **AI**: Groq API with Llama 3.3 70B
- **Backend**: Firebase (Firestore, Authentication)
- **Build**: Vite 5.4
- **Notifications**: Sonner Toast

## Project Structure

```
src/
├── App.jsx                 # Main app with routes
├── main.jsx               # React entry point
├── index.css              # Global styles (Tailwind)
├── ErrorBoundary.jsx      # Error handling component
├── components/
│   ├── Header.jsx         # Reusable header with auth
│   └── LoadingSkeleton.jsx # Loading animations
├── constants/
│   ├── options.jsx        # Budget/traveler options
│   └── uiConfig.js        # UI constants & helpers
├── create-trip/
│   └── index.jsx          # Trip creation form
├── pages/
│   ├── LandingPage.jsx    # Homepage
│   └── MyTrips.jsx        # Trip gallery & search
├── service/
│   ├── firebaseConfig.js  # Firebase setup
│   └── AIModel.js         # Gemini AI service
└── view-trip/
    └── [tripId]/
        └── index.jsx      # Trip detail view
```

## Installation & Setup

### Prerequisites
- Node.js 16+ and npm/yarn
- Groq account with an API key
- Google Cloud account with Maps APIs enabled
- Firebase project

### Step 1: Clone and Install

```bash
# Install dependencies
npm install

# Note: lucide-react was added for icons
# Ensure it's installed:
npm install lucide-react
```

### Step 2: Configure APIs

**1. Groq API**
- Go to [console.groq.com/keys](https://console.groq.com/keys)
- Create an API key
- Copy the key

**2. Firebase Setup**
- Go to [console.firebase.google.com](https://console.firebase.google.com)
- Create new project
- Enable Authentication (Google Sign-in)
- Create Firestore Database (production mode)
- Go to Project Settings → Service Accounts
- Copy the `firebaseConfig` JSON

**3. Google Maps API**
- Go to [console.cloud.google.com](https://console.cloud.google.com)
- Enable "Maps JavaScript API"
- Enable "Places API"
- Create API key

### Step 3: Create .env File

```bash
cp .env.example .env
```

Then fill in your credentials:

```env
# Groq API Key
VITE_GROQ_API_KEY=your_groq_api_key_here
# Optional model override if the default model is unavailable
VITE_GROQ_MODEL=llama-3.3-70b-versatile

# Firebase Configuration
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id

# Google Maps API Key
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
```

### Step 4: Run Development Server

```bash
npm run dev
```

The app will open at `http://localhost:5173`

### Step 5: Build for Production

```bash
npm run build

# Preview the production build
npm run preview
```

## User Guide

### Creating a Trip

1. **Click "Get Started"** on the landing page
2. **Fill the form:**
   - Destination (use autocomplete)
   - Trip duration (1-10 days)
   - Budget level (Budget/Moderate/Luxury)
   - Travel group (Solo/Couple/Family/Group)
3. **Sign in with Google** when prompted
4. **Wait for AI generation** (15-30 seconds)
5. **View your itinerary** with hotels and activities

### Managing Trips

- **View All Trips**: Click "My Trips" in header
- **Search**: Type destination name in search box
- **Sort**: Change sort order (newest, oldest, A-Z)
- **Delete**: Click trash icon and confirm
- **View Details**: Click trip card to see full itinerary
- **Share**: Click share button to copy link

### Trip Details

- **Hotels**: Click hotel cards to view on Google Maps
- **Activities**: Click activities to see locations
- **Metadata**: View trip budget, duration, travelers
- **Share**: Copy link to share with others

## Troubleshooting

### "Google Maps not loading"
- ✅ Verify `VITE_GOOGLE_MAPS_API_KEY` in `.env`
- ✅ Enable "Maps JavaScript API" in Google Cloud
- ✅ Enable "Places API" in Google Cloud
- ✅ Check API key quotas and limits

### "Firestore permission denied"
- ✅ Check Firebase Firestore rules are in production mode
- ✅ Ensure user is authenticated
- ✅ Verify `VITE_FIREBASE_*` variables are correct

### "Trip generation fails"
- ✅ Verify `VITE_GROQ_API_KEY` is valid
- ✅ Check API limits in the Groq console
- ✅ Ensure destination is a real city
- ✅ Check browser console for specific error

### "Images not loading"
- ✅ Check internet connection
- ✅ Verify Unsplash/image service is accessible
- ✅ App will use fallback images if needed

### Mobile responsive issues
- ✅ Clear browser cache
- ✅ Check viewport meta tag in index.html
- ✅ Test on different screen sizes

## Security

⚠️ **Important Security Practices:**
- `.env` file is in `.gitignore` and never committed
- `.env.example` contains only placeholders
- Never commit API keys or share them publicly
- Treat Vite environment variables as browser-visible; restrict and rotate keys as needed
- Firebase authentication is required for operations
- Firestore security rules limit data access
- If keys are exposed, regenerate them immediately

## Performance Tips

- **First Load**: App loads quickly with Vite
- **Images**: Use fallback images if loading fails
- **API Calls**: Rate limits apply to Gemini and Maps APIs
- **Caching**: Browser caches pages for faster returns
- **Optimization**: Tailwind CSS is production-optimized

## Browser Support

- ✅ Chrome/Edge (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

## API Limits & Costs

### Groq API
- Limits vary by model and account tier
- Check the current limits and pricing in the [Groq console](https://console.groq.com/settings/limits)

### Google Maps API
- Free tier: $200/month credit
- Pay-as-you-go after credit
- See [pricing](https://cloud.google.com/maps-platform/pricing)

### Firebase
- Free tier: 1GB storage, limited reads/writes
- Generous free tier for testing
- See [pricing](https://firebase.google.com/pricing)

## Development

### File Structure
- `/src` - Source code
- `/public` - Static assets
- `/dist` - Production build (generated)
- `index.html` - HTML entry point
- `vite.config.js` - Vite configuration
- `tailwind.config.js` - Tailwind config
- `postcss.config.js` - PostCSS config

### Available Scripts
```bash
npm run dev      # Start dev server
npm run build    # Build for production
npm run preview  # Preview production build
```

### Important Files
- `src/service/AIModel.js` - Gemini API integration
- `src/service/firebaseConfig.js` - Firebase setup
- `src/constants/uiConfig.js` - UI constants
- `UI_SYSTEM.md` - Component documentation

## Future Roadmap

- [ ] **Edit/Regenerate**: Modify and regenerate trips
- [ ] **Collaborative Planning**: Share editing with friends
- [ ] **Offline Mode**: PWA support for offline viewing
- [ ] **Budget Calculator**: Track estimated costs
- [ ] **Weather Integration**: Show forecasts for travel dates
- [ ] **Restaurant Recommendations**: Food suggestions
- [ ] **PDF Export**: Download itineraries as PDF
- [ ] **Templates**: Pre-built trip ideas
- [ ] **Notifications**: Reminder alerts
- [ ] **Multi-Language**: Support for multiple languages

## License

Created for educational purposes.

## Support & Questions

For detailed component documentation, see [UI_SYSTEM.md](./UI_SYSTEM.md)

Common issues and solutions are documented in the Troubleshooting section above.
