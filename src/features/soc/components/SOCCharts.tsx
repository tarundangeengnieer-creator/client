import React, { useState, useRef } from 'react';
import { useSOC, socStore } from '../../../stores/soc-store.ts';
import { Filter, ChevronLeft, ChevronRight } from 'lucide-react';

const CATEGORY_COLORS: Record<string, string> = {
  'Phishing': '#f43f5e', // rose-500
  'Malware': '#f97316', // orange-500
  'Business Email Compromise': '#f59e0b', // amber-500
  'Spam': '#8b5cf6', // violet-500
  'Account Takeover': '#ef4444', // red-500
  'Suspicious Login': '#3b82f6', // blue-500
};
const FALLBACK_COLORS = ['#f43f5e', '#f97316', '#f59e0b', '#8b5cf6', '#ef4444', '#3b82f6', '#10b981', '#06b6d4'];

export const SOCCharts: React.FC = () => {
  const { alertAging, threatTrend, authTrend, filterAgingBucket, filterCategory } = useSOC();
  
  const [currentSlide, setCurrentSlide] = useState(0);
  
  const maxAgingCount = Math.max(...alertAging.map(b => b.count), 1);
  const maxAuthTotal = Math.max(
    ...authTrend.slice(-24).map(pt => pt.spfFails + pt.dkimFails + pt.dmarcFails),
    1
  );
  const firstAuthPt = authTrend[0];

  const nextSlide = () => setCurrentSlide(prev => (prev === 2 ? 0 : prev + 1));
  const prevSlide = () => setCurrentSlide(prev => (prev === 0 ? 2 : prev - 1));

  // Swipe handling
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };
  const handleTouchEnd = () => {
    if (touchStartX.current - touchEndX.current > 50) nextSlide();
    if (touchStartX.current - touchEndX.current < -50) prevSlide();
  };

  const isDragging = useRef(false);
  
  const handleMouseDown = (e: React.MouseEvent) => {
    isDragging.current = true;
    touchStartX.current = e.clientX;
  };
  
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current) return;
    touchEndX.current = e.clientX;
  };
  
  const handleMouseUp = () => {
    if (!isDragging.current) return;
    isDragging.current = false;
    if (touchStartX.current - touchEndX.current > 50) nextSlide();
    if (touchStartX.current - touchEndX.current < -50) prevSlide();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowRight') nextSlide();
    if (e.key === 'ArrowLeft') prevSlide();
  };

  const titles = [
    <span key="1">Threat Category <span className="font-normal text-slate-400 normal-case">(7d)</span></span>,
    <span key="2">Alert Aging</span>,
    <span key="3">Auth Failures <span className="font-normal text-slate-400 normal-case">(24h)</span></span>
  ];

  const actions = [
    <React.Fragment key="1"><Filter className="w-3 h-3" /> Click donut to filter</React.Fragment>,
    <React.Fragment key="2"><Filter className="w-3 h-3" /> Click bar to filter</React.Fragment>,
    <React.Fragment key="3">SPF · DKIM · DMARC</React.Fragment>
  ];

  // Prepare Threat Category Donut
  const totalThreats = threatTrend.reduce((sum, t) => sum + t.count, 0);
  let cumulativePercent = 0;
  
  return (
    <div 
      className="bg-white dark:bg-[#070b14] border border-slate-200/90 dark:border-slate-800/80 rounded-xl shadow-sm mb-4 select-none overflow-hidden outline-none ring-0 focus-visible:ring-2 focus-visible:ring-blue-500"
      tabIndex={0}
      onKeyDown={handleKeyDown}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {/* Carousel Header */}
      <div className="flex items-center justify-between p-4 pb-3 border-b border-slate-100 dark:border-slate-800/80">
        <div className="flex items-center gap-2 sm:gap-4">
          <button onClick={prevSlide} className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-full transition-colors cursor-pointer" aria-label="Previous chart">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div className="flex flex-col">
            <h2 className="text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-300 tracking-wider uppercase">
              {titles[currentSlide]}
            </h2>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-[10px] text-slate-400 font-semibold">{currentSlide + 1} / 3</span>
              <div className="flex gap-1">
                {[0, 1, 2].map(idx => (
                  <span key={idx} className={`w-1.5 h-1.5 rounded-full ${idx === currentSlide ? 'bg-blue-500' : 'bg-slate-200 dark:bg-slate-700'}`} />
                ))}
              </div>
            </div>
          </div>
          <button onClick={nextSlide} className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-full transition-colors cursor-pointer" aria-label="Next chart">
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
        <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium flex items-center gap-1">
          {actions[currentSlide]}
        </span>
      </div>

      {/* Carousel Body */}
      <div className="relative w-full overflow-hidden" style={{ height: '220px' }}>
        <div 
          className="flex w-full h-full transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >
          {/* Slide 1: Threat Category (Donut) */}
          <div className="min-w-full h-full p-4 flex items-center justify-center">
            {/* Donut Chart */}
            <div className="relative w-36 h-36 sm:w-40 sm:h-40 flex-shrink-0">
              <svg width="100%" height="100%" viewBox="0 0 42 42" className="-rotate-90 drop-shadow-sm">
                <circle cx="21" cy="21" r="15.91549430918954" fill="transparent" stroke="currentColor" className="text-slate-100 dark:text-slate-800/80" strokeWidth="6" />
                {threatTrend.map((trend, i) => {
                  const percent = totalThreats > 0 ? trend.count / totalThreats : 0;
                  const dasharray = `${percent * 100} ${100 - percent * 100}`;
                  const dashoffset = 25 - (cumulativePercent * 100);
                  cumulativePercent += percent;
                  
                  const color = CATEGORY_COLORS[trend.category] || FALLBACK_COLORS[i % FALLBACK_COLORS.length];
                  const isSelected = filterCategory === trend.category;
                  
                  return (
                    <circle
                      key={trend.category}
                      cx="21"
                      cy="21"
                      r="15.91549430918954"
                      fill="transparent"
                      stroke={color}
                      strokeWidth={isSelected ? "8" : "6"}
                      strokeDasharray={dasharray}
                      strokeDashoffset={dashoffset}
                      className={`transition-all duration-300 cursor-pointer ${isSelected ? 'drop-shadow-md' : 'hover:stroke-[7]'}`}
                      onClick={() => socStore.setFilters({ category: isSelected ? 'ALL' : trend.category })}
                    >
                      <title>{trend.category}: {trend.count}</title>
                    </circle>
                  );
                })}
              </svg>
              {/* Center Text */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mt-1">Total</span>
                <span className="text-xl font-extrabold text-slate-900 dark:text-slate-100 font-mono leading-none">{totalThreats}</span>
              </div>
            </div>
            
            {/* Legend */}
            <div className="flex-1 flex flex-col justify-center ml-8 sm:ml-12 space-y-1 overflow-y-auto max-h-full pr-2">
              {threatTrend.map((trend, i) => {
                const color = CATEGORY_COLORS[trend.category] || FALLBACK_COLORS[i % FALLBACK_COLORS.length];
                const isSelected = filterCategory === trend.category;
                const percent = totalThreats > 0 ? ((trend.count / totalThreats) * 100).toFixed(0) : '0';
                return (
                  <div 
                    key={trend.category}
                    onClick={() => socStore.setFilters({ category: isSelected ? 'ALL' : trend.category })}
                    className={`flex items-center justify-between text-[11px] cursor-pointer p-1.5 rounded transition-colors ${isSelected ? 'bg-slate-100 dark:bg-slate-800' : 'hover:bg-slate-50 dark:hover:bg-slate-900/40'}`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: color }} />
                      <span className={`truncate ${isSelected ? 'font-bold text-slate-900 dark:text-slate-100' : 'font-medium text-slate-600 dark:text-slate-300'}`}>
                        {trend.category}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      <span className="font-mono font-bold text-slate-700 dark:text-slate-300 text-xs">{trend.count}</span>
                      <span className="text-[10px] text-slate-400 font-medium w-8 text-right">{percent}%</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Slide 2: Alert Aging */}
          <div className="min-w-full h-full p-4 flex flex-col">
            <div className="flex items-end justify-between h-full gap-2 w-full max-w-2xl mx-auto pb-4">
              {alertAging.map(bucket => {
                const isSelected = filterAgingBucket === bucket.label;
                const heightPct = Math.max((bucket.count / maxAgingCount) * 100, 8);
                return (
                  <div 
                    key={bucket.label} 
                    onClick={() => socStore.setFilters({ agingBucket: isSelected ? 'ALL' : bucket.label })}
                    className="flex flex-col items-center flex-1 group cursor-pointer h-full justify-end" 
                    title={`${bucket.label}: ${bucket.count} alerts (Click to filter)`}
                  >
                    <div 
                      className={`w-full max-w-[80px] rounded-t transition-all relative ${
                        isSelected 
                          ? 'bg-blue-600 dark:bg-blue-500' 
                          : bucket.label === 'SLA Breaching'
                            ? 'bg-rose-300 dark:bg-rose-900/80 group-hover:bg-rose-500'
                            : 'bg-slate-200 dark:bg-slate-700 group-hover:bg-blue-400'
                      }`} 
                      style={{ height: `${heightPct}%` }}
                    >
                      <span className="absolute -top-5 left-1/2 -translate-x-1/2 text-xs font-mono font-bold text-slate-600 dark:text-slate-400">
                        {bucket.count}
                      </span>
                    </div>
                    <span className={`text-[11px] font-semibold mt-2 text-center leading-tight w-full ${
                      isSelected ? 'text-blue-600 dark:text-blue-400 font-extrabold' : 'text-slate-500 dark:text-slate-400'
                    }`}>
                      {bucket.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Slide 3: Auth Failures */}
          <div className="min-w-full h-full p-4 flex flex-col">
            <div className="flex items-end h-full gap-0.5 flex-1 pb-1 max-w-3xl mx-auto w-full">
              {authTrend.slice(-24).map((pt, idx) => {
                const total = pt.spfFails + pt.dkimFails + pt.dmarcFails;
                const totalPct = Math.max((total / maxAuthTotal) * 100, 2);
                const spfPct = total > 0 ? (pt.spfFails / total) * 100 : 0;
                const dkimPct = total > 0 ? (pt.dkimFails / total) * 100 : 0;
                const dmarcPct = total > 0 ? (pt.dmarcFails / total) * 100 : 0;
                const timeLabel = new Date(pt.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                return (
                  <div 
                    key={idx} 
                    className="flex-1 flex flex-col justify-end group cursor-default h-full" 
                    title={`${timeLabel} - Total: ${total} (SPF: ${pt.spfFails}, DKIM: ${pt.dkimFails}, DMARC: ${pt.dmarcFails})`}
                  >
                    <div
                      className="w-full flex flex-col-reverse rounded-t-[2px] overflow-hidden transition-opacity group-hover:opacity-80"
                      style={{ height: `${totalPct}%` }}
                    >
                      <div className="w-full bg-blue-400 dark:bg-blue-600/70" style={{ height: `${dmarcPct}%` }} />
                      <div className="w-full bg-amber-400 dark:bg-amber-500/70" style={{ height: `${dkimPct}%` }} />
                      <div className="w-full bg-rose-400 dark:bg-rose-600/70" style={{ height: `${spfPct}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
            {/* Time axis + legend */}
            <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 max-w-3xl mx-auto w-full">
              <span className="text-[10px] font-mono text-slate-400">
                {firstAuthPt ? new Date(firstAuthPt.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '-24h'}
              </span>
              <div className="flex items-center gap-4">
                {[
                  { color: 'bg-rose-400', label: 'SPF' },
                  { color: 'bg-amber-400', label: 'DKIM' },
                  { color: 'bg-blue-400', label: 'DMARC' },
                ].map(({ color, label }) => (
                  <span key={label} className="flex items-center gap-1.5 text-[11px] text-slate-400 font-semibold">
                    <span className={`w-3 h-3 rounded-sm ${color}`} />
                    {label}
                  </span>
                ))}
              </div>
              <span className="text-[10px] font-mono text-slate-400 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                Now
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
