import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
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

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col pt-16 bg-slate-950 font-sans">
        <Navbar />
        <main className="flex-1 w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/admin-login" element={<AdminLogin />} />
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            <Route path="/admin" element={<AdminRoute><Admin /></AdminRoute>} />
            <Route path="/" element={<Navigate to="/login" replace />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
