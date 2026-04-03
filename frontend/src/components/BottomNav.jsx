import { Link, useLocation } from 'react-router-dom';
import { Home, FileText, Wallet, User as UserIcon, Users, AlertOctagon } from 'lucide-react';
import { motion } from 'framer-motion';

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
    { name: 'Profile', path: '/profile', icon: UserIcon },
  ];

  return (
    <motion.div 
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30, delay: 0.1 }}
      className="md:hidden fixed bottom-0 left-0 w-full bg-slate-900/95 backdrop-blur-xl border-t border-slate-700/50 z-[100] pb-safe shadow-[0_-10px_40px_rgba(0,0,0,0.5)]"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <div className="flex items-center justify-around px-2 py-2 h-[72px]">
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
              className={`flex flex-col items-center justify-center w-full h-full relative ${isActive ? (isAdmin ? 'text-emerald-400' : 'text-indigo-400') : 'text-slate-500 hover:text-slate-300'}`}
            >
              <motion.div 
                whileTap={{ scale: 0.9 }}
                className={`p-2 rounded-2xl transition-all duration-300 z-10 ${isActive ? (isAdmin ? 'bg-emerald-500/20 translate-y-[-4px]' : 'bg-indigo-500/20 translate-y-[-4px]') : ''}`}
              >
                <Icon className={`w-6 h-6 ${isActive ? (isAdmin ? 'drop-shadow-[0_0_12px_rgba(16,185,129,0.5)]' : 'drop-shadow-[0_0_12px_rgba(99,102,241,0.5)]') : ''}`} strokeWidth={isActive ? 2.5 : 2} />
              </motion.div>
              <span className={`text-[10px] font-bold tracking-wider uppercase transition-all absolute bottom-1 ${isActive ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}>
                {link.name}
              </span>
            </Link>
          );
        })}
      </div>
    </motion.div>
  );
}
