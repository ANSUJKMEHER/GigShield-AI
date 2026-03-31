import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Lock, ArrowRight, Loader } from 'lucide-react';

export default function AdminLogin() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: 'admin@gigshield.ai',
    password: 'admin'
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    // Simulating admin login since we don't have a rigid admin schema yet on backend.
    // Replace with a real API call later.
    setTimeout(() => {
      const emailInput = formData.email.trim().toLowerCase();
      const passwordInput = formData.password.trim();
      
      if (emailInput === 'admin@gigshield.ai' && passwordInput === 'admin') {
         localStorage.setItem('user', JSON.stringify({ 
           _id: 'admin_123', 
           name: 'System Admin', 
           email: 'admin@gigshield.ai', 
           role: 'admin',
           platform: 'GigShield Core'
         }));
         navigate('/admin');
      } else {
         alert('Invalid credentials');
      }
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <div className="w-full max-w-md relative animate-in slide-in-from-bottom-5 fade-in duration-500">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl blur opacity-30 animate-pulse"></div>
        <div className="relative bg-slate-900 border border-slate-700 rounded-2xl p-8 shadow-2xl">
          
          <div className="text-center mb-8">
            <div className="mx-auto w-16 h-16 bg-slate-800 rounded-2xl flex items-center justify-center mb-4 shadow-inner border border-slate-700">
              <Shield className="w-8 h-8 text-emerald-400 drop-shadow-md" />
            </div>
            <h2 className="text-2xl font-black text-white mb-2 uppercase tracking-tight">Admin Console</h2>
            <p className="text-slate-400 text-sm font-medium">Secure infrastructure access</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
               <input
                 type="email"
                 placeholder="Admin Email"
                 className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-4 py-3 pl-11 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all font-medium"
                 value={formData.email}
                 onChange={e => setFormData({...formData, email: e.target.value})}
                 required
               />
               <Shield className="w-5 h-5 text-slate-500 absolute left-3.5 top-3.5" />
            </div>
            
            <div className="relative">
               <input
                 type="password"
                 placeholder="Security Key"
                 className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-4 py-3 pl-11 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all font-medium"
                 value={formData.password}
                 onChange={e => setFormData({...formData, password: e.target.value})}
                 required
               />
               <Lock className="w-5 h-5 text-slate-500 absolute left-3.5 top-3.5" />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-bold tracking-wide rounded-lg px-4 py-3.5 flex items-center justify-center gap-2 transition-all transform hover:scale-[1.02] active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed shadow-[0_0_15px_rgba(16,185,129,0.3)] mt-2"
            >
              {loading ? <Loader className="w-5 h-5 animate-spin" /> : (
                <>
                  Authenticate Request
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

        </div>
      </div>
    </div>
  );
}
