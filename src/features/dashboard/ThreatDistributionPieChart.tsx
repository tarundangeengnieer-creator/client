import React, { useState, useMemo } from 'react';
import { Shield, AlertTriangle, PieChart as PieChartIcon, Disc } from 'lucide-react';

export interface ThreatCategoryData {
  count: number;
  pct: number;
}

export interface ActiveThreatsData {
  malicious: ThreatCategoryData;
  suspicious: ThreatCategoryData;
  benign: ThreatCategoryData;
  inconclusive: ThreatCategoryData;
  posture: string;
  postureColor: string;
  postureBg: string;
  postureBorder: string;
  note: string;
}

interface ThreatDistributionPieChartProps {
  threatPeriod: '24h' | '7d' | '30d' | '90d' | 'custom';
  activeThreats: ActiveThreatsData;
}

interface SliceItem {
  id: 'malicious' | 'suspicious' | 'benign' | 'inconclusive';
  label: string;
  count: number;
  pct: number;
  color: string;
  hoverColor: string;
  badgeBg: string;
  badgeText: string;
}

export const ThreatDistributionPieChart: React.FC<ThreatDistributionPieChartProps> = ({
  threatPeriod,
  activeThreats,
}) => {
  const [hoveredSlice, setHoveredSlice] = useState<SliceItem['id'] | null>(null);
  const [chartType, setChartType] = useState<'donut' | 'pie'>('donut');

  const slices: SliceItem[] = useMemo(() => [
    {
      id: 'malicious',
      label: 'Malicious',
      count: activeThreats.malicious.count,
      pct: activeThreats.malicious.pct,
      color: '#FF365C',
      hoverColor: '#E0264A',
      badgeBg: 'bg-transparent border border-rose-500/30',
      badgeText: 'text-rose-700 dark:text-rose-400',
    },
    {
      id: 'suspicious',
      label: 'Suspicious',
      count: activeThreats.suspicious.count,
      pct: activeThreats.suspicious.pct,
      color: '#FFB800',
      hoverColor: '#E5A500',
      badgeBg: 'bg-transparent border border-amber-500/30',
      badgeText: 'text-amber-700 dark:text-amber-400',
    },
    {
      id: 'benign',
      label: 'Benign',
      count: activeThreats.benign.count,
      pct: activeThreats.benign.pct,
      color: '#10C98A',
      hoverColor: '#0EB078',
      badgeBg: 'bg-transparent border border-emerald-500/30',
      badgeText: 'text-emerald-700 dark:text-emerald-400',
    },
    {
      id: 'inconclusive',
      label: 'Inconclusive',
      count: activeThreats.inconclusive.count,
      pct: activeThreats.inconclusive.pct,
      color: '#8EA0B5',
      hoverColor: '#7A8C9F',
      badgeBg: 'bg-transparent border border-slate-500/30',
      badgeText: 'text-slate-600 dark:text-slate-300',
    },
  ], [activeThreats]);

  const totalCount = useMemo(() => {
    return slices.reduce((acc, s) => acc + s.count, 0);
  }, [slices]);

  // Compute SVG arc paths
  const arcPaths = useMemo(() => {
    if (totalCount === 0) return [];

    const cx = 100;
    const cy = 100;
    const baseOuterRadius = 78;
    const innerRadius = chartType === 'donut' ? 48 : 0;
    const padAngle = chartType === 'donut' ? 0.035 : 0.02;

    let currentAngle = -Math.PI / 2;

    return slices.map((slice) => {
      const sliceAngle = (slice.count / totalCount) * 2 * Math.PI;
      const isHovered = hoveredSlice === slice.id;
      const outerR = isHovered ? baseOuterRadius + 4 : baseOuterRadius;
      const innerR = isHovered && chartType === 'donut' ? Math.max(0, innerRadius - 2) : innerRadius;

      const safePad = Math.min(padAngle, sliceAngle * 0.15);
      const startAngle = currentAngle + safePad;
      const endAngle = currentAngle + sliceAngle - safePad;
      currentAngle += sliceAngle;

      const largeArcFlag = endAngle - startAngle > Math.PI ? 1 : 0;

      // Coordinate calculations
      const x1 = cx + outerR * Math.cos(startAngle);
      const y1 = cy + outerR * Math.sin(startAngle);
      const x2 = cx + outerR * Math.cos(endAngle);
      const y2 = cy + outerR * Math.sin(endAngle);

      let d = '';
      if (chartType === 'donut' && innerR > 0) {
        const x3 = cx + innerR * Math.cos(endAngle);
        const y3 = cy + innerR * Math.sin(endAngle);
        const x4 = cx + innerR * Math.cos(startAngle);
        const y4 = cy + innerR * Math.sin(startAngle);

        d = `M ${x1} ${y1} A ${outerR} ${outerR} 0 ${largeArcFlag} 1 ${x2} ${y2} L ${x3} ${y3} A ${innerR} ${innerR} 0 ${largeArcFlag} 0 ${x4} ${y4} Z`;
      } else {
        d = `M ${cx} ${cy} L ${x1} ${y1} A ${outerR} ${outerR} 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;
      }

      return {
        ...slice,
        d,
        isHovered,
      };
    });
  }, [slices, totalCount, chartType, hoveredSlice]);

  const activeFocusItem = useMemo(() => {
    if (!hoveredSlice) return null;
    return slices.find((s) => s.id === hoveredSlice) || null;
  }, [hoveredSlice, slices]);

  return (
    <div
      id="threat-distribution-pie-card"
      className="bg-white dark:bg-[#0c1322] rounded-xl p-5 border border-slate-200/80 dark:border-slate-800/80 shadow-xs flex flex-col justify-between select-none transition-colors"
    >
      <div>
        {/* Header with Title, Chart View Toggle, and Timeframe Selector */}
        <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-100 dark:border-slate-800/80">
          <div className="flex items-center gap-2">
            <span className="p-1 rounded bg-white dark:bg-[#0c1322] border border-transparent text-slate-800 dark:text-white flex items-center justify-center">
              <Shield className="w-4 h-4" />
            </span>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-sm">Threat Distribution</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Verdicts by classification</p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {/* Chart Type Toggle (Donut vs Pie) */}
            <div className="flex items-center bg-slate-100 dark:bg-[#090e1a] p-0.5 rounded-lg border border-slate-200 dark:border-slate-800 text-xs">
              <button
                type="button"
                onClick={() => setChartType('donut')}
                title="Donut Chart View"
                aria-label="Donut Chart View"
                className={`inline-flex items-center gap-1 min-h-[26px] min-w-[26px] px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                  chartType === 'donut'
                    ? 'bg-white dark:bg-slate-800 text-blue-700 dark:text-sky-400 shadow-2xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white'
                }`}
              >
                <Disc className="w-3.5 h-3.5" />
                <span>Donut</span>
              </button>
              <button
                type="button"
                onClick={() => setChartType('pie')}
                title="Pie Chart View"
                aria-label="Pie Chart View"
                className={`inline-flex items-center gap-1 min-h-[26px] min-w-[26px] px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                  chartType === 'pie'
                    ? 'bg-white dark:bg-slate-800 text-blue-700 dark:text-sky-400 shadow-2xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white'
                }`}
              >
                <PieChartIcon className="w-3.5 h-3.5" />
                <span>Pie</span>
              </button>
            </div>
          </div>
        </div>

        {/* Pie / Donut Chart Canvas */}
        <div className="relative flex items-center justify-center my-3">
          <div className="w-52 h-52 relative flex items-center justify-center">
            <svg
              viewBox="0 0 200 200"
              className="w-full h-full overflow-visible transition-all duration-300"
              aria-label="Threat verdict distribution pie chart"
            >
              <defs>
                {slices.map((slice) => (
                  <filter key={`glow-${slice.id}`} id={`glow-${slice.id}`} x="-20%" y="-20%" width="140%" height="140%">
                    <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor={slice.color} floodOpacity="0.25" />
                  </filter>
                ))}
              </defs>

              {/* Background ambient ring */}
              <circle
                cx="100"
                cy="100"
                r={chartType === 'donut' ? '48' : '78'}
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
                className="text-slate-100 dark:text-slate-800/80"
              />

              {/* Pie Slices */}
              <g id="threat-pie-slices">
                {arcPaths.map((slice) => (
                  <path
                    key={slice.id}
                    d={slice.d}
                    fill={slice.isHovered ? slice.hoverColor : slice.color}
                    filter={slice.isHovered ? `url(#glow-${slice.id})` : undefined}
                    className="transition-all duration-200 cursor-pointer outline-none focus:outline-none"
                    onMouseEnter={() => setHoveredSlice(slice.id)}
                    onMouseLeave={() => setHoveredSlice(null)}
                    stroke="currentColor"
                    strokeWidth={slice.isHovered ? '2' : '1'}
                    strokeLinejoin="round"
                    strokeOpacity={0.15}
                  />
                ))}
              </g>
            </svg>

            {/* Donut Center Display */}
            {chartType === 'donut' && (
              <div
                className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none transition-all duration-200"
                style={{ width: '96px', height: '96px', margin: 'auto' }}
              >
                {activeFocusItem ? (
                  <div className="text-center animate-in fade-in zoom-in-95 duration-150">
                    <span
                      className="text-2xl font-black tracking-tight font-mono leading-none block"
                      style={{ color: activeFocusItem.color }}
                    >
                      {activeFocusItem.count}
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-wider block mt-1 text-slate-700 dark:text-slate-300 truncate max-w-[84px]">
                      {activeFocusItem.label}
                    </span>
                    <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 block font-mono">
                      {activeFocusItem.pct}%
                    </span>
                  </div>
                ) : (
                  <div className="text-center">
                    <span className="text-2xl font-black text-slate-900 dark:text-white tracking-tight font-mono leading-none block">
                      {totalCount}
                    </span>
                    <span className="text-[10px] font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider block mt-1">
                      TOTAL CASES
                    </span>
                    <span className="text-[10px] font-semibold text-blue-700 dark:text-sky-400 block">
                      {threatPeriod}
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Breakdown Legend Grid */}
        <div className="grid grid-cols-2 gap-2 mt-2 pt-2 border-t border-slate-100 dark:border-slate-800/60">
          {slices.map((slice) => {
            const isHovered = hoveredSlice === slice.id;
            return (
              <div
                key={slice.id}
                onMouseEnter={() => setHoveredSlice(slice.id)}
                onMouseLeave={() => setHoveredSlice(null)}
                className={`flex items-center justify-between p-2 rounded-lg border transition-all cursor-pointer ${
                  isHovered
                    ? 'border-blue-400/60 dark:border-blue-500/60 bg-blue-50/40 dark:bg-blue-950/20 scale-[1.02]'
                    : 'border-slate-100 dark:border-slate-800/70 bg-slate-50/50 dark:bg-[#090e1a]/60 hover:border-slate-200 dark:hover:border-slate-700'
                }`}
              >
                <div className="flex items-center gap-2 min-w-0">
                  <span
                    className="w-2.5 h-2.5 rounded-full shrink-0 transition-transform duration-200"
                    style={{
                      backgroundColor: slice.color,
                      transform: isHovered ? 'scale(1.3)' : 'scale(1)',
                    }}
                  />
                  <span className="text-xs font-semibold text-slate-700 dark:text-slate-200 truncate">
                    {slice.label}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <span className="text-xs font-bold font-mono text-slate-900 dark:text-white">
                    {slice.count}
                  </span>
                  <span
                    className={`text-[10px] font-semibold px-1.5 py-0.2 rounded font-mono ${slice.badgeBg} ${slice.badgeText}`}
                  >
                    {slice.pct}%
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Dynamic Risk Posture Banner */}
      <div
        className={`mt-4 p-3 rounded-xl border flex items-start gap-2.5 transition-colors duration-200 ${activeThreats.postureBg} ${activeThreats.postureBorder} dark:bg-slate-900/60 dark:border-slate-800`}
      >
        <AlertTriangle className={`w-4 h-4 shrink-0 mt-0.5 ${activeThreats.postureColor}`} />
        <div className="min-w-0">
          <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
            <span>Risk posture:</span>
            <span className={`px-1.5 py-0.2 rounded text-[10px] font-bold ${activeThreats.postureColor}`}>
              {activeThreats.posture}
            </span>
          </div>
          <p className="text-xs text-slate-700 dark:text-slate-300 mt-0.5 leading-snug">
            {activeThreats.note}
          </p>
        </div>
      </div>
    </div>
  );
};
