# 🔥 Firebase Setup Guide for VoyageAI

## Step 1: Create a Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create Project" or "Add Project"
3. Enter project name (e.g., "ai-trip-planner")
4. Click "Continue"

## Step 2: Enable Google Authentication
1. In Firebase Console, go to **Authentication** (left sidebar)
2. Click **Get Started**
3. Click on **Google** provider
4. Toggle **Enable** ON
5. Select your project email as the support email
6. Click **Save**

## Step 3: Get Your Web App Credentials
1. In Firebase Console, click ⚙️ **Settings** (gear icon, top left)
2. Select your project → **Project Settings**
3. Go to **Your apps** section
4. Click on your **Web app** (or create one if needed)
5. Copy the entire `firebaseConfig` object:

```javascript
{
  apiKey: "YOUR_API_KEY",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.firebasestorage.app",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef123456"
}
```

## Step 4: Update Your .env File
Replace the placeholder values in `.env`:

```env
VITE_FIREBASE_API_KEY=YOUR_API_KEY
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abcdef123456
```

## Step 5: Authorize Localhost
1. Go to **Authentication** → **Settings** (tab at top)
2. Scroll down to **Authorized domains**
3. Click **Add domain**
4. Add these domains:
   - `localhost`
   - `localhost:5174` (your Vite dev port)
   - `127.0.0.1:5174`

## Step 6: Create Firestore Database
1. Go to **Firestore Database** (left sidebar)
2. Click **Create Database**
3. Select **Start in test mode** (for development)
4. Choose a location (e.g., asia-south1 for India)
5. Click **Create**

## Step 7: Test Your Setup
1. Save the `.env` file
2. Restart your dev server: `npm run dev`
3. Try signing in with Google

## ✅ Troubleshooting

### Issue: "popup-closed-by-user"
- This is normal if the user closes the popup

### Issue: "auth/invalid-api-key"
- Your Firebase API key is incorrect
- Double-check from Step 3

### Issue: "auth/unauthorized-domain"
- `localhost` is not in authorized domains
- Add it in Step 5

### Issue: "auth/cors_unsupported_client"
- Make sure Google authentication is **enabled** in Firebase
- Check project settings for correct credentials

---

**Questions?** Check Firebase docs: https://firebase.google.com/docs/auth
