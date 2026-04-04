import { useState, useEffect } from 'react';
import axios from 'axios';
import { Users, FileText, AlertOctagon, IndianRupee, RefreshCw, Activity, ShieldCheck, TrendingUp, Zap, CloudRain, Wind } from 'lucide-react';
import { motion } from 'framer-motion';

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  in: { opacity: 1, y: 0 },
  out: { opacity: 0, y: -20 },
};

export default function Admin() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [customCity, setCustomCity] = useState('');

  const fetchStats = async () => {
    setLoading(true);
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'https://gigshield-backend-c1z7.onrender.com';
      const { data } = await axios.get(`${API_URL}/api/admin/stats`);
      setData(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const triggerWebhook = async (city, zone, triggerEvent, eventSeverity) => {
    if (!confirm(`Are you sure you want to trigger a ${triggerEvent} disruption in ${city}?`)) return;
    setLoading(true);
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'https://gigshield-backend-c1z7.onrender.com';
      const res = await axios.post(`${API_URL}/api/insurance/webhook/trigger-disruption`, {
        city, zone, triggerEvent, eventSeverity
      });
      alert(`Success! ${res.data.stats.claimsCreated} zero-touch claims auto-processed for affected workers in ${city}. Total Payout: ₹${res.data.stats.totalPayout}`);
      fetchStats();
    } catch (err) {
      alert('Failed to trigger webhook');
      setLoading(false);
    }
  };

  const resetWeekly = async () => {
    if (!confirm('Are you sure you want to reset the weekly claims count for all active users?')) return;
    setLoading(true);
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'https://gigshield-backend-c1z7.onrender.com';
      const res = await axios.post(`${API_URL}/api/admin/reset-weekly`);
      alert(res.data.message);
      fetchStats();
    } catch (err) {
      alert('Failed to reset weekly limits');
      setLoading(false);
    }
  };

  useEffect(() => { fetchStats(); }, []);

  if (!data) return null;

  return (
    <motion.div initial="initial" animate="in" exit="out" variants={pageVariants} transition={{ duration: 0.4 }} className="space-y-6 py-6 pb-20">
      
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-900 rounded-2xl p-6 border border-slate-800 shadow-xl">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            Admin <span className="text-indigo-400">Portal</span>
          </h1>
          <p className="text-slate-400 mt-1">Platform overview and aggregate statistics</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <button 
            onClick={resetWeekly} disabled={loading}
            className="flex items-center justify-center gap-2 bg-slate-800 hover:bg-orange-500/20 text-slate-300 hover:text-orange-400 px-4 py-2.5 w-full sm:w-auto rounded-lg transition-colors border border-slate-700 hover:border-orange-500/50 disabled:opacity-50 font-medium shadow-sm text-sm"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} /> Reset Weekly Limits
          </button>
          <button 
            onClick={fetchStats} disabled={loading}
            className="flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-white px-4 py-2.5 w-full sm:w-auto rounded-lg transition-colors border border-slate-700 disabled:opacity-50 font-medium shadow-sm text-sm"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} /> Refresh
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
        <StatCard title="Total Users" value={data.totalUsers} icon={Users} color="text-indigo-400" />
        <StatCard title="Active Policies" value={data.activePolicies} icon={ShieldCheck} color="text-emerald-400" />
        <StatCard title="Total Claims" value={data.claimsCount} icon={FileText} color="text-blue-400" />
        <StatCard title="Fraud Blocked" value={data.fraudAttempts} icon={AlertOctagon} color="text-red-400" />
        <StatCard title="Total Payouts" className="col-span-2 lg:col-span-1" value={`₹${data.totalPayout}`} icon={IndianRupee} color="text-emerald-500" />
      </div>

      {/* Zero-Touch Claim Triggers */}
      <div className="bg-slate-900 rounded-2xl border border-indigo-500/50 shadow-[0_0_30px_rgba(99,102,241,0.1)] p-5 sm:p-6 mt-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2 mb-1">
              <Zap className="w-5 h-5 text-indigo-400"/> Parametric Webhooks (Mock API)
            </h2>
            <p className="text-xs text-slate-400">Simulate triggers to test the auto-claim engine pipeline.</p>
          </div>
          <div className="w-full sm:w-64 relative">
             <input type="text" placeholder="Target City (e.g. Mangalagiri)" className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg px-4 py-2 focus:border-indigo-500 outline-none text-sm" value={customCity} onChange={e => setCustomCity(e.target.value)} />
             <div className="absolute right-3 top-2.5 text-[10px] uppercase font-bold text-slate-500 pointer-events-none">Override</div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <WebhookButton icon={CloudRain} label="Heavy Rain" desc={`Trigger for ${customCity || 'Mumbai'}`} onClick={() => triggerWebhook(customCity || 'Mumbai', '', 'Heavy Rain', '99mm Rainfall Alert')} loading={loading} color="bg-blue-500/20 text-blue-400 border-blue-500/30" hoverColor="hover:bg-blue-500 hover:text-white" />
          <WebhookButton icon={Wind} label="High AQI" desc={`Trigger for ${customCity || 'Delhi'}`} onClick={() => triggerWebhook(customCity || 'Delhi', '', 'High AQI', 'AQI > 450 - Hazardous')} loading={loading} color="bg-orange-500/20 text-orange-400 border-orange-500/30" hoverColor="hover:bg-orange-500 hover:text-white" />
          <WebhookButton icon={AlertOctagon} label="Curfew Imposed" desc={`Trigger for ${customCity || 'Bangalore'}`} onClick={() => triggerWebhook(customCity || 'Bangalore', '', 'Curfew', 'Section 144 Imposed')} loading={loading} color="bg-red-500/20 text-red-400 border-red-500/30" hoverColor="hover:bg-red-500 hover:text-white" />
        </div>
      </div>

      {/* Payout Metric Graph */}
      <div className="bg-slate-900 rounded-2xl border border-slate-800 shadow-xl p-4 sm:p-6 overflow-x-auto">
        <h2 className="text-lg font-bold text-white flex items-center gap-2 mb-6 sm:mb-8"><TrendingUp className="w-5 h-5 text-indigo-400"/> System Payout Volume (7-Day Trend)</h2>
        
        <div className="flex items-end justify-between h-40 sm:h-48 gap-2 min-w-[500px]">
          {[40, 70, 45, 90, 30, 100, 60].map((val, i) => (
            <div key={i} className="w-full flex flex-col justify-end items-center group h-full">
              <div className="text-xs font-bold text-emerald-400 mb-2 opacity-0 group-hover:opacity-100 transition-opacity translate-y-2 group-hover:translate-y-0">
                ₹{val * 15}
              </div>
              <div 
                className={`w-full max-w-[40px] sm:max-w-[60px] rounded-t-lg transition-all duration-500 ${i === 6 ? 'bg-indigo-500' : 'bg-slate-700 group-hover:bg-slate-600'}`}
                style={{ height: `${val}%` }}
              ></div>
              <div className={`text-[10px] sm:text-xs mt-2 sm:mt-3 font-medium ${i === 6 ? 'text-indigo-400' : 'text-slate-500'}`}>
                {i === 6 ? 'Today' : `Day -${6-i}`}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Users Table */}
        <div className="bg-slate-900 rounded-2xl border border-slate-800 shadow-xl overflow-hidden flex flex-col h-[500px] sm:h-[600px]">
          <div className="p-4 sm:p-5 border-b border-slate-800 bg-slate-800/50 flex-shrink-0">
            <h2 className="text-lg font-bold text-white flex items-center gap-2"><Users className="w-5 h-5 text-indigo-400"/> Registered Workers</h2>
          </div>
          <div className="overflow-x-auto overflow-y-auto flex-1 p-0 custom-scrollbar">
            <table className="w-full text-left text-sm text-slate-400 whitespace-nowrap">
              <thead className="bg-slate-800/50 text-[10px] sm:text-xs uppercase text-slate-300 sticky top-0 backdrop-blur-md z-10">
                <tr>
                  <th className="px-4 py-3 font-medium">Name</th>
                  <th className="px-4 py-3 font-medium">City / Risk</th>
                  <th className="px-4 py-3 font-medium">Usage Log</th>
                  <th className="px-4 py-3 font-medium">Payouts</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                {data.users.map(u => (
                  <tr key={u._id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="px-4 py-3 font-medium text-white">{u.name}<div className="text-[10px] sm:text-xs text-slate-500 font-normal mt-1 flex items-center gap-1"><ShieldCheck className="w-3 h-3 text-emerald-500"/> {u.platform}</div></td>
                    <td className="px-4 py-3">{u.city} <span className="ml-1 sm:ml-2 text-[10px] sm:text-xs text-indigo-400 font-bold bg-indigo-500/10 px-2 py-0.5 rounded-full" title={`Risk Score: ${u.riskScore}`}>{(u.riskScore * 100).toFixed(0)}%</span></td>
                    <td className="px-4 py-3">
                      <span className={`inline-block mb-1 px-2 py-0.5 sm:py-1 rounded text-[10px] sm:text-xs font-bold ${u.activePlan === 'None' ? 'bg-slate-800 border-slate-700 text-slate-400' : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'}`}>
                        {u.activePlan}
                      </span>
                      {u.activePlan !== 'None' && <div className="text-[10px] sm:text-xs text-slate-500">{u.claimsThisWeek} / {u.maxClaimsPerWeek} Claims</div>}
                    </td>
                    <td className="px-4 py-3 font-bold text-white text-sm sm:text-base">₹{u.totalPayouts} <br/><span className="text-[10px] sm:text-xs text-slate-500 font-normal">Cap: ₹{u.coverageRemaining}</span></td>
                  </tr>
                ))}
                {data.users.length === 0 && <tr><td colSpan="4" className="text-center py-12 text-slate-500">No users found.</td></tr>}
              </tbody>
            </table>
          </div>
        </div>

        {/* Claims Table */}
        <div className="bg-slate-900 rounded-2xl border border-slate-800 shadow-xl overflow-hidden flex flex-col h-[500px] sm:h-[600px]">
          <div className="p-4 sm:p-5 border-b border-slate-800 bg-slate-800/50 flex-shrink-0">
            <h2 className="text-lg font-bold text-white flex items-center gap-2"><Activity className="w-5 h-5 text-purple-400"/> Operational Feed</h2>
          </div>
          <div className="overflow-x-auto overflow-y-auto flex-1 p-0 custom-scrollbar">
            <table className="w-full text-left text-sm text-slate-400 whitespace-nowrap">
              <thead className="bg-slate-800/50 text-[10px] sm:text-xs uppercase text-slate-300 sticky top-0 backdrop-blur-md z-10">
                <tr>
                  <th className="px-4 py-3 font-medium">Event Code</th>
                  <th className="px-4 py-3 font-medium">Location Info</th>
                  <th className="px-4 py-3 font-medium">Financials</th>
                  <th className="px-4 py-3 font-medium text-right">Settlement</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                {data.claims.map(c => (
                  <tr key={c._id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="px-4 py-3 font-medium text-white">{c.triggerEvent} <div className="text-[9px] sm:text-[10px] text-slate-500 mt-1 font-mono">{c._id.substring(c._id.length-8)}</div></td>
                    <td className="px-4 py-3 capitalize text-slate-300">{c.city} <div className="text-[10px] sm:text-xs text-slate-500 mt-0.5">{new Date(c.createdAt).toLocaleDateString()}</div></td>
                    <td className="px-4 py-3">
                      <span className="text-[10px] sm:text-xs text-slate-500">Loss: </span><span className="font-medium text-slate-300">₹{c.loss}</span>
                      <br/>
                      <span className={`text-[10px] sm:text-xs ${c.status === 'Approved' ? 'text-emerald-400 font-bold' : 'text-slate-500 line-through'}`}>Payout: ₹{c.payoutAmount}</span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span className={`inline-flex px-2 py-0.5 sm:py-1 rounded text-[10px] sm:text-xs font-bold uppercase tracking-wide ${c.status === 'Approved' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/20' : 'bg-red-500/20 text-red-400 border border-red-500/20'}`}>
                        {c.status}
                      </span>
                    </td>
                  </tr>
                ))}
                {data.claims.length === 0 && <tr><td colSpan="4" className="text-center py-12 text-slate-500">No claims registered.</td></tr>}
              </tbody>
            </table>
          </div>
        </div>
      </div>

    </motion.div>
  );
}

function StatCard({ title, value, icon: Icon, color, className = "" }) {
  return (
    <div className={`bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-lg relative overflow-hidden group hover:border-slate-700 transition-all hover:-translate-y-1 flex flex-col justify-center min-h-[90px] sm:min-h-[110px] ${className}`}>
      <div className="flex flex-col gap-2 relative z-10 w-full h-full">
        <div className={`w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-xl bg-slate-800 ${color} shadow-inner shrink-0`}>
          <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
        </div>
        <div className="mt-auto">
          <div className="text-[10px] sm:text-sm text-slate-400 font-medium leading-none mb-1 line-clamp-1">{title}</div>
          <div className="text-base sm:text-2xl font-bold text-white tracking-tight leading-none truncate">{value}</div>
        </div>
      </div>
      <div className="absolute right-0 bottom-0 top-0 w-12 sm:w-16 bg-gradient-to-l from-slate-800/50 to-transparent opacity-50 pointer-events-none"></div>
    </div>
  );
}

function WebhookButton({ icon: Icon, label, desc, onClick, loading, color, hoverColor }) {
  return (
    <button 
      onClick={onClick}
      disabled={loading}
      className={`border rounded-xl p-4 text-left transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed group ${color} ${hoverColor}`}
    >
      <div className="flex items-center gap-3">
        <Icon className="w-6 h-6 shrink-0" />
        <div>
          <div className="font-bold text-sm">{label}</div>
          <div className="text-[10px] opacity-80 mt-0.5 uppercase tracking-wide">{desc}</div>
        </div>
      </div>
    </button>
  );
}
