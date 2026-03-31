import { useState, useEffect } from 'react';
import axios from 'axios';
import { User, Settings, Save, Loader } from 'lucide-react';

export default function Profile() {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user') || '{}'));
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: user.name || '',
    city: user.city || 'Mumbai',
    platform: user.platform || 'Zomato',
    zone: user.zone || 'General',
    workingHoursStart: user.workingHours?.start || '09:00',
    workingHoursEnd: user.workingHours?.end || '21:00',
  });

  const [hasChangedRisk, setHasChangedRisk] = useState(false);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Check if risk factors were actually modified
    const riskModified = (formData.city !== user.city || formData.zone !== user.zone);
    
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'https://gigshield-backend-c1z7.onrender.com';
      const { data } = await axios.put(`${API_URL}/api/auth/profile/${user._id}`, formData);
      
      // Merge updated fields back into local storage smoothly
      const updatedUser = { ...user, ...data.user };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
      
      if (riskModified) {
        setHasChangedRisk(true);
      } else {
        alert('Profile successfully updated!');
      }
      
    } catch (error) {
       console.error(error);
       alert('Profile update failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in py-6 pb-20 font-sans">
      <div className="bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-xl overflow-hidden relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 blur-[100px] rounded-full pointer-events-none"></div>
        
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-indigo-500/20 text-indigo-400 rounded-2xl flex items-center justify-center font-black text-3xl border border-indigo-500/30 shadow-inner">
            {user.name ? user.name.charAt(0) : 'U'}
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">{user.name}</h1>
            <p className="text-slate-400 font-medium">Manage your active configurations</p>
          </div>
        </div>

        {hasChangedRisk && (
           <div className="mb-6 bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 flex items-start gap-3">
             <div className="bg-amber-500/20 p-1.5 rounded-lg shrink-0">
                <Settings className="w-5 h-5 text-amber-400" />
             </div>
             <div>
               <h4 className="text-amber-400 font-bold mb-1">Risk Profile Updated</h4>
               <p className="text-sm text-slate-300">Your base risk parameters have changed silently behind the scenes. <strong className="text-white">Your premium price is strictly locked for the current week</strong> and will not be affected right now. The new dynamic pricing will be safely applied at the start of your next billing cycle.</p>
               <button onClick={() => setHasChangedRisk(false)} className="mt-2 text-xs font-bold text-amber-400 hover:text-amber-300 uppercase tracking-widest backdrop-blur-sm">Dismiss Settings</button>
             </div>
           </div>
        )}

        <form onSubmit={handleUpdate} className="space-y-6 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Legal Name</label>
              <div className="relative">
                <input
                  type="text"
                  className="w-full bg-slate-800/50 border border-slate-700 text-white rounded-xl px-4 py-3 pl-11 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all font-medium"
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  required
                />
                <User className="w-5 h-5 text-slate-500 absolute left-3.5 top-3.5" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Primary Platform</label>
              <select
                className="w-full bg-slate-800/50 border border-slate-700 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-indigo-500 transition-all font-medium appearance-none"
                value={formData.platform}
                onChange={e => setFormData({...formData, platform: e.target.value})}
              >
                <option value="Zomato">Zomato</option>
                <option value="Swiggy">Swiggy</option>
                <option value="Zepto">Zepto</option>
                <option value="Uber">Uber</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Operating City</label>
              <select
                className="w-full bg-slate-800/50 border border-slate-700 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-indigo-500 transition-all font-medium appearance-none"
                value={formData.city}
                onChange={e => setFormData({...formData, city: e.target.value})}
              >
                <option value="Mumbai">Mumbai</option>
                <option value="Bangalore">Bangalore</option>
                <option value="Delhi">Delhi</option>
                <option value="Pune">Pune</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Threat Zone</label>
              <select
                className="w-full bg-slate-800/50 border border-slate-700 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-indigo-500 transition-all font-medium appearance-none"
                value={formData.zone}
                onChange={e => setFormData({...formData, zone: e.target.value})}
              >
                <option value="General">General / Unknown</option>
                <option value="Flood Prone (Dharavi)">Flood Prone / Low-Lying</option>
                <option value="Safe (High Ground)">Safe / High Ground</option>
                <option value="High Crime Rate">High Crime Rate Area</option>
              </select>
            </div>

            <div className="space-y-2">
               <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Shift Start</label>
               <input 
                 type="time" 
                 className="w-full bg-slate-800/50 border border-slate-700 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-indigo-500 transition-all font-medium" 
                 value={formData.workingHoursStart} 
                 onChange={e => setFormData({...formData, workingHoursStart: e.target.value})} 
                 required
               />
            </div>
            
            <div className="space-y-2">
               <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Shift End</label>
               <input 
                 type="time" 
                 className="w-full bg-slate-800/50 border border-slate-700 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-indigo-500 transition-all font-medium" 
                 value={formData.workingHoursEnd} 
                 onChange={e => setFormData({...formData, workingHoursEnd: e.target.value})} 
                 required
               />
            </div>

          </div>

          <div className="pt-6 border-t border-slate-800 flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-400 hover:to-indigo-500 text-white font-bold tracking-wide rounded-xl px-8 py-3.5 flex items-center justify-center gap-2 transition-all transform hover:scale-[1.02] active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(99,102,241,0.2)]"
            >
              {loading ? <Loader className="w-5 h-5 animate-spin" /> : (
                <>
                  <Save className="w-5 h-5" />
                  Save Configuration
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
