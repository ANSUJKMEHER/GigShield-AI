import { useState, useEffect } from "react";
import axios from "axios";
import {
  User,
  Settings,
  Save,
  Loader,
  Shield,
  Wallet,
  Activity,
  MapPin,
  Clock,
  AlertTriangle,
  IndianRupee,
} from "lucide-react";
import { motion } from "framer-motion";

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  in: { opacity: 1, y: 0 },
  out: { opacity: 0, y: -20 },
};

export default function Profile() {
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user") || "{}"),
  );
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: user.name || "",
    city: user.city || "",
    platform: user.platform || "Zomato",
    zone: user.zone || "General",
    workingHoursStart: user.workingHours?.start || "09:00",
    workingHoursEnd: user.workingHours?.end || "21:00",
  });

  const [hasChangedRisk, setHasChangedRisk] = useState(false);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);

    const riskModified =
      formData.city !== user.city || formData.zone !== user.zone;

    try {
      const API_URL =
        import.meta.env.VITE_API_URL ||
        "https://gigshield-backend-c1z7.onrender.com";
      const { data } = await axios.put(
        `${API_URL}/api/auth/profile/${user._id}`,
        formData,
      );

      const updatedUser = { ...user, ...data.user };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setUser(updatedUser);

      if (riskModified) {
        setHasChangedRisk(true);
      } else {
        alert("Profile successfully updated!");
      }
    } catch (error) {
      console.error(error);
      alert("Profile update failed.");
    } finally {
      setLoading(false);
    }
  };

  const memberSince = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString(undefined, {
        year: "numeric",
        month: "long",
      })
    : "Recently";

  return (
    <motion.div
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
      transition={{ duration: 0.4 }}
      className="max-w-4xl mx-auto space-y-6 py-6 pb-20 font-sans"
    >
      {/* Profile Header Card */}
      <div className="bg-gradient-to-br from-indigo-900/50 via-slate-900/80 to-purple-900/30 backdrop-blur-xl rounded-3xl border border-indigo-500/20 shadow-[0_0_40px_rgba(99,102,241,0.1)] overflow-hidden relative">
        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 blur-[80px] rounded-full pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-60 h-60 bg-purple-500/10 blur-[60px] rounded-full pointer-events-none"></div>

        <div className="p-6 sm:p-8 relative z-10">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-3xl flex items-center justify-center font-black text-4xl sm:text-5xl shadow-[0_0_30px_rgba(99,102,241,0.4)] border-2 border-white/10 shrink-0">
              {user.name ? user.name.charAt(0).toUpperCase() : "U"}
            </div>
            <div className="text-center sm:text-left flex-1">
              <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                {user.name}
              </h1>
              <p className="text-slate-400 font-medium mt-1 flex items-center justify-center sm:justify-start gap-2">
                <MapPin className="w-4 h-4 text-indigo-400" />{" "}
                {user.city || "Unknown City"} · {user.platform || "Gig Worker"}
              </p>
              <div className="flex items-center justify-center sm:justify-start gap-3 mt-3 flex-wrap">
                <span className="text-[10px] font-black uppercase tracking-widest bg-indigo-500/20 text-indigo-400 px-3 py-1.5 rounded-full border border-indigo-500/30">
                  Member since {memberSince}
                </span>
                {user.activePlan !== "None" && (
                  <span className="text-[10px] font-black uppercase tracking-widest bg-emerald-500/20 text-emerald-400 px-3 py-1.5 rounded-full border border-emerald-500/30">
                    {user.activePlan} Plan Active
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 border-t border-indigo-500/10">
          {[
            {
              label: "Active Plan",
              value: user.activePlan || "None",
              icon: Shield,
              color: "text-emerald-400",
            },
            {
              label: "Weekly Premium",
              value: `₹${user.premium || 0}`,
              icon: Wallet,
              color: "text-indigo-400",
            },
            {
              label: "Total Payouts",
              value: `₹${user.totalPayouts || 0}`,
              icon: IndianRupee,
              color: "text-purple-400",
            },
            {
              label: "Risk Score",
              value: `${((user.riskScore || 0.2) * 100).toFixed(0)}%`,
              icon: Activity,
              color: "text-orange-400",
            },
          ].map((stat, i) => (
            <div
              key={i}
              className={`p-4 sm:p-5 flex items-center gap-3 ${i < 3 ? "border-r border-indigo-500/10" : ""} ${i < 2 ? "border-b md:border-b-0 border-indigo-500/10" : ""}`}
            >
              <stat.icon className={`w-5 h-5 ${stat.color} shrink-0`} />
              <div>
                <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">
                  {stat.label}
                </div>
                <div className="text-lg font-black text-white">
                  {stat.value}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Settings Form */}
      <div className="bg-slate-900/80 backdrop-blur-xl rounded-3xl p-6 sm:p-8 border border-slate-700/50 shadow-xl overflow-hidden relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 blur-[100px] rounded-full pointer-events-none"></div>

        <h2 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-6 relative z-10 flex items-center gap-2">
          <Settings className="w-4 h-4" /> Account Settings
        </h2>

        {hasChangedRisk && (
          <div className="mb-6 bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 flex items-start gap-3 relative z-10">
            <div className="bg-amber-500/20 p-1.5 rounded-lg shrink-0">
              <AlertTriangle className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <h4 className="text-amber-400 font-bold mb-1">
                Risk Profile Updated
              </h4>
              <p className="text-sm text-slate-300">
                Your base risk parameters have changed.{" "}
                <strong className="text-white">
                  Your premium price is locked for the current week
                </strong>{" "}
                and will be recalculated at the start of your next billing
                cycle.
              </p>
              <button
                onClick={() => setHasChangedRisk(false)}
                className="mt-2 text-xs font-bold text-amber-400 hover:text-amber-300 uppercase tracking-widest"
              >
                Dismiss
              </button>
            </div>
          </div>
        )}

        <form onSubmit={handleUpdate} className="space-y-6 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-slate-500">
                Legal Name
              </label>
              <div className="relative">
                <input
                  type="text"
                  className="w-full bg-slate-800/50 border border-slate-700 text-white rounded-xl px-4 py-3 pl-11 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all font-medium"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                />
                <User className="w-5 h-5 text-slate-500 absolute left-3.5 top-3.5" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-slate-500">
                Primary Platform
              </label>
              <select
                className="w-full bg-slate-800/50 border border-slate-700 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-indigo-500 transition-all font-medium appearance-none"
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

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-slate-500">
                Operating City
              </label>
              <input
                type="text"
                className="w-full bg-slate-800/50 border border-slate-700 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-indigo-500 transition-all font-medium placeholder:text-slate-500"
                value={formData.city}
                onChange={(e) =>
                  setFormData({ ...formData, city: e.target.value })
                }
                placeholder="Enter your city"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-slate-500">
                Threat Zone
              </label>
              <select
                className="w-full bg-slate-800/50 border border-slate-700 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-indigo-500 transition-all font-medium appearance-none"
                value={formData.zone}
                onChange={(e) =>
                  setFormData({ ...formData, zone: e.target.value })
                }
              >
                <option value="General">General / Unknown</option>
                <option value="Flood Prone (Dharavi)">
                  Flood Prone / Low-Lying
                </option>
                <option value="Safe (High Ground)">Safe / High Ground</option>
                <option value="High Crime Rate">High Crime Rate Area</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-slate-500">
                Shift Start
              </label>
              <input
                type="time"
                className="w-full bg-slate-800/50 border border-slate-700 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-indigo-500 transition-all font-medium"
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

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-slate-500">
                Shift End
              </label>
              <input
                type="time"
                className="w-full bg-slate-800/50 border border-slate-700 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-indigo-500 transition-all font-medium"
                value={formData.workingHoursEnd}
                onChange={(e) =>
                  setFormData({ ...formData, workingHoursEnd: e.target.value })
                }
                required
              />
            </div>
          </div>

          <div className="pt-6 border-t border-slate-800 flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-400 hover:to-indigo-500 text-white font-bold tracking-wide rounded-xl px-8 py-3.5 flex items-center justify-center gap-2 transition-all transform hover:scale-[1.02] active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(99,102,241,0.2)]"
            >
              {loading ? (
                <Loader className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  Save Configuration
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Danger Zone */}
      <div className="bg-slate-900/60 backdrop-blur-xl rounded-3xl p-6 border border-red-500/20 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/10 blur-[40px] rounded-full pointer-events-none"></div>
        <h3 className="text-xs font-black uppercase tracking-widest text-red-400 mb-2 relative z-10 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4" /> Danger Zone
        </h3>
        <p className="text-sm text-slate-400 mb-4 relative z-10">
          Permanently delete your account and all associated data. This action
          cannot be undone.
        </p>
        <button className="px-5 py-2.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 hover:border-red-500/50 rounded-xl text-sm font-bold transition-all relative z-10">
          Delete Account
        </button>
      </div>
    </motion.div>
  );
}
