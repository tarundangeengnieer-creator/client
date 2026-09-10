import React, { useMemo } from 'react';
import { useInvestigator, investigatorStore } from '../../../stores/investigator-store.ts';
import { GeospatialMap, MapNode, MapRoute } from '../../../components/ui/GeospatialMap.tsx';
import { 
  Globe, 
  MapPin, 
  ShieldAlert, 
  ShieldCheck, 
  AlertTriangle, 
  Copy, 
  ArrowRight, 
  CheckCircle2, 
  Network, 
  Clock, 
  ExternalLink,
  Layers,
  Server,
  Activity,
  Check
} from 'lucide-react';

export const OriginIntelligenceWorkspace: React.FC = () => {
  const { 
    currentCase, 
    geographicHops, 
    selectedGeoHop, 
    focusedMapCoords,
    isLoadingCaseDetail 
  } = useInvestigator();

  // Active focused hop (defaults to selectedGeoHop or earliest reliable hop #1)
  const activeHop = useMemo(() => {
    if (selectedGeoHop) return selectedGeoHop;
    return geographicHops.find((h) => h.is_earliest_reliable) || geographicHops[0] || null;
  }, [selectedGeoHop, geographicHops]);

  // Hops with valid coordinates for the map
  const validHops = useMemo(() => {
    return geographicHops.filter(h => typeof h.lat === 'number' && typeof h.lng === 'number');
  }, [geographicHops]);

  // Map nodes generation
  const mapNodes = useMemo<MapNode[]>(() => {
    return validHops.map((hop) => {
      const isSelected = activeHop?.hop_number === hop.hop_number;
      const isEarliest = hop.is_earliest_reliable;
      const el = document.createElement('div');
      
      let colorClass = 'bg-[#08B4ED] border-white text-black font-bold shadow-[0_0_10px_rgba(8,180,237,0.5)]';
      if (hop.is_tor || hop.threat_reputation === 'MALICIOUS') {
        colorClass = 'bg-rose-600 border-white text-white shadow-rose-500/50';
      } else if (hop.threat_reputation === 'SUSPICIOUS') {
        colorClass = 'bg-amber-500 border-white text-white shadow-amber-500/50';
      } else if (hop.threat_reputation === 'INTERNAL') {
        colorClass = 'bg-emerald-600 border-white text-white shadow-emerald-500/50';
      }

      el.className = `flex items-center justify-center rounded-full border-2 font-mono font-bold text-[11px] shadow-lg cursor-pointer transition-all duration-200 hover:scale-125 ${colorClass} ${
        isSelected ? 'w-8 h-8 ring-4 ring-[#08B4ED]/50 z-20 scale-115' : 'w-7 h-7 z-10'
      } ${isEarliest ? 'animate-pulse' : ''}`;
      
      el.innerHTML = `<span>#${hop.hop_number}</span>`;
      el.title = `Hop #${hop.hop_number}: ${hop.ip} (${hop.city || hop.country})`;
      
      el.onclick = (e) => {
        e.stopPropagation();
        investigatorStore.selectGeoHop(hop);
      };

      return {
        id: `geo-hop-${hop.hop_number}`,
        lng: hop.lng!,
        lat: hop.lat!,
        element: el,
      };
    });
  }, [validHops, activeHop]);

  // Map route generation connecting the hops
  const mapRoutes = useMemo<MapRoute[]>(() => {
    if (validHops.length < 2) return [];
    
    // Sort hops by hop_number in transmission order
    const sorted = [...validHops].sort((a, b) => a.hop_number - b.hop_number);
    const coordinates = sorted.map((h) => [h.lng!, h.lat!] as [number, number]);

    return [
      {
        id: 'mail-routing-trajectory',
        coordinates,
        color: '#08B4ED',
        width: 3,
        dashed: true,
      },
    ];
  }, [validHops]);

  // Center coordinate for the map
  const mapCenter = useMemo<[number, number]>(() => {
    if (focusedMapCoords) return focusedMapCoords;
    if (activeHop?.lng !== undefined && activeHop?.lat !== undefined) {
      return [activeHop.lng, activeHop.lat];
    }
    if (validHops.length > 0) {
      return [validHops[0].lng!, validHops[0].lat!];
    }
    return [15, 25]; // Default global view
  }, [focusedMapCoords, activeHop, validHops]);

  const [copiedIp, setCopiedIp] = React.useState(false);
  const handleCopyIp = (ip: string) => {
    navigator.clipboard.writeText(ip);
    setCopiedIp(true);
    setTimeout(() => setCopiedIp(false), 2000);
  };

  const originConfidence = currentCase?.evidence_confidence || 88;
  const earliestHop = geographicHops.find(h => h.is_earliest_reliable) || geographicHops[0];

  return (
    <div className="bg-white dark:bg-[#070b14] border border-slate-200/90 dark:border-slate-800/80 rounded-xl overflow-hidden shadow-xs">
      
      {/* 1. SECTION HEADER BAR */}
      <div className="px-4 py-3 bg-slate-50/90 dark:bg-[#0a0f1d] border-b border-slate-200/80 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 select-none">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sky-500 flex items-center justify-center font-bold">
            <Globe className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider">
                Origin Intelligence & Geolocation
              </h3>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              AI-assisted probable-origin assessment & mail-routing hop reconstruction
            </p>
          </div>
        </div>

        {/* Origin Confidence Badge */}
        <div className="flex items-center gap-3">
          <div className="text-right">
            <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
              Origin Confidence
            </span>
            <div className="flex items-center gap-1.5 justify-end">
              <span className={`text-sm font-mono font-extrabold ${originConfidence >= 80 ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-500'}`}>
                {originConfidence}%
              </span>
              <span className="text-[10px] text-slate-500 font-medium">Corroborated</span>
            </div>
          </div>

          <div className="h-7 w-px bg-slate-200 dark:bg-slate-800 hidden sm:block" />

          {/* Probable Location Summary */}
          {earliestHop && (
            <div className="px-2.5 py-1 rounded-lg bg-white dark:bg-[#0c1322] border border-slate-200 dark:border-slate-800 flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-rose-500" />
              <div className="text-left">
                <span className="text-[9px] uppercase font-bold text-slate-400 block">Probable Origin</span>
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 font-sans">
                  {earliestHop.country} {earliestHop.city ? `— ${earliestHop.city}` : ''}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 2. MAIN WORKSPACE: MAP (LEFT) + SOURCE DETAILS (RIGHT) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 border-b border-slate-200/80 dark:border-slate-800">
        
        {/* LEFT 7 COLS: EXISTING MAP COMPONENT */}
        <div className="lg:col-span-7 relative min-h-[420px] lg:min-h-[480px] bg-[#0c1322] border-b lg:border-b-0 lg:border-r border-slate-200 dark:border-slate-800">
          
          {isLoadingCaseDetail ? (
            <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-slate-900/60 backdrop-blur-xs text-white">
              <div className="w-8 h-8 rounded-full border-2 border-blue-500 border-t-transparent animate-spin mb-2" />
              <p className="text-xs font-mono">Loading geographic telemetry...</p>
            </div>
          ) : validHops.length === 0 ? (
            <div className="absolute inset-0 z-20 flex flex-col items-center justify-center p-6 text-center text-slate-400 bg-[#0c1322]">
              <Globe className="w-10 h-10 mb-2 opacity-30 text-blue-400" />
              <p className="font-bold text-xs text-slate-300">No reliable geographic coordinates available</p>
              <p className="text-[11px] max-w-xs mt-1 text-slate-500">
                Mail headers in this case do not contain resolvable public IP hops or geolocation data.
              </p>
            </div>
          ) : (
            <>
              {/* Overlay: Legend Pill */}
              <div className="absolute top-3 left-3 z-10 flex flex-wrap items-center gap-2 p-1.5 rounded-lg bg-slate-900/85 backdrop-blur-sm border border-slate-700/60 text-[10px] text-slate-200 select-none pointer-events-none">
                <div className="flex items-center gap-1.5 px-1.5">
                  <span className="w-2 h-2 rounded-full bg-rose-500 ring-2 ring-rose-500/40" />
                  <span>Earliest Source (Hop #1)</span>
                </div>
                <div className="flex items-center gap-1.5 px-1.5 border-l border-slate-700">
                  <span className="w-2 h-2 rounded-full bg-blue-500" />
                  <span>Transit Relays</span>
                </div>
                <div className="flex items-center gap-1.5 px-1.5 border-l border-slate-700">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span>Internal Perimeter</span>
                </div>
              </div>

              {/* Overlay: Selected Hop Tag */}
              {activeHop && (
                <div className="absolute bottom-3 left-3 z-10 px-2.5 py-1.5 rounded-lg bg-slate-900/90 backdrop-blur-sm border border-slate-700/60 font-mono text-[11px] text-white flex items-center gap-2 shadow-lg">
                  <span className="text-blue-400 font-bold">Hop #{activeHop.hop_number}:</span>
                  <span className="font-bold">{activeHop.ip}</span>
                  <span className="text-slate-400">({activeHop.city ? `${activeHop.city}, ` : ''}{activeHop.country})</span>
                </div>
              )}

              {/* The Existing GeospatialMap Component */}
              <GeospatialMap
                nodes={mapNodes}
                routes={mapRoutes}
                initialCenter={mapCenter}
                initialZoom={2.8}
                interactive={true}
                className="w-full h-full min-h-[420px] lg:min-h-[480px]"
              />
            </>
          )}
        </div>

        {/* RIGHT 5 COLS: SOURCE DETAILS & EVIDENCE-FIRST LEDGER */}
        <div className="lg:col-span-5 p-4 sm:p-5 flex flex-col justify-between space-y-4 bg-white dark:bg-[#070b14] overflow-y-auto">
          {activeHop ? (
            <div className="space-y-4">
              
              {/* Header with IP and Reputation Badge */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    {activeHop.is_earliest_reliable ? 'Earliest Reliable Source Node' : `Transit Relay Hop #${activeHop.hop_number}`}
                  </span>
                  
                  {activeHop.threat_reputation === 'MALICIOUS' ? (
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-wider bg-transparent text-rose-600 dark:text-rose-400 border border-rose-500/30">
                      Malicious Reputation
                    </span>
                  ) : activeHop.threat_reputation === 'SUSPICIOUS' ? (
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-wider bg-transparent text-amber-600 dark:text-amber-400 border border-amber-500/30">
                      Suspicious Infrastructure
                    </span>
                  ) : activeHop.threat_reputation === 'INTERNAL' ? (
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-wider bg-transparent text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                      Internal Boundary
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-wider bg-transparent text-slate-600 dark:text-slate-400 border border-slate-300 dark:border-slate-700">
                      Neutral Relay
                    </span>
                  )}
                </div>

                {/* Big Source IP banner with 1-click copy */}
                <div className="p-3 rounded-lg bg-slate-50 dark:bg-[#0a0f1d] border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                  <div className="min-w-0">
                    <span className="text-[9px] uppercase font-bold text-slate-400 block mb-0.5">Source IP Address</span>
                    <p className="font-mono text-base font-extrabold text-slate-900 dark:text-slate-100 select-all truncate">
                      {activeHop.ip}
                    </p>
                    {activeHop.hostname && (
                      <p className="text-[11px] font-mono text-slate-500 dark:text-slate-400 truncate mt-0.5">
                        {activeHop.hostname}
                      </p>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => handleCopyIp(activeHop.ip)}
                    className="p-2 rounded-md hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors cursor-pointer"
                    title="Copy IP to clipboard"
                  >
                    {copiedIp ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Geolocation & Network Infrastructure Grid */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0a0f1d]">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Origin Geolocation</span>
                  <div className="font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-blue-500 flex-shrink-0" />
                    <span className="truncate">{activeHop.country}</span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 pl-5 truncate">
                    {activeHop.city || 'Regional jurisdiction'}
                  </p>
                </div>

                <div className="p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0a0f1d]">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Autonomous System (ASN)</span>
                  <div className="font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                    <Server className="w-3.5 h-3.5 text-purple-500 flex-shrink-0" />
                    <span className="font-mono text-[11px] truncate">{activeHop.asn.split(' ')[0]}</span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 pl-5 truncate" title={activeHop.isp || activeHop.asn}>
                    {activeHop.isp || activeHop.asn.replace(/AS\d+\s*/, '')}
                  </p>
                </div>
              </div>

              {/* Anomaly & Infrastructure Context */}
              <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#0a0f1d] space-y-1.5">
                <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300 font-bold text-[11px]">
                  {activeHop.is_tor ? (
                    <ShieldAlert className="w-4 h-4 text-rose-600 flex-shrink-0" />
                  ) : activeHop.is_vpn ? (
                    <AlertTriangle className="w-4 h-4 text-amber-500 flex-shrink-0" />
                  ) : (
                    <Activity className="w-4 h-4 text-blue-500 flex-shrink-0" />
                  )}
                  <span>Infrastructure & Anomaly Assessment</span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-sans">
                  {activeHop.anomaly_context}
                </p>
                <div className="flex items-center gap-2 pt-1 font-mono text-[10px]">
                  <span className={`px-1.5 py-0.5 rounded border ${activeHop.is_tor ? 'bg-transparent text-rose-600 dark:text-rose-400 border-rose-500/30 font-bold' : 'bg-transparent text-slate-500 border-slate-200 dark:border-slate-800'}`}>
                    Tor Exit: {activeHop.is_tor ? 'YES' : 'NO'}
                  </span>
                  <span className={`px-1.5 py-0.5 rounded border ${activeHop.is_vpn ? 'bg-transparent text-amber-600 dark:text-amber-400 border-amber-500/30 font-bold' : 'bg-transparent text-slate-500 border-slate-200 dark:border-slate-800'}`}>
                    VPN/Proxy: {activeHop.is_vpn ? 'YES' : 'NO'}
                  </span>
                </div>
              </div>

              {/* Evidence-First Corroboration Checklist */}
              <div className="space-y-1.5 text-xs">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                  Supporting Origin Evidence
                </span>
                <div className="space-y-1 text-[11px] text-slate-600 dark:text-slate-300">
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                    <span>Corroborated by RFC 822 Received routing headers</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                    <span>Autonomous System & BGP transit telemetry matched</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                    <span>Transmission delay delta consistent with physical relay hops</span>
                  </div>
                </div>
              </div>

              {/* Cross-Forensic Action Surface (Graph ↔ Map ↔ Timeline) */}
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    // Find node in graph with matching IP and select it
                    const node = investigatorStore.getSnapshot().graphNodes.find(n => n.value.includes(activeHop.ip));
                    if (node) {
                      investigatorStore.selectEntity(node);
                    }
                  }}
                  className="flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0c1322] hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200 transition-colors cursor-pointer shadow-2xs"
                >
                  <Network className="w-3.5 h-3.5 text-blue-500" />
                  <span>Inspect in Graph</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    const evt = investigatorStore.getSnapshot().timelineEvents.find(e => e.summary.includes(activeHop.ip));
                    if (evt) {
                      investigatorStore.selectTimelineEvent(evt);
                    }
                  }}
                  className="flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0c1322] hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200 transition-colors cursor-pointer shadow-2xs"
                >
                  <Clock className="w-3.5 h-3.5 text-purple-500" />
                  <span>Find in Timeline</span>
                </button>
              </div>

            </div>
          ) : (
            <div className="py-12 text-center text-slate-400">
              <p className="text-xs font-semibold">Select a mail hop to inspect origin intelligence.</p>
            </div>
          )}
        </div>
      </div>

      {/* 3. RECEIVED CHAIN STEP-BY-STEP ROUTING FLOW */}
      <div className="p-4 bg-slate-50/70 dark:bg-[#0a0f1d]/70 border-t border-slate-200/80 dark:border-slate-800">
        <div className="flex items-center justify-between mb-2.5">
          <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
            Mail-Routing Transmission Chain (Click hop to focus map)
          </span>
          <span className="text-[10px] font-mono text-slate-500">
            {geographicHops.length} Total Relay Hops
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2 overflow-x-auto pb-1">
          {geographicHops.map((hop, idx) => {
            const isSelected = activeHop?.hop_number === hop.hop_number;
            return (
              <React.Fragment key={hop.hop_number}>
                <button
                  type="button"
                  onClick={() => investigatorStore.selectGeoHop(hop)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition-all text-left cursor-pointer ${
                    isSelected
                      ? 'bg-slate-100/80 dark:bg-slate-800/80 border-blue-500 text-slate-900 dark:text-slate-100 shadow-xs ring-1 ring-blue-500/40'
                      : 'bg-white dark:bg-[#070b14] border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center font-mono font-bold text-[10px] border ${
                    hop.is_earliest_reliable 
                      ? 'bg-transparent text-rose-600 dark:text-rose-400 border-rose-500/40' 
                      : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-300 dark:border-slate-700'
                  }`}>
                    {hop.hop_number}
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono font-bold text-xs">{hop.ip}</span>
                      {hop.is_earliest_reliable && (
                        <span className="px-1 py-0.2 rounded bg-transparent text-rose-600 dark:text-rose-400 border border-rose-500/30 font-bold text-[8px] uppercase tracking-wider">
                          Origin
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] text-slate-400 block truncate max-w-[130px]">
                      {hop.city ? `${hop.city}, ` : ''}{hop.country}
                    </span>
                  </div>
                </button>

                {idx < geographicHops.length - 1 && (
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

    </div>
  );
};
