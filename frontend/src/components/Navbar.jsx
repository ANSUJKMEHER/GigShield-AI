import { Link, useNavigate } from 'react-router-dom';
import { ShieldCheck, LogOut, User as UserIcon } from 'lucide-react';

export default function Navbar() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || 'null');

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <nav className="fixed top-0 w-full bg-slate-900/80 backdrop-blur-md border-b border-slate-700/50 z-50 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to={user ? "/dashboard" : "/login"} className="flex items-center gap-2 group">
            <div className="p-2 bg-indigo-500/20 rounded-lg group-hover:bg-indigo-500/30 transition-colors">
              <ShieldCheck className="w-6 h-6 text-indigo-400" />
            </div>
            <span className="font-bold text-xl text-white tracking-tight">GigShield<span className="text-indigo-400">AI</span></span>
          </Link>
          
          <div className="flex items-center gap-4">
            {user ? (
              <>
                <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-800 border border-slate-700">
                  <UserIcon className="w-4 h-4 text-slate-400" />
                  <span className="text-sm font-medium text-slate-300">{user.name}</span>
                </div>
                <button 
                  onClick={handleLogout}
                  className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
                  title="Logout"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </>
            ) : (
              <Link to="/admin" className="text-sm font-medium text-slate-400 hover:text-white transition-colors border border-slate-700 px-3 py-1 rounded-full hover:bg-slate-800">
                Admin Area
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
