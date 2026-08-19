import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../service/firebaseConfig";
import {
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { toast } from "sonner";
import { Mail, Lock, User, Phone, Calendar, Users, AlertCircle, Eye, EyeOff, ArrowLeft } from "lucide-react";

const googleProvider = new GoogleAuthProvider();

export default function SignUp({ onClose }) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formStep, setFormStep] = useState(1); // 1 = email/password, 2 = personal info

  const [formData, setFormData] = useState({
    // Step 1
    email: "",
    password: "",
    confirmPassword: "",
    // Step 2
    fullName: "",
    age: "",
    gender: "",
    phone: "",
    diseases: "",
    recentFever: "no",
    emergencyContact: "",
    emergencyPhone: "",
  });

  const [errors, setErrors] = useState({});

  const validateStep = (step) => {
    const newErrors = {};

    if (step === 1) {
      if (!formData.email) newErrors.email = "Email is required";
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
        newErrors.email = "Invalid email format";

      if (!formData.password) newErrors.password = "Password is required";
      else if (formData.password.length < 6)
        newErrors.password = "Password must be at least 6 characters";

      if (formData.password !== formData.confirmPassword)
        newErrors.confirmPassword = "Passwords do not match";
    } else if (step === 2) {
      if (!formData.fullName) newErrors.fullName = "Full name is required";
      if (!formData.age) newErrors.age = "Age is required";
      else if (formData.age < 13 || formData.age > 120)
        newErrors.age = "Please enter a valid age";
      if (!formData.gender) newErrors.gender = "Gender is required";
      if (!formData.phone) newErrors.phone = "Phone number is required";
      else if (!/^\d{10}$/.test(formData.phone.replace(/\D/g, "")))
        newErrors.phone = "Phone number must be 10 digits";
      if (!formData.emergencyContact) newErrors.emergencyContact = "Emergency contact name required";
      if (!formData.emergencyPhone) newErrors.emergencyPhone = "Emergency contact phone required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleNextStep = () => {
    if (validateStep(1)) {
      setFormStep(2);
    }
  };

  const handleEmailSignUp = async () => {
    if (!validateStep(2)) return;

    setLoading(true);
    try {
      // Create user with email and password
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );

      const user = userCredential.user;

      // Save user profile information to Firestore
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        email: formData.email,
        fullName: formData.fullName,
        age: parseInt(formData.age),
        gender: formData.gender,
        phone: formData.phone,
        diseases: formData.diseases || "None",
        recentFever: formData.recentFever,
        emergencyContact: formData.emergencyContact,
        emergencyPhone: formData.emergencyPhone,
        signUpDate: new Date(),
        authMethod: "email",
      });

      toast.success("✅ Account created successfully!");
      navigate("/create-trip");
      onClose?.();
    } catch (error) {
      console.error("SignUp error:", error.code, error.message);
      
      if (error.code === "auth/email-already-in-use") {
        toast.error("This email is already registered");
      } else if (error.code === "auth/weak-password") {
        toast.error("Password is too weak (minimum 6 characters)");
      } else if (error.code === "auth/operation-not-allowed") {
        toast.error("⚠️ Email/Password signup is not enabled. Enable it in Firebase Console → Authentication → Sign-in method → Email/Password");
      } else if (error.code === "auth/invalid-email") {
        toast.error("Invalid email address format");
      } else if (error.code === "auth/user-cancelled") {
        // User cancelled, no error needed
      } else {
        toast.error("Error: " + (error.message || "Unknown error occurred"));
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      // Check if user already exists
      const userDoc = await import("firebase/firestore").then((module) =>
        module.getDoc(doc(db, "users", user.uid))
      );

      if (!userDoc.exists()) {
        // New user - save basic info from Google
        await setDoc(doc(db, "users", user.uid), {
          uid: user.uid,
          email: user.email,
          fullName: user.displayName || "",
          age: "",
          gender: "",
          phone: "",
          diseases: "None",
          recentFever: "no",
          emergencyContact: "",
          emergencyPhone: "",
          photoURL: user.photoURL,
          signUpDate: new Date(),
          authMethod: "google",
        });
      }

      toast.success("✅ Welcome! Account linked with Google");
      navigate("/create-trip");
      onClose?.();
    } catch (error) {
      if (error.code === "auth/popup-closed-by-user") {
        toast.error("Sign-up cancelled");
      } else if (error.code === "auth/unauthorized-domain") {
        toast.error("⚠️ This domain is not authorized. Contact support.");
      } else {
        toast.error("Error during sign-up: " + error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-b from-slate-900 to-slate-950 rounded-2xl w-full max-w-md p-8 relative shadow-2xl border border-blue-500/20">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 left-4 text-gray-400 hover:text-white transition"
        >
          <ArrowLeft size={24} />
        </button>

        <h2 className="text-3xl font-bold text-center mb-2 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
          Create Account
        </h2>
        <p className="text-center text-gray-400 mb-6">Join VoyageAI for personalized trip planning</p>

        {formStep === 1 ? (
          // Step 1: Email & Password
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
                <Mail size={16} /> Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="you@example.com"
                className="w-full px-4 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none transition"
              />
              {errors.email && (
                <p className="text-red-400 text-sm mt-1 flex items-center gap-1">
                  <AlertCircle size={14} /> {errors.email}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
                <Lock size={16} /> Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Enter password"
                  className="w-full px-4 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-300"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-400 text-sm mt-1 flex items-center gap-1">
                  <AlertCircle size={14} /> {errors.password}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
                <Lock size={16} /> Confirm Password
              </label>
              <input
                type={showPassword ? "text" : "password"}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                placeholder="Confirm password"
                className="w-full px-4 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none transition"
              />
              {errors.confirmPassword && (
                <p className="text-red-400 text-sm mt-1 flex items-center gap-1">
                  <AlertCircle size={14} /> {errors.confirmPassword}
                </p>
              )}
            </div>

            <button
              onClick={handleNextStep}
              className="w-full mt-6 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold py-2 rounded-lg hover:shadow-lg hover:shadow-blue-500/50 transition"
            >
              Next: Personal Info
            </button>

            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-600"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-slate-950 text-gray-400">or</span>
              </div>
            </div>

            <button
              onClick={handleGoogleSignUp}
              disabled={loading}
              className="w-full bg-white text-slate-900 font-semibold py-3 rounded-lg hover:bg-gray-100 transition flex items-center justify-center gap-3 hover:shadow-lg hover:shadow-white/20 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              {loading ? "Signing up..." : "Sign up with Google"}
            </button>
          </div>
        ) : (
          // Step 2: Personal Information
          <div className="space-y-4 max-h-96 overflow-y-auto">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
                <User size={16} /> Full Name
              </label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                placeholder="John Doe"
                className="w-full px-4 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none transition"
              />
              {errors.fullName && (
                <p className="text-red-400 text-sm mt-1">{errors.fullName}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
                  <Calendar size={16} /> Age
                </label>
                <input
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleInputChange}
                  placeholder="25"
                  className="w-full px-4 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none transition"
                />
                {errors.age && (
                  <p className="text-red-400 text-sm mt-1">{errors.age}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
                  <Users size={16} /> Gender
                </label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white focus:border-blue-500 focus:outline-none transition"
                >
                  <option value="">Select</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                  <option value="Prefer not to say">Prefer not to say</option>
                </select>
                {errors.gender && (
                  <p className="text-red-400 text-sm mt-1">{errors.gender}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
                <Phone size={16} /> Phone Number
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="9876543210"
                className="w-full px-4 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none transition"
              />
              {errors.phone && (
                <p className="text-red-400 text-sm mt-1">{errors.phone}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                🏥 Any Medical Conditions?
              </label>
              <textarea
                name="diseases"
                value={formData.diseases}
                onChange={handleInputChange}
                placeholder="e.g., Diabetes, Asthma, etc. (Leave blank if none)"
                className="w-full px-4 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none transition resize-none h-16"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                🤒 Recent Fever or Illness?
              </label>
              <select
                name="recentFever"
                value={formData.recentFever}
                onChange={handleInputChange}
                className="w-full px-4 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white focus:border-blue-500 focus:outline-none transition"
              >
                <option value="no">No</option>
                <option value="yes">Yes</option>
                <option value="recovering">Recovering</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
                <User size={16} /> Emergency Contact Name
              </label>
              <input
                type="text"
                name="emergencyContact"
                value={formData.emergencyContact}
                onChange={handleInputChange}
                placeholder="Contact person name"
                className="w-full px-4 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none transition"
              />
              {errors.emergencyContact && (
                <p className="text-red-400 text-sm mt-1">{errors.emergencyContact}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
                <Phone size={16} /> Emergency Contact Phone
              </label>
              <input
                type="tel"
                name="emergencyPhone"
                value={formData.emergencyPhone}
                onChange={handleInputChange}
                placeholder="9876543210"
                className="w-full px-4 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none transition"
              />
              {errors.emergencyPhone && (
                <p className="text-red-400 text-sm mt-1">{errors.emergencyPhone}</p>
              )}
            </div>

            <div className="flex gap-3 pt-4">
              <button
                onClick={() => setFormStep(1)}
                className="flex-1 bg-slate-700 text-white font-semibold py-2 rounded-lg hover:bg-slate-600 transition"
              >
                Back
              </button>
              <button
                onClick={handleEmailSignUp}
                disabled={loading}
                className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold py-2 rounded-lg hover:shadow-lg hover:shadow-blue-500/50 transition disabled:opacity-50"
              >
                {loading ? "Creating Account..." : "Create Account"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
