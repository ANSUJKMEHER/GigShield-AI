import { useState, useEffect } from 'react';
import axios from 'axios';
import { CloudRain, Wind, AlertTriangle, Shield, Wallet, Activity, IndianRupee, Bell, AlertCircle, FileText, Smartphone, ServerCrash, Navigation, CheckCircle2, XCircle, MapPin, Loader2, PlayCircle, Zap, TrendingDown, Clock, ShieldCheck } from 'lucide-react';

export default function Dashboard() {
  const [userData, setUserData] = useState(null);
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(false);
  const [simStep, setSimStep] = useState(0); 
  const [simulationResult, setSimulationResult] = useState(null);
  const [env, setEnv] = useState({ active: true, gps: true, telemetry: true });
  const [isSelectingPlan, setIsSelectingPlan] = useState(false);
  const [showClaimPopup, setShowClaimPopup] = useState(false);

  const fetchUser = async () => {
    try {
      const storedUser = JSON.parse(localStorage.getItem('user'));
      if (!storedUser) return;
      const { data } = await axios.get(`https://gigshield-backend-c1z7.onrender.com/api/auth/user/${storedUser._id}`);
      setUserData(data.user);
      setClaims(data.claims);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => { fetchUser(); }, []);

  const subscribePlan = async (planName) => {
    try {
      await axios.post('https://gigshield-backend-c1z7.onrender.com/api/insurance/subscribe', { userId: userData._id, plan: planName });
      setIsSelectingPlan(false);
      fetchUser();
    } catch (error) { alert('Failed to subscribe'); }
  };

  const handleSimulate = async (type) => {
    setLoading(true); setSimulationResult(null); setSimStep(1); setShowClaimPopup(false);
    
    try {
      const { data } = await axios.post('https://gigshield-backend-c1z7.onrender.com/api/insurance/simulate-event', {
        userId: userData._id, triggerEvent: type, city: userData.city, expectedIncome: 500, actualIncome: 200, isWorkerActive: env.active, isGpsVerified: env.gps, isTelemetryValid: env.telemetry
      });
      setSimStep(2); 
      setTimeout(() => {
        setSimStep(3);
        setSimulationResult({ success: true, message: data.message, claim: data.claim });
        setLoading(false);
        fetchUser();
        setShowClaimPopup(true);
        setTimeout(() => setShowClaimPopup(false), 5000);
      }, 1500);
    } catch (error) {
      setSimStep(2);
      setTimeout(() => {
        setSimStep(3);
        setSimulationResult({ success: false, message: error.response?.data?.stack || error.response?.data?.message || 'Failed', claim: error.response?.data?.claim });
        setLoading(false);
        fetchUser(); 
      }, 1500);
    }
  };

  if (!userData) return null;

  const riskLabel = userData.riskScore >= 0.8 ? 'High' : userData.riskScore >= 0.5 ? 'Medium' : 'Low';
  const riskColor = userData.riskScore >= 0.8 ? 'text-red-400' : userData.riskScore >= 0.5 ? 'text-orange-400' : 'text-emerald-400';
  const riskShadow = userData.riskScore >= 0.8 ? 'shadow-[0_0_20px_rgba(248,113,113,0.4)]' : userData.riskScore >= 0.5 ? 'shadow-[0_0_20px_rgba(251,146,60,0.4)]' : 'shadow-[0_0_20px_rgba(52,211,153,0.4)]';

  const claimsPercent = userData.maxClaimsPerWeek ? (userData.claimsThisWeek / userData.maxClaimsPerWeek) * 100 : 0;
  const coveragePercent = userData.coverage ? ((userData.coverage - userData.coverageRemaining) / userData.coverage) * 100 : 0;

  return (
    <div className="space-y-6 animate-in fade-in py-6 pb-20 relative font-sans">
      
      {/* 6. Claim Animation Popup */}
      {showClaimPopup && simulationResult?.success && (
        <div className="fixed top-20 right-10 z-50 animate-in slide-in-from-top-10 fade-in zoom-in duration-500 bg-gradient-to-r from-emerald-500 to-teal-400 p-[2px] rounded-2xl shadow-[0_0_40px_rgba(16,185,129,0.5)]">
           <div className="bg-slate-900/90 backdrop-blur-md px-6 py-4 rounded-xl flex items-center gap-4">
              <div className="w-12 h-12 bg-emerald-500/20 rounded-full flex items-center justify-center animate-pulse">
                 <Zap className="w-6 h-6 text-emerald-400" />
              </div>
              <div>
                 <div className="text-emerald-400 font-bold text-xs uppercase tracking-widest">Instant Liquidity Verified</div>
                 <div className="text-3xl font-black text-white px-2 mt-1">₹{simulationResult.claim?.payoutAmount} Credited</div>
              </div>
           </div>
        </div>
      )}

      {/* Header & Smart Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className={`lg:col-span-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/80 backdrop-blur-xl rounded-2xl p-6 md:p-8 border border-slate-700/50 relative overflow-hidden transition-all duration-500 ${riskShadow}`}>
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 blur-[80px] rounded-full pointer-events-none"></div>
          
          <div className="relative z-10">
            <h1 className="text-3xl font-black text-white flex items-center gap-3 drop-shadow-md">
              Dashboard <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">Overview</span>
            </h1>
            <p className="text-slate-400 mt-2 font-medium text-lg">Platform: <span className="text-white backdrop-blur-sm bg-white/5 px-2 py-0.5 rounded-md border border-white/10">{userData.platform}</span> | User: {userData.name}</p>
          </div>
          
          <div className="relative z-10 flex flex-col items-start sm:items-end w-full sm:w-auto mt-4 sm:mt-0">
             <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Live Zone Threat</div>
             <div className={`flex items-center gap-3 px-5 py-3 rounded-2xl bg-slate-900/50 backdrop-blur-md border border-slate-700/50 shadow-inner ${riskColor} relative`}>
                <div className={`absolute inset-0 bg-current opacity-[0.03] rounded-2xl animate-pulse`}></div>
                <Activity className="w-6 h-6 shrink-0 z-10" />
                <div className="z-10 flex flex-col">
                  <span className="text-[10px] font-bold uppercase opacity-80 leading-none tracking-widest">Risk Score</span>
                  <span className="text-2xl font-black leading-none mt-1">{userData.riskScore.toFixed(2)} <span className="text-sm">({riskLabel})</span></span>
                </div>
             </div>
          </div>
        </div>

        {/* 8. Smart Alerts UI */}
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-6 border border-slate-700/50 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-900/40 via-transparent to-transparent pointer-events-none"></div>
          <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-4 relative z-10">
            <Bell className="w-5 h-5 text-indigo-400 animate-bounce" /> Smart Intelligence
          </h3>
          <div className="space-y-3 relative z-10">
            {userData.riskScore >= 0.5 && (
              <div className="flex gap-4 text-sm text-red-100 bg-red-500/10 p-4 rounded-xl border border-red-500/30 shadow-[0_4px_12px_rgba(239,68,68,0.1)] backdrop-blur-md transition-transform hover:-translate-y-1 hover:shadow-[0_8px_16px_rgba(239,68,68,0.15)]">
                <AlertTriangle className="w-6 h-6 shrink-0 text-red-400" />
                <div>
                  <div className="font-bold text-red-400 mb-0.5">Critical Risk Area</div>
                  <p className="opacity-90 leading-tight text-xs">High risk operations today. Deep validation models active.</p>
                </div>
              </div>
            )}
            {['mumbai', 'bangalore', 'chennai'].includes(userData.city.toLowerCase()) ? (
              <div className="flex gap-4 text-sm text-amber-100 bg-amber-500/10 p-4 rounded-xl border border-amber-500/30 shadow-[0_4px_12px_rgba(245,158,11,0.1)] backdrop-blur-md transition-transform hover:-translate-y-1 hover:shadow-[0_8px_16px_rgba(245,158,11,0.15)]">
                <CloudRain className="w-6 h-6 shrink-0 text-amber-400" />
                <div>
                  <div className="font-bold text-amber-400 mb-0.5">Weather Alert Match</div>
                  <p className="opacity-90 leading-tight text-xs">Severe weather reported in your {userData.city} radius.</p>
                </div>
              </div>
            ) : (
              <div className="flex gap-4 text-sm text-blue-100 bg-blue-500/10 p-4 rounded-xl border border-blue-500/30 shadow-[0_4px_12px_rgba(59,130,246,0.1)] backdrop-blur-md transition-transform hover:-translate-y-1 hover:shadow-[0_8px_16px_rgba(59,130,246,0.15)]">
                <Shield className="w-6 h-6 shrink-0 text-blue-400" />
                <div>
                  <div className="font-bold text-blue-400 mb-0.5">Zone Clear</div>
                  <p className="opacity-90 leading-tight text-xs">Safe routes monitored. No parametric triggers currently active.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 9. Weekly Usage Progress & Plans */}
      {userData.activePlan !== 'None' && !isSelectingPlan && (
         <div className="flex flex-col md:flex-row justify-between items-center gap-6 bg-slate-900/60 backdrop-blur-lg p-5 rounded-3xl border border-slate-700/50 shadow-lg relative overflow-hidden">
           <div className="absolute top-0 right-0 w-40 h-40 bg-indigo-500/10 blur-[50px] rounded-full pointer-events-none"></div>
           
           <div className="flex-1 w-full grid grid-cols-1 sm:grid-cols-2 gap-8 relative z-10">
              <UsageBar title="Claims Exhausted" current={userData.claimsThisWeek} max={userData.maxClaimsPerWeek} percent={claimsPercent} color="from-indigo-500 to-purple-500" icon={<AlertCircle className="w-4 h-4 text-indigo-400"/>} />
              <UsageBar title="Coverage Depleted" prefix="₹" current={userData.coverage - userData.coverageRemaining} max={userData.coverage} percent={coveragePercent} color="from-emerald-500 to-teal-400" icon={<Wallet className="w-4 h-4 text-emerald-400"/>} />
           </div>
           
           <button onClick={() => setIsSelectingPlan(true)} className="shrink-0 text-sm px-6 py-4 w-full sm:w-auto bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 text-white rounded-2xl transition-all shadow-[0_0_15px_rgba(99,102,241,0.4)] hover:shadow-[0_0_25px_rgba(99,102,241,0.6)] font-bold tracking-wide hover:-translate-y-0.5 relative z-10">
             Manage Policy
           </button>
         </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard title="Active Plan" value={userData.activePlan !== 'None' ? userData.activePlan : 'None'} icon={Shield} color="text-emerald-400" />
        <StatCard title="Weekly Premium" value={`₹${userData.premium}`} icon={Wallet} color="text-indigo-400" />
        <StatCard title="Total Coverage" value={`₹${userData.coverage}`} icon={Shield} color="text-purple-400" />
        <StatCard title="Coverage Left" value={`₹${userData.coverageRemaining}`} icon={Activity} color="text-pink-400" />
        <StatCard title="Total Payouts" className="col-span-2 lg:col-span-1" value={`₹${userData.totalPayouts}`} icon={IndianRupee} color="text-blue-400" />
      </div>

      {/* Plans Section */}
      {(userData.activePlan === 'None' || isSelectingPlan) && (
        <div className="bg-slate-900/80 backdrop-blur-xl rounded-3xl p-8 border border-slate-700/50 shadow-2xl relative overflow-hidden animate-in zoom-in-95 duration-500">
           <div className="absolute -top-40 -right-40 w-96 h-96 bg-indigo-500/10 blur-[100px] rounded-full pointer-events-none"></div>
           <div className="flex justify-between items-center mb-8 relative z-10">
             <h2 className="text-3xl font-black text-white drop-shadow-md">Select Coverage Plan</h2>
             {userData.activePlan !== 'None' && <button onClick={() => setIsSelectingPlan(false)} className="text-sm bg-slate-800/80 backdrop-blur border border-slate-600 px-4 py-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-700 transition-colors font-bold">Cancel</button>}
           </div>
           <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
             {[{name: 'Basic', price: 10, cov: 300, max: 1}, {name: 'Pro', price: 25, cov: 800, max: 2}, {name: 'Elite', price: 40, cov: 1500, max: 3}].map(plan => (
               <div key={plan.name} className={`bg-slate-900/50 backdrop-blur-sm rounded-2xl p-6 border transition-all duration-300 shadow-xl ${userData.activePlan === plan.name ? 'border-indigo-500 ring-2 ring-indigo-500/50 transform scale-[1.02]' : 'border-slate-700 hover:border-indigo-400 hover:-translate-y-2 hover:shadow-[0_10px_30px_rgba(99,102,241,0.2)]'}`}>
                 <div className="flex justify-between items-start">
                   <h3 className="text-xl font-black text-white mb-2">{plan.name} Package</h3>
                   {userData.activePlan === plan.name && <span className="px-3 py-1 text-[10px] font-black uppercase tracking-widest bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-full shadow-md">Current</span>}
                 </div>
                 <div className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-br from-indigo-400 to-cyan-400 mb-6 drop-shadow-sm">₹{plan.price}<span className="text-sm text-slate-400 font-medium">/wk</span></div>
                 
                 <div className="space-y-4 mb-8 bg-slate-800/40 rounded-xl p-4 border border-slate-700/50 relative overflow-hidden">
                   <div className="text-sm text-slate-300 flex items-center justify-between relative z-10">
                     <span className="flex items-center gap-2"><Shield className="w-5 h-5 text-emerald-400" /> Max Coverage</span>
                     <span className="font-bold text-white text-base bg-slate-900/50 px-2 py-0.5 border border-slate-700 rounded">₹{plan.cov}</span>
                   </div>
                   <div className="text-sm text-slate-300 flex items-center justify-between relative z-10">
                     <span className="flex items-center gap-2"><AlertCircle className="w-5 h-5 text-orange-400" /> Max Claims / Wk</span>
                     <span className="font-bold text-white text-base bg-slate-900/50 px-2 py-0.5 border border-slate-700 rounded">{plan.max}</span>
                   </div>
                 </div>
                 <button onClick={() => subscribePlan(plan.name)} disabled={userData.activePlan === plan.name} className="w-full bg-gradient-to-r from-slate-700 to-slate-800 hover:from-indigo-500 hover:to-purple-600 disabled:from-slate-800 disabled:to-slate-900 disabled:text-slate-500 disabled:cursor-not-allowed text-white rounded-xl py-4 font-bold transition-all border border-slate-600 hover:border-indigo-400 hover:shadow-[0_0_20px_rgba(99,102,241,0.4)] tracking-wide">
                    {userData.activePlan === plan.name ? 'Active' : `Select ${plan.name}`}
                 </button>
               </div>
             ))}
           </div>
        </div>
      )}

      {userData.activePlan !== 'None' && !isSelectingPlan && (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          
          {/* Triggers & Core Simulation Section */}
          <div className="xl:col-span-2 bg-slate-900/80 backdrop-blur-xl rounded-3xl p-6 md:p-8 border border-slate-700/50 shadow-2xl flex flex-col justify-between relative overflow-hidden">
            <div className="absolute -top-32 -left-32 w-80 h-80 bg-emerald-500/10 blur-[80px] rounded-full pointer-events-none"></div>

            <div className="relative z-10">
              <div className="flex flex-col mb-8">
                <h2 className="text-2xl font-black text-white flex items-center gap-3 drop-shadow-sm">
                   <PlayCircle className="w-7 h-7 text-emerald-400" /> Simulate Parametric Trigger
                </h2>
                <p className="text-sm text-slate-400 mt-2 max-w-lg leading-relaxed">
                   Trigger a simulated red-alert event to test the AI evaluation engine. Income drop and anti-spoofing parameters will be evaluated in real-time.
                </p>
              </div>

              {/* 4. Fraud Detection UI Restyled */}
              <div className="bg-slate-800/40 backdrop-blur-md p-6 rounded-3xl border border-slate-700/50 mb-8 shadow-inner relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 pointer-events-none"></div>
                
                <div className="flex items-center justify-between mb-5 pb-3 border-b border-slate-700/50 relative z-10">
                   <span className="text-[11px] font-black text-slate-300 uppercase tracking-widest flex items-center gap-2"><Activity className="w-4 h-4 text-purple-400"/> Interactive Environment Modifiers</span>
                   <span className="text-[9px] font-black uppercase tracking-widest bg-emerald-500/20 px-3 py-1 rounded-full text-emerald-400 border border-emerald-500/30">Admin Sandbox</span>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 relative z-10">
                  <ValidationToggle label="Worker Active" state={env.active} setter={(v) => setEnv({...env, active: v})} icon={Smartphone} color="emerald" desc="Simulate online app state" />
                  <ValidationToggle label="GPS Validated" state={env.gps} setter={(v) => setEnv({...env, gps: v})} icon={Navigation} color="blue" desc="Simulate proper geometry fix" />
                  <ValidationToggle label="AI Telemetry" state={env.telemetry} setter={(v) => setEnv({...env, telemetry: v})} icon={Activity} color="purple" desc="Simulate valid micro-movements" />
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <TriggerButton icon={CloudRain} label="Heavy Rain" desc="Flood delay" onClick={() => handleSimulate('Heavy Rain')} disabled={loading || userData.claimsThisWeek >= userData.maxClaimsPerWeek} color="bg-gradient-to-br from-blue-500 to-cyan-500" />
                <TriggerButton icon={Wind} label="High AQI" desc="Hazard pay" onClick={() => handleSimulate('High AQI')} disabled={loading || userData.claimsThisWeek >= userData.maxClaimsPerWeek} color="bg-gradient-to-br from-orange-500 to-amber-500" />
                <TriggerButton icon={AlertTriangle} label="Curfew" desc="Safe restriction" onClick={() => handleSimulate('Curfew')} disabled={loading || userData.claimsThisWeek >= userData.maxClaimsPerWeek} color="bg-gradient-to-br from-red-500 to-rose-600" />
                <TriggerButton icon={ServerCrash} label="App Crash" desc="Platform down" onClick={() => handleSimulate('App Crash')} disabled={loading || userData.claimsThisWeek >= userData.maxClaimsPerWeek} color="bg-gradient-to-br from-indigo-500 to-purple-600" />
              </div>

              {/* 7. Claim Timeline Loading Bar */}
              {simStep > 0 && !simulationResult && (
                <div className="p-6 rounded-3xl border border-indigo-500/30 bg-indigo-500/5 flex flex-col gap-6 animate-pulse backdrop-blur-sm">
                   <div className="flex items-center gap-4">
                     <Loader2 className="w-8 h-8 text-indigo-400 animate-spin shrink-0 drop-shadow-[0_0_10px_rgba(99,102,241,0.5)]" />
                     <div>
                       <div className="font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400 tracking-wide uppercase text-sm sm:text-base">
                         {simStep === 1 ? 'Fetching Oracle Signals...' : 'Running Neural Validation Pipeline...'}
                       </div>
                       <div className="text-xs sm:text-sm text-slate-400 mt-1">Cross-referencing network metrics and biomechanical paths.</div>
                     </div>
                   </div>
                   
                   <div className="w-full pt-2">
                      <div className="flex justify-between text-[10px] sm:text-xs font-black text-slate-500 uppercase tracking-widest mb-2 relative z-10">
                         <span className="text-indigo-400">Triggered</span>
                         <span className={simStep >= 2 ? "text-indigo-400" : ""}>Evaluated</span>
                         <span>Finalizing Payout</span>
                      </div>
                      <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden relative">
                         <div className={`h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-500 relative ${simStep === 1 ? 'w-1/3' : simStep === 2 ? 'w-2/3' : 'w-full'}`}>
                            <div className="absolute top-0 right-0 bottom-0 left-0 bg-[linear-gradient(45deg,rgba(255,255,255,0.15)_25%,transparent_25%,transparent_50%,rgba(255,255,255,0.15)_50%,rgba(255,255,255,0.15)_75%,transparent_75%,transparent)] bg-[length:1rem_1rem] animate-[progress_1s_linear_infinite]"></div>
                         </div>
                      </div>
                   </div>
                </div>
              )}

              {/* 3. AI Decision Panel & Income Visualization Progress Bar */}
              {simulationResult && simStep === 3 && (
                <div className="animate-in slide-in-from-bottom-4 fade-in zoom-in-95 duration-500">
                  <div className={`p-6 rounded-t-3xl border-x border-t ${simulationResult.success ? 'bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border-emerald-500/50 shadow-[inset_0_2px_20px_rgba(16,185,129,0.1)]' : 'bg-gradient-to-r from-red-500/10 to-rose-500/10 border-red-500/50 shadow-[inset_0_2px_20px_rgba(239,68,68,0.1)]'} flex flex-col sm:flex-row sm:items-center justify-between gap-4 backdrop-blur-md relative overflow-hidden`}>
                    
                    <div className="flex items-center gap-5 relative z-10 w-full sm:w-auto">
                      <div className={`w-14 h-14 rounded-full flex items-center justify-center shrink-0 shadow-inner ${simulationResult.success ? 'bg-emerald-500/20 text-emerald-400 drop-shadow-[0_0_15px_rgba(52,211,153,0.5)]' : 'bg-red-500/20 text-red-400 drop-shadow-[0_0_15px_rgba(239,68,68,0.5)]'}`}>
                        {simulationResult.success ? <ShieldCheck className="w-8 h-8" /> : <XCircle className="w-8 h-8" />}
                      </div>
                      <div className="flex-1">
                        <div className={`font-black text-xl sm:text-2xl flex items-center gap-2 drop-shadow-sm ${simulationResult.success ? 'text-emerald-400' : 'text-red-400'}`}>
                           {simulationResult.success ? 'Claim Approved by AI Engine' : 'Syndicate Block Enabled'}
                        </div>
                        <div className="text-sm opacity-90 mt-1 font-medium text-slate-300 leading-tight md:pr-4">{simulationResult.message}</div>
                      </div>
                    </div>
                    {/* 5. Location Awareness tag */}
                    {simulationResult.claim && simulationResult.claim.fraudChecks?.gpsVerified && (
                      <div className="flex items-center self-start sm:self-center shrink-0 w-fit gap-2 text-[10px] px-4 py-2 rounded-xl bg-slate-900/80 backdrop-blur shadow-xl text-blue-400 border border-slate-700/50 font-black uppercase tracking-widest relative z-10 mt-2 sm:mt-0">
                        <MapPin className="w-3.5 h-3.5"/> 3km Radius Verif.
                      </div>
                    )}
                  </div>
                  
                  {simulationResult.claim && (
                    <div className="grid grid-cols-1 md:grid-cols-2 bg-slate-800/80 backdrop-blur border-x border-b border-slate-700/80 rounded-b-3xl overflow-hidden shadow-2xl relative">
                      
                      {/* Income Visualization Panel */}
                      <div className="p-6 md:p-8 border-b md:border-b-0 md:border-r border-slate-700/50 bg-slate-900/60 relative">
                        <div className="font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400 uppercase tracking-widest text-[11px] mb-5 flex items-center w-fit">
                           <TrendingDown className="w-4 h-4 mr-2 text-indigo-400 drop-shadow-md"/> Income Drop Analytics
                        </div>
                        
                        {/* 2. Progress Bar Chart replacing text */}
                        <div className="mb-6 bg-slate-800/50 p-4 rounded-xl border border-slate-700/50 shadow-inner">
                           <div className="flex justify-between text-xs font-bold mb-2">
                             <span className="text-slate-400 uppercase tracking-wider">Expected Base Margin</span>
                             <span className="text-white text-sm">₹{simulationResult.claim.expectedIncome}</span>
                           </div>
                           <div className="h-6 w-full bg-slate-900 rounded-lg overflow-hidden flex relative shadow-inner">
                             <div className="h-full bg-emerald-500/80 z-10 transition-all duration-1000 flex items-center px-3 text-[10px] font-black text-emerald-900 border-r border-emerald-400/50" style={{width: `${(simulationResult.claim.actualIncome / simulationResult.claim.expectedIncome) * 100}%`}}>
                                ACTUAL
                             </div>
                             <div className="h-full bg-gradient-to-r from-red-500/60 to-red-600/60 transition-all duration-1000 flex items-center justify-end px-3 text-[10px] font-black text-red-100 shadow-inner" style={{width: `${(simulationResult.claim.loss / simulationResult.claim.expectedIncome) * 100}%`}}>
                                LOGGED LOSS
                             </div>
                           </div>
                           <div className="flex justify-between mt-1 text-[10px] font-mono text-slate-500">
                              <span>₹{simulationResult.claim.actualIncome} Made</span>
                              <span>₹{simulationResult.claim.loss} Loss</span>
                           </div>
                        </div>

                        <div className="flex justify-between py-3 text-slate-300 border-t border-slate-700/50 mt-4"><span className="font-bold text-xs uppercase tracking-wider">Algorithmic Loss Gap:</span> <span className="font-black text-red-400 text-lg">₹{simulationResult.claim.loss}</span></div>
                        <div className="flex justify-between py-4 bg-slate-900/80 rounded-2xl px-5 border border-slate-700 mt-2 items-center shadow-lg relative overflow-hidden">
                           <div className="absolute top-0 right-0 w-16 h-16 bg-emerald-500/10 blur-[20px] rounded-full pointer-events-none"></div>
                           <span className="font-black uppercase text-[11px] text-slate-400 tracking-widest z-10">Calculated Payout</span> 
                           <span className={`font-black text-3xl z-10 ${simulationResult.success ? 'text-emerald-400 drop-shadow-[0_0_15px_rgba(52,211,153,0.6)]' : 'text-slate-600 line-through'}`}>
                              ₹{simulationResult.claim.payoutAmount}
                           </span>
                        </div>
                      </div>

                      {/* AI Validation Summary List */}
                      <div className="p-6 md:p-8 bg-slate-800/30">
                        <div className="font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 uppercase tracking-widest text-[11px] mb-5 flex items-center w-fit">
                           <Shield className="w-4 h-4 mr-2 text-purple-400 drop-shadow-md"/> Multi-Vector Summary
                        </div>
                        <div className="space-y-3.5">
                            <ValidationResultRow label="GPS Geometry" status={simulationResult.claim.fraudChecks?.gpsVerified} valPass="Authorized" valFail="Spoofed" />
                            <ValidationResultRow label="Active Worker Status" status={simulationResult.claim.fraudChecks?.workerActive} valPass="Confirmed" valFail="Offline" />
                            
                            {/* Area Match Specific Row */}
                            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900/40 border border-slate-700/50 shadow-inner">
                               <span className="flex items-center gap-3 text-slate-300 text-xs font-bold">
                                  {simulationResult.claim.fraudChecks?.weatherMatch !== false ? <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 drop-shadow-sm" /> : <XCircle className="w-5 h-5 text-red-500 shrink-0 drop-shadow-sm" />} 
                                  Oracle Area Match
                               </span>
                               <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-md truncate max-w-[140px] border border-emerald-500/20" title={simulationResult.claim.eventDetails?.severity || 'Zone Mismatch'}>
                                  {simulationResult.claim.eventDetails?.severity || 'Mismatch'}
                               </span>
                            </div>

                            <ValidationResultRow label="Cooldown Policy" status={simulationResult.claim.fraudChecks?.duplicateFree !== false} valPass="24hrs Valid" valFail="Duplicate" />
                            <ValidationResultRow label="Contextual Telemetry" status={simulationResult.claim.fraudChecks?.telemetryValid !== false} valPass="Biometrics OK" valFail="Static Device" highlightFail />
                        </div>
                      </div>

                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
          
          {/* Past Claims History Overhauled */}
          <div className="bg-slate-900/80 backdrop-blur-xl rounded-3xl border border-slate-700/50 shadow-2xl flex flex-col h-[600px] xl:h-[860px] mt-6 xl:mt-0 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-slate-700 via-indigo-500 to-purple-500"></div>
            <div className="p-6 md:p-8 border-b border-slate-700/50 flex justify-between items-center bg-slate-800/30 relative z-10">
              <h2 className="text-2xl font-black text-white flex items-center gap-3 drop-shadow-md">
                 <Clock className="w-6 h-6 text-indigo-400" /> History
              </h2>
              <span className="text-xs bg-indigo-500/20 px-4 py-1.5 rounded-full text-indigo-300 font-bold border border-indigo-500/30 shadow-inner tracking-widest uppercase">
                 {claims.length} Records
              </span>
            </div>
            
            <div className="p-5 md:p-6 flex-1 overflow-y-auto space-y-5 custom-scrollbar relative z-10 w-full overflow-x-hidden">
              {claims.length === 0 ? (
                <div className="text-center text-slate-500 py-24 flex flex-col items-center gap-6 animate-in fade-in duration-700">
                  <div className="w-20 h-20 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center shadow-inner">
                     <FileText className="w-10 h-10 opacity-40 text-indigo-400" />
                  </div>
                  <p className="font-medium text-sm leading-relaxed">No past claims mapped for this user.<br/>Initiate a simulation environment to begin.</p>
                </div>
              ) : (
                claims.map(claim => (
                  <div key={claim._id} className="bg-slate-800/40 backdrop-blur-md rounded-2xl p-5 border border-slate-700/50 flex flex-col hover:border-slate-500 hover:bg-slate-800/60 transition-all hover:-translate-y-1 hover:shadow-[0_10px_30px_rgba(0,0,0,0.4)] group relative overflow-hidden">
                    <div className="absolute top-0 right-0 px-4 py-1 text-[9px] font-black uppercase tracking-widest bg-slate-900 border-b border-l border-slate-700/50 text-slate-400 rounded-bl-xl shadow-sm">
                       {claim.city}
                    </div>

                    <div className="flex justify-between items-start mb-4 pt-2">
                      <div className="font-black text-white text-lg flex items-center gap-2 drop-shadow-sm">
                        {claim.triggerEvent} 
                        {claim.fraudChecks?.gpsVerified && <MapPin className="w-4 h-4 text-blue-400 inline drop-shadow-[0_0_8px_rgba(96,165,250,0.5)]"/>}
                      </div>
                    </div>
                    
                    <div className="text-xs text-slate-400 mb-5 bg-slate-900/60 p-4 rounded-xl border border-slate-700/50 shadow-inner relative overflow-hidden">
                      <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-indigo-500 to-purple-500 opacity-80"></div>
                      <span className="font-black text-indigo-300 block mb-2 uppercase tracking-widest text-[9px]">Decision Matrix Log:</span>
                      {claim.status === 'Approved' 
                        ? <span className="leading-relaxed"><span className="text-white font-medium">{claim.eventDetails?.severity}</span> logged by data oracles. Gig drops hit threshold of {claim.eventDetails?.deliveryDrop || '45%'}. Multi-layered AI Telemetry validation passed completely.</span>
                        : <span className="text-red-400 font-bold leading-relaxed">{claim.rejectionReason}</span>}
                    </div>

                    <div className="flex justify-between items-end mt-auto pt-2 border-t border-slate-700/30">
                      <div className="text-slate-500 text-[10px] sm:text-xs font-mono font-medium">
                        {new Date(claim.createdAt).toLocaleString(undefined, {dateStyle: 'medium', timeStyle: 'short'})}
                        <div className="mt-2 text-xs flex gap-2 items-center">
                           <span className={`px-2 py-1 rounded-md text-[9px] font-black uppercase tracking-widest border ${claim.status === 'Approved' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' : 'bg-red-500/10 text-red-400 border-red-500/30'}`}>
                              {claim.status === 'Approved' ? 'Paid' : 'Blocked'}
                           </span>
                        </div>
                      </div>
                      <div className="text-right">
                         <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-1">Total Payout</div>
                         <span className={`text-3xl font-black tracking-tight ${claim.status === 'Approved' ? 'text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400 drop-shadow-sm' : 'text-slate-600 line-through'}`}>
                           ₹{claim.payoutAmount}
                         </span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Reusable micro-components to clean up code
function UsageBar({ title, current, max, percent, color, icon, prefix = "" }) {
  return (
    <div>
       <div className="flex justify-between text-xs font-bold w-full mb-2.5">
         <span className="text-slate-300 flex items-center gap-1.5 uppercase tracking-wider">{icon} {title}</span>
         <span className="text-white text-sm bg-slate-800/50 px-2 py-0.5 rounded border border-slate-700/50 shadow-inner">{prefix}{current} / {prefix}{max}</span>
       </div>
       <div className="h-2.5 w-full bg-slate-900 rounded-full overflow-hidden border border-slate-700/50 shadow-inner">
          <div className={`h-full bg-gradient-to-r ${color} rounded-full transition-all duration-1000 relative shadow-[inset_0_-2px_4px_rgba(0,0,0,0.3)]`} style={{width: `${percent}%`}}>
             {percent > 0 && <div className="absolute top-0 right-0 bottom-0 left-0 bg-[linear-gradient(45deg,rgba(255,255,255,0.15)_25%,transparent_25%,transparent_50%,rgba(255,255,255,0.15)_50%,rgba(255,255,255,0.15)_75%,transparent_75%,transparent)] bg-[length:1rem_1rem] animate-[progress_1s_linear_infinite]"></div>}
          </div>
       </div>
    </div>
  );
}

function ValidationResultRow({ label, status, valPass, valFail, highlightFail }) {
  const isPass = status !== false;
  return (
    <div className={`flex items-center justify-between p-3 rounded-xl border transition-colors shadow-sm ${!isPass && highlightFail ? 'bg-red-500/10 border-red-500/30 shadow-[inset_0_2px_10px_rgba(239,68,68,0.1)]' : 'bg-slate-900/40 border-slate-700/50 hover:bg-slate-900/60'}`}>
       <span className="flex items-center gap-3 text-slate-300 text-xs font-bold">
          {isPass ? <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 drop-shadow-sm" /> : <XCircle className="w-5 h-5 text-red-500 shrink-0 animate-pulse drop-shadow-[0_0_5px_rgba(239,68,68,0.6)]" />} 
          {label}
       </span>
       <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-md border ${isPass ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-red-500/20 text-red-400 border-red-500/30 shadow-[0_0_10px_rgba(239,68,68,0.3)]'}`}>
          {isPass ? valPass : valFail}
       </span>
    </div>
  );
}

function ValidationToggle({ label, state, setter, icon: Icon, color, desc }) {
  const colorMap = {
     emerald: 'from-emerald-400 to-emerald-500 shadow-emerald-500/50',
     blue: 'from-blue-400 to-blue-500 shadow-blue-500/50',
     purple: 'from-purple-400 to-purple-500 shadow-purple-500/50',
  };
  const bgClass = colorMap[color];

  return (
    <label className="flex flex-col gap-2.5 p-4 rounded-2xl bg-slate-900/80 border border-slate-700/50 cursor-pointer group hover:border-slate-500 hover:bg-slate-800 transition-all hover:shadow-xl relative overflow-hidden">
      <div className="absolute top-0 right-0 w-16 h-16 bg-white/5 rounded-full blur-xl group-hover:bg-white/10 transition-colors"></div>
      <div className="flex items-center justify-between relative z-10">
        <span className="text-slate-300 text-sm font-black group-hover:text-white transition-colors flex items-center gap-2">
           <div className={`p-1.5 rounded-lg bg-slate-800 shadow-inner group-hover:scale-110 transition-transform`}><Icon className={`w-4 h-4 text-${color}-400 drop-shadow-md`}/></div>
           {label}
        </span>
        <div className={`w-12 h-6 rounded-full relative transition-colors shadow-[inset_0_2px_4px_rgba(0,0,0,0.4)] ${state ? `bg-gradient-to-r ${colorMap[color].split(' ')[0]} ${colorMap[color].split(' ')[1]}` : 'bg-slate-800 border border-slate-700'}`}>
           <input type="checkbox" className="sr-only" checked={state} onChange={e => setter(e.target.checked)} />
           <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full transition-transform shadow-md ${state ? 'left-0.5 translate-x-6' : 'left-0.5 translate-x-0 bg-slate-400'}`}></div>
        </div>
      </div>
      <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-tight relative z-10">{desc}</span>
    </label>
  );
}

function StatCard({ title, value, icon: Icon, color, className = "" }) {
  return (
    <div className={`bg-slate-900/80 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-5 shadow-xl relative overflow-hidden group hover:border-slate-600 transition-all hover:-translate-y-1 hover:shadow-2xl flex flex-col justify-center min-h-[130px] ${className}`}>
      <div className={`absolute -right-6 -top-6 w-32 h-32 bg-gradient-to-br from-slate-700/50 to-transparent rounded-full opacity-30 group-hover:scale-125 transition-transform duration-500`}></div>
      <div className="flex flex-col gap-4 relative z-10 w-full h-full">
        <div className={`w-11 h-11 sm:w-12 sm:h-12 flex items-center justify-center rounded-2xl bg-slate-800/80 ${color} shadow-[inset_0_2px_10px_rgba(0,0,0,0.4)] border border-slate-700/50 shrink-0 group-hover:scale-110 group-hover:rotate-6 transition-all`}>
          <Icon className="w-5 h-5 sm:w-6 sm:h-6 drop-shadow-md" />
        </div>
        <div className="mt-auto">
          <div className="text-[10px] sm:text-[11px] text-slate-400 font-black uppercase tracking-widest leading-none mb-2">{title}</div>
          <div className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-none truncate drop-shadow-sm">{value}</div>
        </div>
      </div>
    </div>
  );
}

function TriggerButton({ icon: Icon, label, desc, onClick, disabled, color }) {
  return (
    <button 
      onClick={onClick}
      disabled={disabled}
      className="w-full text-left bg-slate-900/80 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-5 sm:p-6 hover:border-slate-500 transition-all group disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-[0_15px_30px_rgba(0,0,0,0.4)] hover:-translate-y-1 focus:ring-2 focus:ring-indigo-500 outline-none flex items-center gap-4 sm:block sm:gap-0 relative overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
      <div className={`w-12 h-12 sm:w-16 sm:h-16 shrink-0 flex items-center justify-center rounded-2xl sm:mb-5 ${color} text-white shadow-lg group-hover:scale-110 group-hover:-rotate-3 transition-all duration-300 relative z-10 border border-white/10`}>
        <div className="absolute inset-0 bg-white/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity blur-md"></div>
        <Icon className="w-6 h-6 sm:w-8 sm:h-8 drop-shadow-md relative z-10" />
      </div>
      <div className="overflow-hidden relative z-10">
        <div className="font-black text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-slate-300 transition-all text-base sm:text-lg leading-tight truncate tracking-wide">{label}</div>
        <div className="text-[10px] sm:text-xs text-slate-400 mt-1.5 line-clamp-2 leading-tight font-bold uppercase tracking-wider">{desc}</div>
      </div>
    </button>
  );
}
