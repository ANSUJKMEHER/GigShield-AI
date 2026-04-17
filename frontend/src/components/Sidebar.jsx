import { Link, useLocation } from "react-router-dom";
import {
  Home,
  FileText,
  Wallet,
  User as UserIcon,
  ShieldCheck,
  LogOut,
  Users,
  AlertOctagon,
  Activity,
} from "lucide-react";

export default function Sidebar() {
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem("user") || "null");

  if (!user) return null; // Only show for authenticated valid accounts

  const isAdmin = user.role === "admin";

  const navLinks = isAdmin
    ? [
        { name: "Dashboard", path: "/admin", icon: Home },
        { name: "Users", path: "/admin?tab=users", icon: Users },
        { name: "Claims", path: "/admin?tab=claims", icon: FileText },
        {
          name: "Fraud Analytics",
          path: "/admin?tab=fraud",
          icon: AlertOctagon,
        },
      ]
    : [
        { name: "Home", path: "/dashboard", icon: Home },
        { name: "Claims", path: "/dashboard?tab=claims", icon: FileText },
        { name: "Plans", path: "/dashboard?tab=plans", icon: Wallet },
        { name: "Profile", path: "/dashboard?tab=profile", icon: UserIcon },
      ];

  const handleLogout = () => {
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  return (
    <div className="hidden sm:flex flex-col w-64 h-screen fixed left-0 top-0 bg-slate-900/95 backdrop-blur-xl border-r border-slate-800 z-50">
      <div className="p-6 pb-8 border-b border-slate-800/50 flex-shrink-0">
        <Link
          to={isAdmin ? "/admin" : "/dashboard"}
          className="flex items-center gap-3 group"
        >
          <div
            className={`p-2 border rounded-xl transition-all shadow-inner ${isAdmin ? "bg-emerald-500/10 border-emerald-500/20 group-hover:bg-emerald-500/20" : "bg-indigo-500/10 border-indigo-500/20 group-hover:bg-indigo-500/20"} group-hover:scale-105`}
          >
            <ShieldCheck
              className={`w-7 h-7 drop-shadow-md ${isAdmin ? "text-emerald-400" : "text-indigo-400"}`}
            />
          </div>
          <span className="font-black text-2xl text-white tracking-tight drop-shadow-sm">
            GigShield
            <span
              className={`text-transparent bg-clip-text bg-gradient-to-br ${isAdmin ? "from-emerald-400 to-teal-400" : "from-indigo-400 to-cyan-400"}`}
            >
              AI
            </span>
          </span>
        </Link>
      </div>

      <div className="flex-1 py-6 px-4 space-y-2 overflow-y-auto">
        <div className="text-[10px] font-black uppercase text-slate-500 tracking-widest pl-2 mb-4">
          {isAdmin ? "Infrastructure Core" : "Worker Tools"}
        </div>
        {navLinks.map((link) => {
          const searchParams = new URLSearchParams(location.search);
          const linkParams = new URLSearchParams(link.path.split("?")[1] || "");
          const currentTab = searchParams.get("tab");
          const linkTab = linkParams.get("tab");

          let isActive = false;
          if (currentTab && linkTab) isActive = currentTab === linkTab;
          else if (
            !currentTab &&
            !linkTab &&
            location.pathname === link.path.split("?")[0]
          )
            isActive = true;

          const Icon = link.icon;
          return (
            <Link
              key={link.name}
              to={link.path}
              className={`flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all font-bold ${isActive ? (isAdmin ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/20 shadow-inner" : "bg-indigo-500/15 text-indigo-400 border border-indigo-500/20 shadow-inner") : "text-slate-400 hover:bg-slate-800/80 hover:text-white border border-transparent"}`}
            >
              <Icon
                className={`w-5 h-5 ${isActive ? (isAdmin ? "text-emerald-400 drop-shadow-[0_0_8px_rgba(16,185,129,0.6)]" : "text-indigo-400 drop-shadow-[0_0_8px_rgba(99,102,241,0.6)]") : "text-slate-500"}`}
                strokeWidth={isActive ? 2.5 : 2}
              />
              {link.name}
            </Link>
          );
        })}
      </div>

      <div className="p-4 border-t border-slate-800/80 bg-slate-900/50 flex-shrink-0">
        <div className="flex items-center justify-between gap-3 px-4 py-3 bg-slate-800 border-t border-x border-slate-700 rounded-t-2xl shadow-inner">
          <div className="flex items-center gap-3 truncate">
            <div
              className={`w-9 h-9 shrink-0 rounded-full flex items-center justify-center font-black border ${isAdmin ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" : "bg-indigo-500/20 text-indigo-400 border-indigo-500/30"}`}
            >
              {user.name.charAt(0)}
            </div>
            <div className="truncate pr-2">
              <div className="text-sm font-bold text-white truncate drop-shadow-sm">
                {user.name}
              </div>
              <div className="text-[10px] text-slate-400 truncate uppercase tracking-widest font-bold">
                {user.platform}
              </div>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors group"
          >
            <LogOut className="w-5 h-5 group-hover:scale-110 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
}
