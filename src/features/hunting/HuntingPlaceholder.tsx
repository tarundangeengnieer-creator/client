import React, { useState, useMemo } from 'react';
import { Card } from '../../components/ui/Card.tsx';
import { Crosshair, Search, MapPin } from 'lucide-react';
import { GeospatialMap, MapNode } from '../../components/ui/GeospatialMap.tsx';

export const HuntingPlaceholder: React.FC = () => {
  const [isPointerMode, setIsPointerMode] = useState(false);
  const [selectedPinColor, setSelectedPinColor] = useState<'red' | 'amber' | 'emerald' | 'blue'>('red');
  const [customPins, setCustomPins] = useState<{ id: string; lng: number; lat: number; color: string }[]>([]);

  const huntingMapNodes = useMemo(() => {
    return customPins.map(pin => {
      const el = document.createElement('div');
      const colorMap = {
        red: 'border-rose-500 bg-rose-500/20 text-rose-500',
        amber: 'border-amber-500 bg-amber-500/20 text-amber-500',
        emerald: 'border-emerald-500 bg-emerald-500/20 text-emerald-500',
        blue: 'border-blue-500 bg-blue-500/20 text-blue-500'
      };
      const colorClasses = colorMap[pin.color as keyof typeof colorMap] || colorMap.red;
      el.className = `flex items-center justify-center w-6 h-6 rounded-full border-[2.5px] ${colorClasses} shadow-[0_0_10px_rgba(0,0,0,0.5)] cursor-pointer hover:scale-110 transition-all backdrop-blur-sm`;
      
      const dot = document.createElement('div');
      dot.className = `w-1.5 h-1.5 rounded-full ${colorClasses.split(' ')[0].replace('border', 'bg')}`;
      el.appendChild(dot);

      return {
        id: pin.id,
        lng: pin.lng,
        lat: pin.lat,
        element: el,
      } as MapNode;
    });
  }, [customPins]);

  return (
    <div className="w-full min-w-0 p-4 sm:p-5 lg:p-6 space-y-5 lg:space-y-6 flex flex-col h-full">
      <div className="pb-4 border-b border-slate-800">
        <h1 className="text-xl font-bold font-mono text-slate-100 flex items-center gap-2.5">
          <Crosshair className="w-5 h-5 text-sky-400" />
          <span>THREAT HUNTING & GEO-INTELLIGENCE</span>
        </h1>
        <p className="text-xs text-slate-400 font-mono mt-1">
          Interactive forensic pointer map for threat planning and cross-campaign geographic correlation.
        </p>
      </div>

      <Card className="border-slate-800 bg-slate-900/60 p-6 flex flex-col gap-4 flex-1">
        <div className="flex items-center gap-3 p-2 rounded bg-slate-950 border border-slate-800">
          <Search className="w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search indicator: e.g. 185.220.101.5 or domain or SHA-256..."
            className="w-full bg-transparent text-xs font-mono text-slate-100 placeholder-slate-400 focus:outline-none"
          />
        </div>

        {/* Geo-Intelligence Toolbar */}
        <div className="flex items-center justify-between border-b border-slate-800/70 pb-3 mt-2">
          <div>
            <h3 className="font-bold text-slate-200 text-sm">Interactive Geo-Intelligence Map</h3>
            <p className="text-xs text-slate-500">Enable pointer mode to drop forensic markers and plan investigations.</p>
          </div>
          <div className="flex items-center gap-2">
            {isPointerMode && (
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-950 rounded-lg border border-slate-800">
                <span className="text-[10px] font-bold text-slate-500 mr-1">COLOR:</span>
                {(['red', 'amber', 'emerald', 'blue'] as const).map(color => (
                  <button
                    key={color}
                    onClick={() => setSelectedPinColor(color)}
                    className={`w-4 h-4 rounded-full border-2 ${selectedPinColor === color ? 'border-slate-300 scale-110' : 'border-transparent opacity-70 hover:opacity-100'} transition-all cursor-pointer`}
                    style={{
                      backgroundColor: color === 'red' ? '#f43f5e' : color === 'amber' ? '#f59e0b' : color === 'emerald' ? '#10b981' : '#3b82f6'
                    }}
                    title={`Drop ${color} pin`}
                  />
                ))}
                <button 
                  onClick={() => setCustomPins([])}
                  className="ml-2 text-[10px] font-bold text-rose-500 hover:underline cursor-pointer"
                >
                  CLEAR
                </button>
              </div>
            )}
            <button
              onClick={() => setIsPointerMode(!isPointerMode)}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg border transition-colors cursor-pointer ${
                isPointerMode 
                  ? 'bg-blue-900/30 border-blue-800 text-blue-400' 
                  : 'bg-[#0c1322] border-slate-700 text-slate-300 hover:bg-slate-900'
              }`}
            >
              <MapPin className="w-3.5 h-3.5" />
              {isPointerMode ? 'Done' : 'Add Forensic Pins'}
            </button>
          </div>
        </div>

        {/* The Map itself */}
        <div className="w-full min-h-[500px] flex-1 rounded-xl overflow-hidden border border-slate-800 relative shadow-inner">
          {isPointerMode && (
            <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 px-4 py-2 bg-slate-950/90 text-white text-xs font-bold rounded-full border border-slate-800 backdrop-blur-sm pointer-events-none shadow-xl flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
              </span>
              Click anywhere on the map to drop a forensic pin
            </div>
          )}
          <GeospatialMap
            nodes={huntingMapNodes}
            initialCenter={[20, 30]}
            initialZoom={1.5}
            interactive={true}
            className={`w-full h-full ${isPointerMode ? 'cursor-crosshair' : ''}`}
            onMapClick={(lngLat) => {
              if (isPointerMode) {
                setCustomPins(prev => [...prev, {
                  id: `hunting-pin-${Date.now()}`,
                  lng: lngLat.lng,
                  lat: lngLat.lat,
                  color: selectedPinColor
                }]);
              }
            }}
          />
        </div>
      </Card>
    </div>
  );
};
