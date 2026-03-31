import { Link, useLocation } from 'react-router-dom';
import { Home, FileText, Wallet, User as UserIcon, Users, AlertOctagon } from 'lucide-react';

export default function BottomNav() {
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  
  if (!user) return null; // Don't render for logged out users

  const isAdmin = user.role === 'admin';

  const navLinks = isAdmin ? [
    { name: 'Home', path: '/admin', icon: Home },
    { name: 'Users', path: '/admin?tab=users', icon: Users },
    { name: 'Claims', path: '/admin?tab=claims', icon: FileText },
    { name: 'Fraud', path: '/admin?tab=fraud', icon: AlertOctagon },
  ] : [
    { name: 'Home', path: '/dashboard', icon: Home },
    { name: 'Claims', path: '/dashboard?tab=claims', icon: FileText },
    { name: 'Plans', path: '/dashboard?tab=plans', icon: Wallet },
    { name: 'Profile', path: '/dashboard?tab=profile', icon: UserIcon },
  ];

  return (
    <div className="sm:hidden fixed bottom-0 left-0 w-full bg-slate-900/95 backdrop-blur-xl border-t border-slate-700/50 z-[100] pb-2 sm:pb-0 shadow-[0_-10px_40px_rgba(0,0,0,0.5)]">
      <div className="flex items-center justify-around px-2 py-2">
        {navLinks.map((link) => {
          const searchParams = new URLSearchParams(location.search);
          const linkParams = new URLSearchParams(link.path.split('?')[1] || '');
          const currentTab = searchParams.get('tab');
          const linkTab = linkParams.get('tab');
          
          let isActive = false;
          if (currentTab && linkTab) isActive = currentTab === linkTab;
          else if (!currentTab && !linkTab && location.pathname === link.path.split('?')[0]) isActive = true;

          const Icon = link.icon;
          return (
            <Link 
              key={link.name} 
              to={link.path}
              className={`flex flex-col items-center justify-between h-[52px] w-[70px] transition-all pt-1 ${isActive ? (isAdmin ? 'text-emerald-400' : 'text-indigo-400') : 'text-slate-500 hover:text-slate-300'}`}
            >
              <div className={`p-1.5 rounded-xl transition-all duration-300 ${isActive ? (isAdmin ? 'bg-emerald-500/20 translate-y-[-2px]' : 'bg-indigo-500/20 translate-y-[-2px]') : ''}`}>
                <Icon className={`w-5 h-5 ${isActive ? (isAdmin ? 'drop-shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'drop-shadow-[0_0_8px_rgba(99,102,241,0.5)]') : ''}`} strokeWidth={isActive ? 2.5 : 2} />
              </div>
              <span className={`text-[9px] font-black tracking-widest uppercase transition-opacity ${isActive ? 'opacity-100' : 'opacity-80 mt-0.5'}`}>
                {link.name}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
