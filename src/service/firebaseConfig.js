// src/service/firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, setPersistence, browserLocalPersistence } from "firebase/auth";

// ─── .env setup ───────────────────────────────────────────────────────────────
// Create a .env file in your project root with these variables:
//
// VITE_FIREBASE_API_KEY=your_firebase_api_key
// VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
// VITE_FIREBASE_PROJECT_ID=your_project_id
// VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
// VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
// VITE_FIREBASE_APP_ID=your_app_id
// ──────────────────────────────────────────────────────────────────────────────

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

console.log("🔐 Initializing Firebase...", firebaseConfig.projectId ? "✅" : "❌");

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);

// Enable persistent authentication (keep user logged in across browser sessions)
setPersistence(auth, browserLocalPersistence)
  .then(() => {
    console.log("✅ Auth persistence enabled - users will stay logged in");
  })
  .catch((error) => {
    console.error("❌ Failed to enable persistence:", error.code, error.message);
  });

export default app;
