import { useNavigate, useLocation } from "react-router-dom";
import { User, LogOut, Home, Plane, MoreVertical, Moon, Sun, Mail, Star, Shield, Settings } from "lucide-react";
import { useState } from "react";
import { auth } from "../service/firebaseConfig";
import { signOut } from "firebase/auth";
import { toast } from "sonner";
import { useTheme } from "../context/ThemeContext";
import EditProfileModal from "./EditProfileModal";

export default function Header({ user }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showEditProfile, setShowEditProfile] = useState(false);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast.success("Logged out successfully");
      navigate("/");
      setShowUserMenu(false);
    } catch (error) {
      toast.error("Failed to logout");
    }
  };

  const isActive = (path) => location.pathname === path ? "text-teal-600 bg-teal-50" : "text-slate-600 hover:text-teal-600 hover:bg-slate-50";

  return (
    <>
      {/* Trust Bar */}
      <div className="bg-slate-900 text-white text-xs py-2 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-center gap-6 text-center opacity-90">
          <div className="flex items-center gap-2"><Star size={14} className="text-amber-400" /> <span className="font-semibold tracking-wide">4.9⭐ RATED</span></div>
          <div className="hidden sm:flex items-center gap-2"><Shield size={14} className="text-teal-400" /> <span className="font-semibold tracking-wide">100% FREE</span></div>
          <div className="hidden md:flex items-center gap-2"><Plane size={14} className="text-blue-400" /> <span className="font-semibold tracking-wide">AI POWERED</span></div>
        </div>
      </div>

      <header className="sticky top-0 z-50 glass border-b border-white/20 shadow-sm transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <div className="flex items-center gap-3 cursor-pointer group" onClick={() => navigate("/")}>
              <div className="w-11 h-11 bg-gradient-to-br from-teal-400 via-cyan-500 to-blue-500 rounded-2xl flex items-center justify-center shadow-lg shadow-teal-500/30 transform group-hover:-translate-y-1 group-hover:rotate-12 transition-all duration-300">
                <Plane className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-teal-600 via-cyan-600 to-blue-600 hidden sm:block tracking-tight drop-shadow-sm">
                AITrip
              </span>
            </div>

            {/* Nav - Desktop */}
            <nav className="hidden md:flex items-center gap-2 p-1.5 bg-slate-100/50 dark:bg-slate-800/50 rounded-2xl border border-white/40 dark:border-slate-700/50 backdrop-blur-sm shadow-sm">
              <button onClick={() => navigate("/")} className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold transition-all duration-300 ${isActive("/") ? "text-teal-600 bg-white dark:bg-slate-700 shadow-sm" : "hover:text-teal-600 hover:bg-white/50 dark:hover:bg-slate-700/50"}`}>
                <Home size={18} /> Home
              </button>
              {user && (
                <button onClick={() => navigate("/my-trips")} className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold transition-all duration-300 ${isActive("/my-trips") ? "text-teal-600 bg-white dark:bg-slate-700 shadow-sm" : "hover:text-teal-600 hover:bg-white/50 dark:hover:bg-slate-700/50"}`}>
                  <Plane size={18} /> My Trips
                </button>
              )}
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-3 sm:gap-4">
              
              {/* Theme Toggle Button */}
              <button 
                onClick={toggleTheme}
                className="p-2.5 bg-slate-100/50 hover:bg-slate-200/50 dark:bg-slate-800/50 dark:hover:bg-slate-700/50 rounded-full transition-all duration-300 shadow-sm border border-slate-200/50 dark:border-slate-700/50 hover:shadow-md"
                title="Toggle Theme"
              >
                {theme === 'dark' ? <Sun size={20} className="text-amber-400 hover:rotate-90 transition-transform duration-500" /> : <Moon size={20} className="text-slate-600 hover:-rotate-90 transition-transform duration-500" />}
              </button>

              {/* Settings Option Top Right */}
              {user && (
                <button 
                  onClick={() => setShowEditProfile(true)} 
                  className="p-2.5 bg-slate-100/50 hover:bg-slate-200/50 dark:bg-slate-800/50 dark:hover:bg-slate-700/50 rounded-full transition-all duration-300 shadow-sm border border-slate-200/50 dark:border-slate-700/50 hover:shadow-md hidden sm:block"
                  title="Settings"
                >
                  <Settings size={20} className="text-slate-600 dark:text-slate-300 hover:rotate-90 transition-transform duration-500" />
                </button>
              )}

              {user ? (
                <div className="relative ml-2">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center gap-3 pl-2 pr-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full hover:shadow-md hover:border-teal-200 transition-all duration-300 group shadow-sm"
                  >
                    {user.photoURL ? (
                      <img src={user.photoURL} alt="User" className="w-9 h-9 rounded-full object-cover ring-2 ring-white dark:ring-slate-800 shadow-sm group-hover:ring-teal-100 transition-all" />
                    ) : (
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-teal-400 to-cyan-500 text-white font-bold flex items-center justify-center text-sm ring-2 ring-white shadow-sm">
                        {user.displayName?.charAt(0) || user.email?.charAt(0) || "U"}
                      </div>
                    )}
                    <span className="text-sm font-bold text-slate-700 dark:text-slate-200 hidden sm:block max-w-[100px] truncate group-hover:text-teal-600 transition-colors">
                      {user.displayName?.split(" ")[0] || "User"}
                    </span>
                  </button>

                  {/* Dropdown */}
                  {showUserMenu && (
                    <div className="absolute right-0 mt-4 w-72 glass-card rounded-3xl p-4 origin-top-right animate-fade-in z-50 shadow-2xl ring-1 ring-black/5">
                      <div className="flex items-center gap-3 mb-4 p-3 bg-slate-50/80 dark:bg-slate-700/80 rounded-2xl border border-slate-100 dark:border-slate-600">
                        {user.photoURL ? (
                          <img src={user.photoURL} alt="User" className="w-12 h-12 rounded-full object-cover shadow-sm" />
                        ) : (
                          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-teal-400 to-cyan-500 text-white font-bold flex items-center justify-center text-xl shadow-sm">
                            {user.displayName?.charAt(0) || "U"}
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-slate-900 dark:text-white truncate">{user.displayName}</p>
                          <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{user.email}</p>
                        </div>
                      </div>
                      
                      <button onClick={() => { setShowEditProfile(true); setShowUserMenu(false); }} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 font-semibold text-slate-700 dark:text-slate-200 transition-all duration-200 mb-1">
                        <Settings size={18} className="text-slate-400" /> Edit Profile
                      </button>

                      <button onClick={() => { navigate("/my-trips"); setShowUserMenu(false); }} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 font-semibold text-slate-700 dark:text-slate-200 transition-all duration-200 md:hidden mb-1">
                        <Plane size={18} className="text-slate-400" /> My Trips
                      </button>

                      <div className="h-px bg-slate-100 dark:bg-slate-700 my-2"></div>

                      <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-red-50/50 dark:bg-red-500/10 text-red-600 font-bold hover:bg-red-100 dark:hover:bg-red-500/20 transition-all duration-200">
                        <LogOut size={18} /> Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-3 ml-2">
                  <button onClick={() => navigate("/signin")} className="px-5 py-2.5 text-slate-600 dark:text-slate-300 font-bold hover:text-slate-900 dark:hover:text-white transition-colors hidden sm:block">
                    Sign In
                  </button>
                  <button onClick={() => navigate("/signup")} className="px-6 py-2.5 bg-gradient-to-r from-teal-500 to-cyan-500 text-white font-bold rounded-full hover:shadow-lg hover:shadow-teal-500/30 hover:-translate-y-0.5 transition-all duration-300">
                    Sign Up
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Backdrop for mobile menu */}
      {showUserMenu && <div className="fixed inset-0 z-40" onClick={() => setShowUserMenu(false)} />}
      
      {/* Modals */}
      {showEditProfile && <EditProfileModal user={user} onClose={() => setShowEditProfile(false)} />}
    </>
  );
}
