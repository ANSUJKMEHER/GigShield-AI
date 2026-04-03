import { CloudRain, Wind, Thermometer, Sun, Cloud, CloudLightning, Droplets } from 'lucide-react';

export default function WeatherWidget({ weatherData, city }) {
  if (!weatherData) {
    return (
      <div className="w-full h-full min-h-[120px] bg-slate-900/60 rounded-3xl border border-slate-700/50 flex items-center justify-center animate-pulse">
         <span className="text-xs text-slate-500 font-bold uppercase tracking-widest">Fetching Radar...</span>
      </div>
    );
  }

  const code = weatherData.weather_code || 0;
  let Icon = Sun;
  let label = "Clear";
  let color = "text-yellow-400";
  let bgGradient = "from-yellow-500/10 to-orange-500/10";

  if (code >= 50 && code < 70) { Icon = CloudRain; label = "Rain"; color = "text-blue-400"; bgGradient = "from-blue-500/20 to-cyan-500/10"; }
  else if (code >= 70 && code < 80) { Icon = Cloud; label = "Snow"; color = "text-white"; bgGradient = "from-slate-400/20 to-slate-200/5"; }
  else if (code >= 80) { Icon = CloudLightning; label = "Storm"; color = "text-purple-400"; bgGradient = "from-purple-500/20 to-indigo-500/10"; }
  else if (code > 0) { Icon = Cloud; label = "Cloudy"; color = "text-slate-400"; bgGradient = "from-slate-500/10 to-slate-400/5"; }

  return (
    <div className={`p-5 rounded-3xl border border-slate-700/50 bg-gradient-to-br ${bgGradient} backdrop-blur-xl shadow-lg relative overflow-hidden group`}>
       <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-[40px] pointer-events-none"></div>
       
       <div className="flex flex-col sm:flex-row sm:items-center justify-between relative z-10 w-full gap-4">
         <div>
            <div className="flex items-center gap-2 mb-1">
               <span className="text-[10px] sm:text-xs font-black uppercase tracking-widest text-slate-400">Live Forecast • {city || 'Zone'}</span>
            </div>
            <div className="flex items-center gap-4 mt-2">
               <Icon className={`w-10 h-10 sm:w-12 sm:h-12 ${color} drop-shadow-md`} />
               <div>
                  <div className={`text-2xl sm:text-3xl font-black ${color} tracking-tight leading-none mb-1`}>{weatherData.temperature || '--'}°C</div>
                  <div className="text-sm font-bold text-white capitalize">{label}</div>
               </div>
            </div>
         </div>
         
         <div className="flex flex-row sm:flex-col items-center sm:items-end gap-2 sm:text-right shrink-0">
            <div className="flex items-center gap-1.5 text-xs text-slate-300 font-medium bg-slate-800/50 px-2 py-1.5 rounded-lg border border-slate-700/50">
               <Droplets className="w-4 h-4 text-blue-400"/> {weatherData.rain || 0}mm Precip
            </div>
            <div className="flex items-center gap-1.5 text-xs text-slate-300 font-medium bg-slate-800/50 px-2 py-1.5 rounded-lg border border-slate-700/50">
               <Wind className="w-4 h-4 text-emerald-400"/> {weatherData.windspeed || '--'} km/h
            </div>
         </div>
       </div>
    </div>
  );
}
