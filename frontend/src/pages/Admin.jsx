import { useState, useEffect } from 'react';
import axios from 'axios';
import { Users, FileText, AlertOctagon, IndianRupee, RefreshCw, Activity, ShieldCheck, TrendingUp } from 'lucide-react';

export default function Admin() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get('https://gigshield-backend-c1z7.onrender.com/api/admin/stats');
      setData(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchStats(); }, []);

  if (!data) return null;

  return (
    <div className="space-y-6 animate-in fade-in py-6 pb-20">
      
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-900 rounded-2xl p-6 border border-slate-800 shadow-xl">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            Admin <span className="text-indigo-400">Portal</span>
          </h1>
          <p className="text-slate-400 mt-1">Platform overview and aggregate statistics</p>
        </div>
        <button 
          onClick={fetchStats} disabled={loading}
          className="flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-white px-4 py-2.5 w-full sm:w-auto rounded-lg transition-colors border border-slate-700 disabled:opacity-50 font-medium shadow-sm"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} /> Refresh
        </button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
        <StatCard title="Total Users" value={data.totalUsers} icon={Users} color="text-indigo-400" />
        <StatCard title="Active Policies" value={data.activePolicies} icon={ShieldCheck} color="text-emerald-400" />
        <StatCard title="Total Claims" value={data.claimsCount} icon={FileText} color="text-blue-400" />
        <StatCard title="Fraud Blocked" value={data.fraudAttempts} icon={AlertOctagon} color="text-red-400" />
        <StatCard title="Total Payouts" className="col-span-2 lg:col-span-1" value={`₹${data.totalPayout}`} icon={IndianRupee} color="text-emerald-500" />
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

    </div>
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
