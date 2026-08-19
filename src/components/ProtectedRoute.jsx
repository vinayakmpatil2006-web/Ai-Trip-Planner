import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { auth } from "../service/firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";

export function ProtectedRoute({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("🔒 ProtectedRoute: Checking auth state...");
    
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      console.log("📊 Auth state changed:", currentUser ? `✅ User: ${currentUser.email}` : "❌ No user");
      setUser(currentUser);
      setLoading(false);
    });

    return () => {
      console.log("🔓 ProtectedRoute: Unsubscribing from auth listener");
      unsubscribe();
    };
  }, []);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          <p className="text-gray-900 text-sm">Checking authentication...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    console.warn("⚠️ ProtectedRoute: User not authenticated, redirecting to signin");
    return <Navigate to="/signin" replace />;
  }

  console.log("✅ ProtectedRoute: User authenticated, rendering content");
  return children;
}
