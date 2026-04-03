import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { ThemeProvider } from './contexts/ThemeContext';
import Navbar from './components/Navbar';
import BottomNav from './components/BottomNav';
import Login from './pages/Login';
import AdminLogin from './pages/AdminLogin';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import Admin from './pages/Admin';

function ProtectedRoute({ children }) {
  const user = JSON.parse(localStorage.getItem('user'));
  if (!user || user.role === 'admin') {
    return <Navigate to="/login" replace />;
  }
  return children;
}

// Strict route guard for staff operations
function AdminRoute({ children }) {
  const user = JSON.parse(localStorage.getItem('user'));
  if (!user || user.role !== 'admin') {
    return <Navigate to="/admin-login" replace />;
  }
  return children;
}

function AppContent() {
  const location = useLocation();
  const hideNav = location.pathname === '/login' || location.pathname === '/admin-login' || location.pathname === '/';

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 font-sans w-full overflow-x-hidden">
      {!hideNav && <Navbar />}
      
      {/* Adjust padding top dynamically based on whether top nav is visible */}
      <main className={`flex-1 w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 ${!hideNav ? 'pt-24 sm:pt-28 lg:pt-32 pb-24 md:pb-8' : ''}`}>
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/login" element={<Login />} />
            <Route path="/admin-login" element={<AdminLogin />} />
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            <Route path="/admin" element={<AdminRoute><Admin /></AdminRoute>} />
            <Route path="/" element={<Navigate to="/login" replace />} />
          </Routes>
        </AnimatePresence>
      </main>

      {/* Show BottomNav on mobile when logged in */}
      {!hideNav && <div className="md:hidden"><BottomNav /></div>}
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <Router>
        <AppContent />
      </Router>
    </ThemeProvider>
  );
}

export default App;
