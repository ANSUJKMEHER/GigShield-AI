import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ShieldAlert, Zap, ArrowRight, Loader } from "lucide-react";
import { motion } from "framer-motion";
import Background3D from "../components/Background3D";
import ThemeToggle from "../components/ThemeToggle";

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  in: { opacity: 1, y: 0 },
  out: { opacity: 0, y: -20 },
};

const pageTransition = {
  type: "tween",
  ease: "anticipate",
  duration: 0.5,
};

export default function Login() {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(false); // Default to signup for hackathon demo
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "Demo User",
    email: "demo@gigshield.ai",
    password: "password123",
    city: "Mumbai",
    platform: "Zomato",
    zone: "Flood Prone (Dharavi)",
    workingHoursStart: "09:00",
    workingHoursEnd: "21:00",
    lat: null,
    lon: null,
  });

  // Fetch coordinates for zero-touch routing on load
  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) =>
          setFormData((f) => ({
            ...f,
            lat: pos.coords.latitude,
            lon: pos.coords.longitude,
          })),
        () => console.log("Location access denied or failed"),
      );
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const endpoint = isLogin ? "/api/auth/login" : "/api/auth/signup";
      const API_URL =
        import.meta.env.VITE_API_URL ||
        "https://gigshield-backend-c1z7.onrender.com";
      const { data } = await axios.post(`${API_URL}${endpoint}`, formData);
      localStorage.setItem("user", JSON.stringify(data.user));
      navigate("/dashboard");
    } catch (error) {
      alert(error.response?.data?.message || "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Background3D />
      <div className="absolute top-4 right-4 sm:top-6 sm:right-6 z-50">
        <ThemeToggle />
      </div>
      <motion.div
        initial="initial"
        animate="in"
        exit="out"
        variants={pageVariants}
        transition={pageTransition}
        className="min-h-screen flex items-center justify-center p-4 relative z-10"
      >
        <div className="w-full max-w-md relative">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl blur opacity-30 animate-pulse"></div>
          <div className="relative bg-slate-900/80 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 sm:p-8 shadow-2xl">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-center mb-6 sm:mb-8"
            >
              <div className="mx-auto w-16 h-16 bg-slate-800/80 rounded-full flex items-center justify-center mb-4 shadow-inner ring-1 ring-white/10">
                {isLogin ? (
                  <ShieldAlert className="w-8 h-8 text-indigo-400" />
                ) : (
                  <Zap className="w-8 h-8 text-purple-400" />
                )}
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">
                {isLogin ? "Welcome Back" : "Get Protected"}
              </h2>
              <p className="text-slate-300 text-sm">
                AI-Powered parametric insurance for gig workers
              </p>
            </motion.div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="space-y-4"
                >
                  <input
                    type="text"
                    placeholder="Full Name"
                    className="w-full bg-slate-800/50 border border-slate-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all placeholder:text-slate-500"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    required
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder="City"
                      className="w-full bg-slate-800/50 border border-slate-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:border-indigo-500 transition-all placeholder:text-slate-500"
                      value={formData.city}
                      onChange={(e) =>
                        setFormData({ ...formData, city: e.target.value })
                      }
                      required
                    />
                    <select
                      className="w-full bg-slate-800/50 border border-slate-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:border-indigo-500 transition-all appearance-none"
                      value={formData.platform}
                      onChange={(e) =>
                        setFormData({ ...formData, platform: e.target.value })
                      }
                    >
                      <option value="Zomato">Zomato</option>
                      <option value="Swiggy">Swiggy</option>
                      <option value="Zepto">Zepto</option>
                      <option value="Uber">Uber</option>
                    </select>
                  </div>
                  <select
                    className="w-full bg-slate-800/50 border border-slate-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:border-indigo-500 transition-all appearance-none"
                    value={formData.zone}
                    onChange={(e) =>
                      setFormData({ ...formData, zone: e.target.value })
                    }
                    required
                  >
                    <option value="General">General / Unknown</option>
                    <option value="Flood Prone (Dharavi)">
                      Flood Prone / Low-Lying
                    </option>
                    <option value="Safe (High Ground)">
                      Safe / High Ground
                    </option>
                    <option value="High Crime Rate">
                      High Crime Rate Area
                    </option>
                  </select>

                  <div className="grid grid-cols-2 gap-4 pt-2">
                    <div>
                      <label className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-1.5 block">
                        Shift Start
                      </label>
                      <input
                        type="time"
                        className="w-full bg-slate-800/50 border border-slate-700 text-white rounded-lg px-4 py-2.5 focus:outline-none focus:border-indigo-500 transition-all"
                        value={formData.workingHoursStart}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            workingHoursStart: e.target.value,
                          })
                        }
                        required
                      />
                    </div>
                    <div>
                      <label className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-1.5 block">
                        Shift End
                      </label>
                      <input
                        type="time"
                        className="w-full bg-slate-800/50 border border-slate-700 text-white rounded-lg px-4 py-2.5 focus:outline-none focus:border-indigo-500 transition-all"
                        value={formData.workingHoursEnd}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            workingHoursEnd: e.target.value,
                          })
                        }
                        required
                      />
                    </div>
                  </div>
                </motion.div>
              )}

              <div className="space-y-4 pt-2">
                <input
                  type="email"
                  placeholder="Email Address"
                  className="w-full bg-slate-800/50 border border-slate-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all placeholder:text-slate-500"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  required
                />
                <input
                  type="password"
                  placeholder="Password"
                  className="w-full bg-slate-800/50 border border-slate-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all placeholder:text-slate-500"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  required
                />
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-medium rounded-lg px-4 py-3 sm:py-3.5 flex items-center justify-center gap-2 transition-all disabled:opacity-70 disabled:cursor-not-allowed shadow-lg shadow-indigo-500/25 mt-6"
              >
                {loading ? (
                  <Loader className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    {isLogin ? "Sign In" : "Create Account"}
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </motion.button>
            </form>

            <div className="mt-6 text-center">
              <button
                type="button"
                onClick={() => setIsLogin(!isLogin)}
                className="text-sm font-medium text-slate-400 hover:text-white transition-colors block w-full py-2"
              >
                {isLogin
                  ? "Need coverage? Sign up instead"
                  : "Already protected? Log in"}
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </>
  );
}
