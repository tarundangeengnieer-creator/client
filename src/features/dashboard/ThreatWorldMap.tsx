import React, { useState, useMemo } from 'react';
import { GeospatialMap, MapNode } from '../../components/ui/GeospatialMap.tsx';

interface Hotspot {
  id: string;
  country: string;
  city: string;
  ip: string;
  lng: number;
  lat: number;
  threats: number;
  risk: 'CRITICAL' | 'HIGH' | 'MEDIUM';
}

const ATTACK_HOTSPOTS: Hotspot[] = [
  { id: 'us-east', country: 'United States', city: 'Ashburn, VA', ip: '198.51.100.24', lng: -77.4874, lat: 39.0438, threats: 12, risk: 'CRITICAL' },
  { id: 'us-west', country: 'United States', city: 'San Jose, CA', ip: '192.0.2.78', lng: -121.8863, lat: 37.3382, threats: 4, risk: 'HIGH' },
  { id: 'de-fra', country: 'Germany', city: 'Frankfurt', ip: '185.220.101.5', lng: 8.6821, lat: 50.1109, threats: 4, risk: 'HIGH' },
  { id: 'ru-mow', country: 'Russia', city: 'Moscow', ip: '194.26.29.112', lng: 37.6173, lat: 55.7558, threats: 7, risk: 'CRITICAL' },
  { id: 'in-mum', country: 'India', city: 'Mumbai', ip: '103.14.26.89', lng: 72.8777, lat: 19.0760, threats: 5, risk: 'HIGH' },
  { id: 'cn-sha', country: 'China', city: 'Shanghai', ip: '222.186.42.15', lng: 121.4737, lat: 31.2304, threats: 6, risk: 'CRITICAL' },
  { id: 'br-sao', country: 'Brazil', city: 'São Paulo', ip: '177.54.144.2', lng: -46.6333, lat: -23.5505, threats: 3, risk: 'MEDIUM' },
  { id: 'nl-ams', country: 'Netherlands', city: 'Amsterdam', ip: '45.154.255.8', lng: 4.9041, lat: 52.3676, threats: 5, risk: 'HIGH' },
];

export const ThreatWorldMap: React.FC = () => {
  const [hoveredHotspot, setHoveredHotspot] = useState<Hotspot | null>(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });

  const mapNodes = useMemo(() => {
    return ATTACK_HOTSPOTS.map((spot) => {
      const isCritical = spot.risk === 'CRITICAL';
      const el = document.createElement('div');
      el.className = "relative flex items-center justify-center cursor-pointer";
      el.style.width = '24px';
      el.style.height = '24px';

      const pingRing = document.createElement('div');
      pingRing.className = `absolute inset-0 rounded-full animate-ping ${isCritical ? 'bg-rose-500/45' : 'bg-orange-500/22'}`;
      pingRing.style.animationDuration = isCritical ? '2s' : '3s';

      const halo = document.createElement('div');
      halo.className = `absolute rounded-full w-4 h-4 opacity-20 ${isCritical ? 'bg-red-500' : 'bg-orange-500'} transition-all duration-200`;

      const core = document.createElement('div');
      core.className = `absolute rounded-full border-[1.5px] border-white w-1.5 h-1.5 ${isCritical ? 'bg-red-600' : 'bg-orange-600'} transition-all duration-200`;

      el.appendChild(pingRing);
      el.appendChild(halo);
      el.appendChild(core);

      el.onmouseenter = (e) => {
        halo.classList.remove('w-4', 'h-4', 'opacity-20');
        halo.classList.add('w-6', 'h-6', 'opacity-35');
        core.classList.remove('w-1.5', 'h-1.5');
        core.classList.add('w-2.5', 'h-2.5');
        setHoveredHotspot(spot);
        
        // Approximate container element
        const container = el.closest('.map-container');
        if (container) {
          const rect = container.getBoundingClientRect();
          setTooltipPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
        }
      };
      
      el.onmousemove = (e) => {
        const container = el.closest('.map-container');
        if (container) {
          const rect = container.getBoundingClientRect();
          setTooltipPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
        }
      };

      el.onmouseleave = () => {
        halo.classList.add('w-4', 'h-4', 'opacity-20');
        halo.classList.remove('w-6', 'h-6', 'opacity-35');
        core.classList.add('w-1.5', 'h-1.5');
        core.classList.remove('w-2.5', 'h-2.5');
        setHoveredHotspot(null);
      };

      return {
        id: spot.id,
        lng: spot.lng,
        lat: spot.lat,
        element: el,
      } as MapNode;
    });
  }, []);

  return (
    <div className="relative w-full rounded-xl overflow-hidden bg-[#070c18] border border-slate-200/80 dark:border-slate-800/80 shadow-inner transition-colors map-container">
      {/* Subtle Coordinate Grid Lines */}
      <div className="absolute inset-0 pointer-events-none opacity-30 dark:opacity-15 z-10">
        <div className="w-full h-full" style={{
          backgroundImage: 'linear-gradient(to right, #e2e8f0 1px, transparent 1px), linear-gradient(to bottom, #e2e8f0 1px, transparent 1px)',
          backgroundSize: '40px 30px'
        }} />
      </div>

      {/* Geospatial Map */}
      <div className="w-full h-44 sm:h-48 relative z-0">
        <GeospatialMap 
          nodes={mapNodes}
          initialZoom={0.5}
          initialCenter={[10, 20]}
          interactive={true}
          className="w-full h-full"
        />
      </div>

      {/* Floating Tactical Geolocation Popover Tooltip */}
      {hoveredHotspot && (
        <div
          className="absolute z-20 pointer-events-none px-2.5 py-2 rounded-lg bg-slate-950/95 text-white border border-slate-800 shadow-xl backdrop-blur-sm text-[11px] font-sans flex flex-col gap-1 transition-all duration-75"
          style={{
            left: `${Math.max(10, Math.min(tooltipPos.x, 300))}px`,
            top: `${Math.max(10, tooltipPos.y - 15)}px`,
            transform: 'translate(-50%, -100%)',
          }}
        >
          <div className="flex items-center justify-between gap-3">
            <span className="font-bold text-slate-100">{hoveredHotspot.city}</span>
            <span
              className={`px-1.5 py-0.2 rounded text-[9px] font-mono font-bold ${
                hoveredHotspot.risk === 'CRITICAL'
                  ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                  : 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
              }`}
            >
              {hoveredHotspot.risk}
            </span>
          </div>
          <div className="flex items-center justify-between gap-3 font-mono text-[10px] text-slate-400 border-t border-slate-800/80 pt-1">
            <span>IP: {hoveredHotspot.ip}</span>
            <span className="text-rose-400 font-bold">{hoveredHotspot.threats} attacks</span>
          </div>
        </div>
      )}

      {/* Bottom Map Status Bar */}
      <div className="px-3 py-1.5 bg-slate-100/70 dark:bg-[#090e1a] border-t border-slate-200/70 dark:border-slate-800/70 flex items-center justify-between text-[10px] text-slate-500 dark:text-slate-400 font-mono relative z-10">
        <div className="flex items-center gap-2">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
          <span>8 LIVE ORIGIN NODES LOCATED</span>
        </div>
        <span className="text-slate-400 dark:text-slate-500">MERCATOR PROJECTION</span>
      </div>
    </div>
  );
};
