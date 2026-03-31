import { Link, useLocation } from 'react-router-dom';
import { ShieldCheck, Bell, LogOut } from 'lucide-react';

export default function Navbar() {
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem('user') || 'null');

  const handleLogout = () => {
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  // Completely hide top navbar during authentication flows
  const isAuthPage = ['/login', '/admin-login'].includes(location.pathname);
  if (isAuthPage) return null;

  const isAdmin = user && user.role === 'admin';

  return (
    <nav className="fixed top-0 w-full bg-slate-900/80 backdrop-blur-md border-b border-slate-700/50 z-50 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to={user ? "/dashboard" : "/login"} className="flex items-center gap-2 group">
            <div className="p-1.5 sm:p-2 bg-indigo-500/20 rounded-lg group-hover:bg-indigo-500/30 transition-colors">
              <ShieldCheck className="w-5 h-5 sm:w-6 sm:h-6 text-indigo-400" />
            </div>
            <span className="font-bold text-lg sm:text-xl text-white tracking-tight">GigShield<span className="text-indigo-400">AI</span></span>
          </Link>
          
          <div className="flex items-center gap-3">
            {user ? (
              <>
                {!isAdmin && (
                  <Link to="/profile" className="px-3 py-1.5 text-xs sm:text-sm font-bold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-full transition-colors border border-slate-700">
                    Profile
                  </Link>
                )}
                <div className="flex items-center gap-2">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm border ${isAdmin ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' : 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30'}`}>
                    {user.name.charAt(0)}
                  </div>
                  <button onClick={handleLogout} className="p-1.5 text-slate-400 hover:text-red-400 transition-colors">
                     <LogOut className="w-5 h-5"/>
                  </button>
                </div>
              </>
            ) : (
               <div className="text-xs uppercase tracking-widest text-slate-400 font-bold">Worker Portal</div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
