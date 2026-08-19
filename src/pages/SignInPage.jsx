import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../service/firebaseConfig";
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";
import { toast } from "sonner";
import { Mail, Lock, Eye, EyeOff, AlertCircle, ArrowLeft } from "lucide-react";
import Header from "../components/Header";

const googleProvider = new GoogleAuthProvider();

export default function SignInPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email) newErrors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      newErrors.email = "Invalid email format";

    if (!formData.password) newErrors.password = "Password is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleEmailSignIn = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, formData.email, formData.password);
      toast.success("✅ Signed in successfully!");
      navigate("/create-trip");
    } catch (error) {
      console.error("SignIn error:", error.code, error.message);
      
      if (error.code === "auth/user-not-found") {
        toast.error("No account found with this email. Please sign up first.");
      } else if (error.code === "auth/wrong-password") {
        toast.error("Incorrect password. Please try again.");
      } else if (error.code === "auth/invalid-email") {
        toast.error("Invalid email address format");
      } else if (error.code === "auth/too-many-requests") {
        toast.error("Too many login attempts. Please try again later.");
      } else if (error.code === "auth/operation-not-allowed") {
        toast.error("⚠️ Email/Password signin is not enabled in Firebase Console");
      } else if (error.code === "auth/user-cancelled") {
        // User cancelled
      } else {
        toast.error("Error: " + (error.message || "Failed to sign in"));
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      await signInWithPopup(auth, googleProvider);
      toast.success("✅ Signed in with Google!");
      navigate("/create-trip");
    } catch (error) {
      console.error("Google signin error:", error.code);
      if (error.code === "auth/popup-closed-by-user") {
        // User closed popup
      } else if (error.code === "auth/unauthorized-domain") {
        toast.error("⚠️ This domain is not authorized.");
      } else {
        toast.error("Error: " + error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Header user={null} />

      <div className="max-w-md mx-auto px-4 py-12">
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 text-gray-500 hover:text-gray-900 mb-8 transition font-medium"
        >
          <ArrowLeft size={20} /> Back to Home
        </button>

        <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200">
          <h1 className="text-4xl font-bold text-center mb-2 bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">
            Sign In
          </h1>
          <p className="text-center text-gray-600 mb-8">Welcome back to AI Trip Planner</p>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2 flex items-center gap-2">
                <Mail size={16} /> Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="you@example.com"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/30 transition"
              />
              {errors.email && (
                <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
                  <AlertCircle size={14} /> {errors.email}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2 flex items-center gap-2">
                <Lock size={16} /> Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Enter password"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/30 transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
                  <AlertCircle size={14} /> {errors.password}
                </p>
              )}
            </div>

            <button
              onClick={handleEmailSignIn}
              disabled={loading}
              className="w-full mt-6 bg-gradient-to-r from-teal-500 to-cyan-500 text-white font-semibold py-3 rounded-lg hover:shadow-lg hover:shadow-teal-500/50 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>

            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-600">or</span>
              </div>
            </div>

            <button
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="w-full bg-gray-100 text-gray-900 font-semibold py-3 rounded-lg hover:bg-gray-200 transition flex items-center justify-center gap-3 hover:shadow-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              {loading ? "Signing in..." : "Sign in with Google"}
            </button>

            <p className="text-center text-gray-600 mt-6">
              Don't have an account?{" "}
              <button onClick={() => navigate("/signup")} className="text-teal-600 hover:text-teal-700 font-semibold">
                Sign Up
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
