import { Link, useLocation } from "react-router-dom";
import { ShieldCheck, LogOut } from "lucide-react";
import { motion } from "framer-motion";
import ThemeToggle from "./ThemeToggle";

export default function Navbar() {
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem("user") || "null");

  const handleLogout = () => {
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  const isAuthPage = ["/login", "/admin-login", "/"].includes(
    location.pathname,
  );
  if (isAuthPage) return null;

  const isAdmin = user && user.role === "admin";

  const workerLinks = [
    { label: "Home", path: "/dashboard" },
    { label: "Claims", path: "/dashboard?tab=claims" },
    { label: "Plans", path: "/dashboard?tab=plans" },
    { label: "Profile", path: "/profile" },
  ];

  const isLinkActive = (linkPath) => {
    if (linkPath === "/profile") return location.pathname === "/profile";
    if (linkPath === "/dashboard")
      return location.pathname === "/dashboard" && !location.search;
    const linkTab = new URLSearchParams(linkPath.split("?")[1] || "").get(
      "tab",
    );
    const currentTab = new URLSearchParams(location.search).get("tab");
    return linkTab && linkTab === currentTab;
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="fixed top-0 w-full bg-slate-900/80 backdrop-blur-md border-b border-slate-700/50 z-50"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          <Link
            to={user ? (isAdmin ? "/admin" : "/dashboard") : "/login"}
            className="flex items-center gap-2 group"
          >
            <motion.div
              whileHover={{ rotate: 5, scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-1.5 sm:p-2 bg-indigo-500/20 rounded-lg group-hover:bg-indigo-500/30 transition-colors"
            >
              <ShieldCheck className="w-6 h-6 sm:w-7 sm:h-7 text-indigo-400" />
            </motion.div>
            <span className="font-bold text-xl sm:text-2xl text-white tracking-tight">
              GigShield<span className="text-indigo-400">AI</span>
            </span>
          </Link>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            {user ? (
              <>
                {!isAdmin && (
                  <div className="hidden sm:flex items-center gap-1 bg-slate-800/50 rounded-full p-1 border border-slate-700/50">
                    {workerLinks.map((link) => {
                      const active = isLinkActive(link.path);
                      return (
                        <Link
                          key={link.label}
                          to={link.path}
                          className={`px-3.5 py-1.5 text-sm font-bold rounded-full transition-all duration-200 ${
                            active
                              ? "bg-indigo-500/20 text-indigo-400 shadow-[inset_0_0_12px_rgba(99,102,241,0.15)] border border-indigo-500/30"
                              : "text-slate-400 hover:text-white hover:bg-slate-700/50"
                          }`}
                        >
                          {link.label}
                        </Link>
                      );
                    })}
                  </div>
                )}
                <div className="flex items-center gap-3 pl-2 sm:pl-4 border-l border-slate-700/50">
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-bold text-sm sm:text-base border shadow-inner ${isAdmin ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" : "bg-indigo-500/20 text-indigo-400 border-indigo-500/30"}`}
                  >
                    {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                  </motion.div>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={handleLogout}
                    className="p-2 text-slate-400 hover:text-red-400 bg-slate-800/50 hover:bg-red-500/10 rounded-full transition-colors border border-slate-700/50 hover:border-red-500/30"
                  >
                    <LogOut className="w-5 h-5 sm:w-5 sm:h-5" />
                  </motion.button>
                </div>
              </>
            ) : (
              <div className="text-xs uppercase tracking-widest text-slate-400 font-bold ml-2">
                Worker Portal
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.nav>
  );
}
