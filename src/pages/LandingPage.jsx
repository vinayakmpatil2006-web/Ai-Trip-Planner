// src/pages/LandingPage.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../service/firebaseConfig";
import Header from "../components/Header";
import { Sparkles, MapPin, Zap, Users, Heart, Clock, ArrowRight, DollarSign } from "lucide-react";

export default function LandingPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check auth state on mount
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
      
      // If user is logged in, redirect to create-trip
      if (currentUser) {
        console.log("✅ User already logged in, redirecting to create-trip");
        navigate("/create-trip");
      }
    });

    return unsubscribe;
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-teal-500/30 border-t-teal-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-teal-500 selection:text-white">
      <Header user={user} />

      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden px-4 py-20">
        {/* Animated Background Blobs */}
        <div className="absolute top-0 -left-4 w-96 h-96 bg-teal-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute top-0 -right-4 w-96 h-96 bg-cyan-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-96 h-96 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>

        <div className="relative z-10 max-w-5xl mx-auto text-center animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-8 border border-teal-200/50 text-teal-700 font-semibold text-sm animate-float-slow">
            <Sparkles className="w-4 h-4 text-teal-500" />
            AI-Powered Travel Intelligence
          </div>

          <h1 className="text-6xl md:text-8xl font-black tracking-tight mb-8 leading-[1.1]">
            Plan Your Next <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-500 via-cyan-500 to-blue-600">
              Adventure in Minutes
            </span>
          </h1>

          <p className="text-xl text-slate-600 mb-12 max-w-2xl mx-auto leading-relaxed">
            Get personalized itineraries with handpicked hotels, activities, and schedules—powered by AI. Designed for solo explorers and family trips alike.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <button
              onClick={() => navigate("/signup")}
              className="group relative px-8 py-4 rounded-full bg-slate-900 text-white font-semibold text-lg overflow-hidden transition-all hover:scale-105 hover:shadow-[0_0_40px_rgba(20,184,166,0.4)]"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-teal-500 to-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative flex items-center gap-2">
                Start Planning Free
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </div>
            </button>
            
            <button
              onClick={() => navigate("/signin")}
              className="px-8 py-4 rounded-full glass font-semibold text-lg hover:bg-white/90 transition-all text-slate-700 hover:text-teal-600"
            >
              Sign In
            </button>
          </div>
        </div>
      </section>

      {/* Premium Features Grid */}
      <section className="py-32 px-4 bg-white relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20 animate-slide-up">
            <h2 className="text-4xl md:text-5xl font-black mb-6">Why Choose Us?</h2>
            <p className="text-xl text-slate-500">Everything you need to plan the perfect trip seamlessly.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<Zap />} 
              title="Lightning Fast" 
              desc="Generate complete 10-day itineraries in seconds, not hours." 
              gradient="from-amber-400 to-orange-500" 
            />
            <FeatureCard 
              icon={<MapPin />} 
              title="Smart Routes" 
              desc="Optimized travel paths to save you time and energy." 
              gradient="from-teal-400 to-emerald-500" 
            />
            <FeatureCard 
              icon={<DollarSign />} 
              title="Budget Control" 
              desc="We find the best experiences that perfectly match your budget." 
              gradient="from-blue-400 to-cyan-500" 
            />
            <FeatureCard 
              icon={<Users />} 
              title="Group Friendly" 
              desc="Plan for solo trips, couples, or large family vacations." 
              gradient="from-purple-400 to-pink-500" 
            />
            <FeatureCard 
              icon={<Clock />} 
              title="Perfect Timing" 
              desc="Realistic hour-by-hour schedules you can actually follow." 
              gradient="from-rose-400 to-red-500" 
            />
            <FeatureCard 
              icon={<Heart />} 
              title="Personalized" 
              desc="Tailored recommendations based on your unique interests." 
              gradient="from-indigo-400 to-violet-500" 
            />
          </div>
        </div>
      </section>

      {/* Trending Locations */}
      <section className="py-24 px-4 bg-slate-50 relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 animate-slide-up">
            <h2 className="text-4xl font-black mb-4">Trending in India</h2>
            <p className="text-slate-500 text-lg">Top destinations fellow travelers are exploring right now.</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { name: 'Goa', img: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=500&q=80', desc: 'Beaches & Nightlife' },
              { name: 'Jaipur', img: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?w=500&q=80', desc: 'The Pink City' },
              { name: 'Kerala', img: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=500&q=80', desc: "God's Own Country" },
              { name: 'Manali', img: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=500&q=80', desc: 'Mountain Retreat' }
            ].map((loc, idx) => (
              <div key={idx} className="group relative rounded-3xl overflow-hidden cursor-pointer h-72 shadow-lg">
                <img src={loc.img} alt={loc.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                <div className="absolute bottom-6 left-6 text-white">
                  <h3 className="text-2xl font-bold mb-1">{loc.name}</h3>
                  <p className="text-white/80 text-sm font-medium">{loc.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Season-wise Trending */}
      <section className="py-24 px-4 bg-white relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 animate-slide-up">
            <h2 className="text-4xl font-black mb-4">Season's Best</h2>
            <p className="text-slate-500 text-lg">Perfect getaways for the current weather.</p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="group rounded-3xl overflow-hidden cursor-pointer h-96 relative shadow-xl">
              <img src="https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=800&q=80" alt="Monsoon Retreats" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors"></div>
              <div className="absolute inset-0 flex flex-col justify-end p-10">
                <div className="bg-teal-500 text-white text-xs font-bold px-3 py-1 rounded-full w-max mb-4 uppercase tracking-wider">Top Choice</div>
                <h3 className="text-3xl font-bold text-white mb-2">Monsoon Escapes</h3>
                <p className="text-white/90">Experience the lush greenery of the Western Ghats and misty hill stations.</p>
              </div>
            </div>
            <div className="group rounded-3xl overflow-hidden cursor-pointer h-96 relative shadow-xl">
              <img src="https://images.unsplash.com/photo-1596895111956-bf57059e00fa?w=800&q=80" alt="Winter Wonderland" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors"></div>
              <div className="absolute inset-0 flex flex-col justify-end p-10">
                <div className="bg-blue-500 text-white text-xs font-bold px-3 py-1 rounded-full w-max mb-4 uppercase tracking-wider">Upcoming</div>
                <h3 className="text-3xl font-bold text-white mb-2">Winter Wonderland</h3>
                <p className="text-white/90">Cozy stays in snow-capped mountains and pleasant desert safaris.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Step by Step Section */}
      <section className="py-32 px-4 bg-slate-900 text-white relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-teal-500/20 rounded-full blur-[120px] pointer-events-none"></div>
        
        <div className="max-w-5xl mx-auto relative z-10">
          <h2 className="text-4xl md:text-6xl font-black text-center mb-24">How It Works</h2>
          
          <div className="grid md:grid-cols-4 gap-8">
            <Step number="01" title="Tell Us" desc="Share your destination, dates, and budget." />
            <Step number="02" title="AI Magic" desc="Our engine crafts the perfect itinerary." />
            <Step number="03" title="Review" desc="Tweak hotels and activities to your liking." />
            <Step number="04" title="Travel" desc="Pack your bags and enjoy the trip!" />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-12 px-4">
        <div className="max-w-7xl mx-auto text-center text-slate-500 font-medium">
          <p>© 2024 AI Trip Planner. Built for modern explorers.</p>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, desc, gradient }) {
  return (
    <div className="group glass-card p-8 rounded-3xl transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)]">
      <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${gradient} text-white flex items-center justify-center mb-6 shadow-lg transform group-hover:rotate-6 transition-transform duration-300`}>
        {icon}
      </div>
      <h3 className="text-2xl font-bold mb-3 text-slate-900">{title}</h3>
      <p className="text-slate-600 leading-relaxed">{desc}</p>
    </div>
  );
}

function Step({ number, title, desc }) {
  return (
    <div className="text-center group">
      <div className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-white/20 mb-6 transform group-hover:scale-110 transition-transform duration-500">
        {number}
      </div>
      <h3 className="text-2xl font-bold mb-3 text-white">{title}</h3>
      <p className="text-slate-400">{desc}</p>
    </div>
  );
}
