import React from 'react';

interface AshielderLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'full' | 'icon' | 'badge';
  theme?: 'dark' | 'light';
  tagline?: string;
  className?: string;
}

/**
 * Official ASHIELDER Brand Emblem & Wordmark Component
 * Faithfully reproduces the official circular shield emblem, orbital nodes,
 * tricolor accent bar, and 'Smarter Threat Detection' brand tagline.
 */
export const AshielderLogo: React.FC<AshielderLogoProps> = ({
  size = 'md',
  variant = 'full',
  theme = 'dark',
  tagline = 'Smarter Threat Detection',
  className = '',
}) => {
  // Dimensions mapping
  const iconSizes = {
    sm: 32,
    md: 40,
    lg: 48,
    xl: 64,
  };

  const dim = iconSizes[size];

  // The 3D Shield & Checkmark Vector SVG
  const ShieldEmblemSvg = (
    <svg
      width={dim}
      height={dim}
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="shrink-0 drop-shadow-sm select-none"
    >
      <defs>
        {/* Outer Circular Disk Gradient */}
        <radialGradient id="ashield-outer-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity={theme === 'dark' ? '0.12' : '1'} />
          <stop offset="75%" stopColor="#ffffff" stopOpacity={theme === 'dark' ? '0.06' : '1'} />
          <stop offset="100%" stopColor={theme === 'dark' ? '#bae6fd' : '#f0f9ff'} stopOpacity={theme === 'dark' ? '0.02' : '1'} />
        </radialGradient>

        {/* Outer Ring Stroke Gradient */}
        <linearGradient id="ashield-ring-grad" x1="0" y1="0" x2="120" y2="120" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.8" />
          <stop offset="50%" stopColor="#60a5fa" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#818cf8" stopOpacity="0.7" />
        </linearGradient>

        {/* Shield Outer Bevel Gradient */}
        <linearGradient id="ashield-bevel-grad" x1="60" y1="18" x2="60" y2="92" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#e0f2fe" />
          <stop offset="100%" stopColor="#93c5fd" />
        </linearGradient>

        {/* Shield Left Facet Gradient */}
        <linearGradient id="ashield-facet-left" x1="32" y1="24" x2="60" y2="88" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#38bdf8" />
          <stop offset="60%" stopColor="#2563eb" />
          <stop offset="100%" stopColor="#1d4ed8" />
        </linearGradient>

        {/* Shield Right Facet (Darker Beveled Facet) */}
        <linearGradient id="ashield-facet-right" x1="60" y1="24" x2="88" y2="88" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#1d4ed8" />
          <stop offset="70%" stopColor="#1e40af" />
          <stop offset="100%" stopColor="#0f172a" />
        </linearGradient>

        {/* Soft Drop Shadow for Checkmark & Shield */}
        <filter id="ashield-shadow" x="-10%" y="-10%" width="130%" height="130%">
          <feDropShadow dx="0" dy="2" stdDeviation="2.5" floodColor="#0f172a" floodOpacity="0.25" />
        </filter>
        <filter id="check-shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="1.5" stdDeviation="1" floodColor="#0f172a" floodOpacity="0.3" />
        </filter>
      </defs>

      {/* 1. Concentric Background Disk */}
      <circle cx="60" cy="60" r="56" fill="url(#ashield-outer-glow)" />
      
      {/* 2. Outer Orbit Ring with subtle 1px border */}
      <circle
        cx="60"
        cy="60"
        r="54"
        stroke="url(#ashield-ring-grad)"
        strokeWidth="1.6"
        fill="none"
        strokeDasharray="280"
        strokeDashoffset="0"
      />
      <circle
        cx="60"
        cy="60"
        r="49"
        stroke="#38bdf8"
        strokeWidth="0.7"
        strokeOpacity={theme === 'dark' ? '0.3' : '0.4'}
        fill="none"
      />

      {/* 3. Subtle Outer Celestial Tick Rays */}
      <path d="M28 42 L20 38" stroke="#38bdf8" strokeWidth="1.8" strokeLinecap="round" strokeOpacity="0.7" />
      <path d="M28 50 L20 54" stroke="#38bdf8" strokeWidth="1.8" strokeLinecap="round" strokeOpacity="0.7" />
      <path d="M92 42 L100 38" stroke="#38bdf8" strokeWidth="1.8" strokeLinecap="round" strokeOpacity="0.7" />
      <path d="M92 50 L100 54" stroke="#38bdf8" strokeWidth="1.8" strokeLinecap="round" strokeOpacity="0.7" />

      {/* 4. Orbital Colored Nodes (Top: Blue, Left: Saffron Orange, Right: Green, Bottom: Royal Blue) */}
      {/* Top Node (Cyan/Blue) */}
      <circle cx="60" cy="6" r="3.2" fill="#0284c7" />
      <circle cx="60" cy="6" r="1.2" fill="#ffffff" />
      {/* Left Node (Saffron Orange) */}
      <circle cx="6" cy="60" r="3.4" fill="#f97316" />
      <circle cx="6" cy="60" r="1.2" fill="#ffffff" />
      {/* Right Node (Emerald Green) */}
      <circle cx="114" cy="60" r="3.4" fill="#16a34a" />
      <circle cx="114" cy="60" r="1.2" fill="#ffffff" />
      {/* Bottom Node (Royal Blue) */}
      <circle cx="60" cy="114" r="3.4" fill="#2563eb" />
      <circle cx="60" cy="114" r="1.2" fill="#ffffff" />

      {/* 5. 3D Shield Base / Outer Border */}
      <g filter="url(#ashield-shadow)">
        <path
          d="M60 21 C76 21 89 27 89 27 C89 27 89 54 86 66 C82 80 66 93 60 97 C54 93 38 80 34 66 C31 54 31 27 31 27 C31 27 44 21 60 21 Z"
          fill="url(#ashield-bevel-grad)"
        />
        {/* Left Facet (Light Azure) */}
        <path
          d="M60 23.5 C46 23.5 33.5 29 33.5 29 C33.5 29 33.5 54 36.5 65 C40 77.5 54.5 89.5 60 93.5 L60 23.5 Z"
          fill="url(#ashield-facet-left)"
        />
        {/* Right Facet (Deep Navy/Royal) */}
        <path
          d="M60 23.5 L60 93.5 C65.5 89.5 80 77.5 83.5 65 C86.5 54 86.5 29 86.5 29 C86.5 29 74 23.5 60 23.5 Z"
          fill="url(#ashield-facet-right)"
        />
        {/* Central Bevel Highlight Spine */}
        <line x1="60" y1="23.5" x2="60" y2="93.5" stroke="#93c5fd" strokeWidth="0.8" strokeOpacity="0.7" />

        {/* 6. Bold Centered White Checkmark */}
        <path
          d="M49 57.5 L57 66 L72 49"
          stroke="#ffffff"
          strokeWidth="6"
          strokeLinecap="round"
          strokeLinejoin="round"
          filter="url(#check-shadow)"
        />
      </g>
    </svg>
  );

  if (variant === 'icon') {
    return <div className={`inline-flex items-center justify-center ${className}`}>{ShieldEmblemSvg}</div>;
  }

  if (variant === 'badge') {
    return (
      <div className={`flex flex-col items-center justify-center text-center select-none ${className}`}>
        {ShieldEmblemSvg}
        <div className="mt-2 flex items-center leading-none">
          <span className="text-xl font-black font-serif tracking-tight" style={{ color: 'var(--primary)' }}>A</span>
          <span className="text-xl font-black font-serif tracking-tight" style={{ color: 'var(--text-primary)' }}>Shield</span>
          <span className="text-xl font-black font-serif tracking-tight" style={{ color: 'var(--primary)' }}>ER</span>
        </div>
        {/* Tricolor Bar */}
        <div className="flex items-center h-1 w-14 rounded-full overflow-hidden mt-1 shadow-xs">
          <span className="h-full w-1/3 bg-amber-500" />
          <span className="h-full w-1/3 bg-slate-200" />
          <span className="h-full w-1/3 bg-emerald-600" />
        </div>
        <span
          className={`text-xs font-semibold tracking-wider mt-1 uppercase ${
            theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
          }`}
        >
          {tagline}
        </span>
      </div>
    );
  }

  // Default 'full' variant: horizontal logo with emblem + typography + tricolor + tagline
  const textClass = size === 'sm' ? 'text-base' : size === 'lg' ? 'text-xl' : size === 'xl' ? 'text-2xl' : 'text-lg';
  const barClass = size === 'sm' ? 'w-10 h-0.5 my-0.5' : size === 'lg' ? 'w-14 h-1 my-1' : size === 'xl' ? 'w-16 h-1 my-1.5' : 'w-12 h-0.5 my-1';
  const taglineClass = size === 'sm' ? 'text-xs' : size === 'lg' ? 'text-sm' : size === 'xl' ? 'text-base' : 'text-xs';

  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {ShieldEmblemSvg}
      <div className="flex flex-col justify-center">
        <div className="flex items-center leading-none">
          <span className={`${textClass} font-black font-serif tracking-tight`} style={{ color: 'var(--primary)' }}>A</span>
          <span className={`${textClass} font-black font-serif tracking-tight`} style={{ color: 'var(--text-primary)' }}>Shield</span>
          <span className={`${textClass} font-black font-serif tracking-tight`} style={{ color: 'var(--primary)' }}>ER</span>
        </div>

        {/* Official Saffron-White-Green Tricolor Bar */}
        <div className={`flex items-center rounded-full overflow-hidden ${barClass}`}>
          <span className="h-full w-1/3 bg-[#f97316]" />
          <span className="h-full w-1/3 bg-slate-300" />
          <span className="h-full w-1/3 bg-[#16a34a]" />
        </div>

        {/* Brand Tagline */}
        <span
          className={`${taglineClass} font-semibold tracking-wide leading-normal whitespace-nowrap ${
            theme === 'dark' ? 'text-slate-300' : 'text-slate-700'
          }`}
        >
          {tagline}
        </span>
      </div>
    </div>
  );
};
