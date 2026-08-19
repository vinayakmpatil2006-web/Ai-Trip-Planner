# ✅ Firebase Sign-In Troubleshooting Checklist

## 🚨 If You're Getting "Sign-in Failed" Error, Check These:

### 1. ✅ Firebase Project Created
- [ ] Go to [Firebase Console](https://console.firebase.google.com/)
- [ ] You have a project created
- [ ] Project is active/accessible

### 2. ✅ Google Authentication Enabled
- [ ] Go to **Authentication** in Firebase left menu
- [ ] Click the **Google** provider
- [ ] Status shows **Enabled** (toggle is ON)
- [ ] Support email is set
- [ ] Click **Save**

### 3. ✅ Firebase Credentials in .env
- [ ] Open `.env` in your project root
- [ ] Check these don't have "your_" in them:
  ```
  ✅ VITE_FIREBASE_API_KEY should NOT be "your_firebase_api_key_here"
  ✅ VITE_FIREBASE_AUTH_DOMAIN should NOT be "your_project.firebaseapp.com"
  ✅ VITE_FIREBASE_PROJECT_ID should NOT be "your_project_id_here"
  ✅ VITE_FIREBASE_APP_ID should NOT be "1:your_number:web:your_id"
  ```

### 4. ✅ Authorized Domains (Most Important!)
- [ ] Go to Firebase **Authentication** → **Settings** (tab)
- [ ] Scroll to **Authorized domains**
- [ ] Add these domains:
  - [ ] `localhost`
  - [ ] `localhost:5174` (or your Vite port)
  - [ ] `127.0.0.1`
  - [ ] `127.0.0.1:5174`

### 5. ✅ Dev Server Restarted
- [ ] Stop your dev server (Ctrl+C in terminal)
- [ ] Run again: `npm run dev`
- [ ] Server shows "ready" message

### 6. ✅ Firestore Database
- [ ] Go to **Firestore Database** in Firebase
- [ ] Click **Create Database**
- [ ] Select **Test mode** for development
- [ ] Choose region (e.g., `asia-south1` for India)
- [ ] Click **Create**

---

## 🔧 Quick Fix Steps

### If you don't have Firebase credentials yet:

1. **Get Firebase Config:**
   ```
   Firebase Console → ⚙️ Settings → Project Settings
   → Your apps → Select Web App
   → Copy the entire firebaseConfig object
   ```

2. **Update .env file:**
   ```env
   VITE_FIREBASE_API_KEY=YOUR_ACTUAL_API_KEY
   VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your-project
   VITE_FIREBASE_STORAGE_BUCKET=your-project.firebasestorage.app
   VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
   VITE_FIREBASE_APP_ID=1:123456789:web:abc123def456
   ```

3. **Restart server:**
   ```bash
   # Kill current server (Ctrl+C)
   npm run dev
   ```

4. **Try signing in again**

---

## 📋 Common Error Codes & Fixes

| Error | Cause | Fix |
|-------|-------|-----|
| `auth/invalid-api-key` | Wrong Firebase API key | Check .env has correct key from Firebase |
| `auth/unauthorized-domain` | localhost not authorized | Add to Firebase Auth → Settings → Authorized domains |
| `auth/cors_unsupported_client` | Google auth not enabled | Enable Google in Firebase Authentication |
| `auth/network-request-failed` | No internet/firewall | Check internet connection |
| `popup-closed-by-user` | User closed popup | Normal - let user try again |

---

## 💬 Still Not Working?

1. **Check browser console** (F12 → Console tab) for detailed error
2. **Look at server terminal** for any errors
3. **Check Firebase Console** for any warnings/alerts
4. **Delete `.env`** and create fresh copy from `.env.example`, filling in real values
5. **Clear browser cache** (Ctrl+Shift+Delete)

---

## ✨ It Should Work When:
- ✅ All Firebase credentials are filled in .env (no "your_" placeholders)
- ✅ localhost is in Firebase Authorized domains
- ✅ Google authentication is enabled in Firebase
- ✅ Dev server has been restarted after .env changes
- ✅ You can sign in and see "Welcome, [Your Name]!" message

**Once signed in, the trip generation should work! 🚀**
