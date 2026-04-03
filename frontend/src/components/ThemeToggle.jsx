import { Sun, Moon } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';

export default function ThemeToggle() {
  const { isDark, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="relative w-12 h-6 md:w-14 md:h-7 rounded-full bg-slate-800 border border-slate-700 flex items-center p-1 cursor-pointer transition-colors shadow-inner shrink-0"
      aria-label="Toggle Dark Mode"
    >
      <motion.div
        className="w-4 h-4 md:w-5 md:h-5 bg-indigo-500 rounded-full flex items-center justify-center shadow-lg"
        animate={{ x: isDark ? '120%' : '0%' }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
      >
        {isDark ? (
          <Moon className="w-2.5 h-2.5 md:w-3 md:h-3 text-white" />
        ) : (
          <Sun className="w-2.5 h-2.5 md:w-3 md:h-3 text-white" />
        )}
      </motion.div>
    </button>
  );
}
