import { useEffect } from 'react';
import { MapContainer, TileLayer, Polyline, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Navigation } from 'lucide-react';

const workerIcon = new L.DivIcon({
  html: `<div class="w-8 h-8 bg-indigo-500 rounded-full flex items-center justify-center shadow-[0_0_15px_rgba(99,102,241,0.8)] border-2 border-white"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="3 11 22 2 13 21 11 13 3 11"></polygon></svg></div>`,
  className: '',
  iconSize: [32, 32],
  iconAnchor: [16, 16]
});

function RecenterAutomatically({ lat, lon }) {
  const map = useMap();
  useEffect(() => {
    map.setView([lat, lon], map.getZoom(), { animate: true });
  }, [lat, lon, map]);
  return null;
}

export default function MapTracker({ history }) {
  if (!history || history.length === 0) {
    return (
      <div className="w-full h-full min-h-[250px] bg-slate-800/50 rounded-2xl border border-slate-700/50 flex items-center justify-center flex-col gap-3 backdrop-blur-sm z-0">
        <Navigation className="w-8 h-8 text-slate-500 animate-pulse" />
        <span className="text-sm font-bold text-slate-400 uppercase tracking-widest">Waiting for GPS lock...</span>
      </div>
    );
  }

  const currentLoc = history[history.length - 1];
  const positions = history.map(h => [h.lat, h.lon]);

  return (
    <div className="w-full h-[300px] rounded-2xl overflow-hidden border border-slate-700/50 shadow-inner relative z-0">
      <MapContainer center={[currentLoc.lat, currentLoc.lon]} zoom={15} scrollWheelZoom={false} style={{ height: '100%', width: '100%', zIndex: 0 }}>
        <TileLayer
          attribution='&copy; <a href="https://carto.com/">CartoDB</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />
        {positions.length > 1 && (
          <Polyline 
            positions={positions} 
            pathOptions={{ color: '#6366f1', weight: 4, dashArray: '8, 8', opacity: 0.8 }} 
          />
        )}
        <Marker position={[currentLoc.lat, currentLoc.lon]} icon={workerIcon}>
          <Popup className="custom-popup bg-slate-900 border-slate-700 text-white rounded-lg">
            <div className="font-bold">You are here</div>
            <div className="text-xs text-slate-400 text-center mt-0.5">Active Network Match</div>
          </Popup>
        </Marker>
        <RecenterAutomatically lat={currentLoc.lat} lon={currentLoc.lon} />
      </MapContainer>
    </div>
  );
}
