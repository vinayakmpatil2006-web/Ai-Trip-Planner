# Getting Your Gemini API Key (REQUIRED)

⚠️ **Trip generation will NOT work without a valid Gemini API key!**

## Steps to Get Your Gemini API Key:

### 1. Open Google AI Studio
- Go to: **https://aistudio.google.com/app/apikey**
- Sign in with your Google account

### 2. Create API Key
- Click **"Create API key"** button
- Select **"Create API key in new project"** or use existing project
- Copy the generated API key (it will look different from Firebase keys)

### 3. Add to .env File
```env
VITE_GEMINI_API_KEY=your_gemini_api_key_here
```

### 4. Important: Restart Dev Server
After updating `.env`:
```bash
# Stop: Ctrl+C
# Then: npm run dev
```

---

## Troubleshooting

### ❌ Error: "Invalid API key"
- Make sure you're using a **Gemini API key** from aistudio.google.com
- NOT a Firebase key or Google Cloud key
- Try creating a new key at https://aistudio.google.com/app/apikey

### ❌ Error: "401 Unauthorized"
- API key might be revoked or expired
- Generate a new one at https://aistudio.google.com/app/apikey

### ❌ Error: "429 Rate Limit"
- You've made too many requests
- Wait a moment and try again

### ❌ Error: "Response format error"
- The AI response wasn't valid JSON
- Try entering a simpler destination
- Check console (F12) for full error

---

## Verify Your Setup

1. Open browser console: **F12**
2. Go to create-trip page
3. Look for messages in console showing:
   - ✅ "Google Maps API loaded successfully"
   - ✅ Gemini API initialization (should NOT show errors)
4. Check the Network tab for API calls to `googleapis.com`

---

## Getting More Help

- Browser Console (F12) → Console tab shows detailed errors
- Check .env file has all keys filled in (no "your_..." placeholders)
- Make sure dev server was restarted after .env changes
