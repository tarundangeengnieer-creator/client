import React from 'react';

/**
 * ThreatInvestigatorIllustration
 * 
 * High-definition vector mockup of ASHIELDER Threat Forensic Investigator (Case-A2291)
 * Uses the exact official ASHIELDER 3D Shield Emblem, Tricolor bar, typography,
 * crisp cyber surfaces, and distinct cards matching the application UX.
 */
export const ThreatInvestigatorIllustration: React.FC<{ className?: string }> = ({
  className = 'w-full h-auto block select-none',
}) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 1140 860"
      width="100%"
      height="100%"
      className={className}
      role="img"
      aria-label="ASHIELDER Threat Forensic Investigator case-A2291"
    >
      <defs>
        {/* Background Gradients */}
        <radialGradient id="ashBgGlow" cx="50%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#0b1e36" stopOpacity="0.72" />
          <stop offset="50%" stopColor="#071526" stopOpacity="0.62" />
          <stop offset="100%" stopColor="#030913" stopOpacity="0.76" />
        </radialGradient>

        <radialGradient id="ashNodeGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#18bfff" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#18bfff" stopOpacity="0" />
        </radialGradient>

        <radialGradient id="ashBottomReflection" cx="50%" cy="100%" r="50%">
          <stop offset="0%" stopColor="#18bfff" stopOpacity="0.25" />
          <stop offset="100%" stopColor="transparent" stopOpacity="0" />
        </radialGradient>

        {/* Card Surface Gradient */}
        <linearGradient id="ashCardSurface" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#0d2238" />
          <stop offset="100%" stopColor="#081829" />
        </linearGradient>

        <linearGradient id="ashHeaderSurface" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#0b1c2e" />
          <stop offset="100%" stopColor="#081726" />
        </linearGradient>

        {/* Gauge Gradient */}
        <linearGradient id="ashGaugeGrad" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#ffb800" />
          <stop offset="45%" stopColor="#ff6b35" />
          <stop offset="100%" stopColor="#ff365c" />
        </linearGradient>

        {/* Official ASHIELDER Brand Emblem Defs */}
        <radialGradient id="ashield-outer-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.18" />
          <stop offset="75%" stopColor="#ffffff" stopOpacity="0.08" />
          <stop offset="100%" stopColor="#bae6fd" stopOpacity="0.02" />
        </radialGradient>

        <linearGradient id="ashield-ring-grad" x1="0" y1="0" x2="120" y2="120" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.9" />
          <stop offset="50%" stopColor="#60a5fa" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#818cf8" stopOpacity="0.8" />
        </linearGradient>

        <linearGradient id="ashield-bevel-grad" x1="60" y1="18" x2="60" y2="92" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#e0f2fe" />
          <stop offset="100%" stopColor="#93c5fd" />
        </linearGradient>

        <linearGradient id="ashield-facet-left" x1="32" y1="24" x2="60" y2="88" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#38bdf8" />
          <stop offset="60%" stopColor="#2563eb" />
          <stop offset="100%" stopColor="#1d4ed8" />
        </linearGradient>

        <linearGradient id="ashield-facet-right" x1="60" y1="24" x2="88" y2="88" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#1d4ed8" />
          <stop offset="70%" stopColor="#1e40af" />
          <stop offset="100%" stopColor="#0f172a" />
        </linearGradient>

        {/* Subtle Grid for Graph Card */}
        <pattern id="ashCardGrid" width="24" height="24" patternUnits="userSpaceOnUse">
          <path d="M 24 0 L 0 0 0 24" fill="none" stroke="#143452" strokeWidth="0.8" />
        </pattern>

        {/* Shadows */}
        <filter id="ashCardGlow" x="-10%" y="-10%" width="120%" height="120%" filterUnits="userSpaceOnUse">
          <feDropShadow dx="0" dy="6" stdDeviation="10" floodColor="#000000" floodOpacity="0.55" />
        </filter>

        <filter id="ashCyanPillGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="0" stdDeviation="5" floodColor="#18bfff" floodOpacity="0.5" />
        </filter>

        <filter id="ashield-shadow" x="-10%" y="-10%" width="130%" height="130%">
          <feDropShadow dx="0" dy="2" stdDeviation="2.5" floodColor="#071526" floodOpacity="0.5" />
        </filter>
        <filter id="check-shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="1.5" stdDeviation="1" floodColor="#071526" floodOpacity="0.4" />
        </filter>
      </defs>

      <style>{`
        .ash-serif { font-family: ui-serif, Georgia, Cambria, "Times New Roman", Times, serif; }
        .ash-sans { font-family: Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }
        .ash-mono { font-family: ui-monospace, "SF Mono", Menlo, Monaco, Consolas, monospace; }
      `}</style>

      {/* Main Container Frame with High-Contrast Cyber Navy Gradient and Translucency */}
      <rect x="0" y="0" width="1140" height="860" rx="20" fill="url(#ashBgGlow)" fillOpacity="0.75" stroke="#1e4773" strokeWidth="1.5" />

      {/* Bottom Ambience Reflection */}
      <ellipse cx="570" cy="855" rx="360" ry="95" fill="url(#ashBottomReflection)" />

      {/* ========================================================================= */}
      {/* 1. TOP HEADER BAR                                                         */}
      {/* ========================================================================= */}
      <g>
        {/* Top Header Background Bar */}
        <rect x="0" y="0" width="1140" height="88" fill="url(#ashHeaderSurface)" opacity="0.6" rx="20" />
        <line x1="0" y1="88" x2="1140" y2="88" stroke="#163756" strokeWidth="1.2" />

        {/* Left: EXACT ASHIELDER APP LOGO & BRAND TEXT */}
        <g transform="translate(32, 18)">
          {/* Exact Shield Emblem SVG at 52x52 (scaled from 120x120 viewBox) */}
          <g transform="scale(0.433)">
            {/* Concentric Background Disk */}
            <circle cx="60" cy="60" r="56" fill="url(#ashield-outer-glow)" />
            
            {/* Outer Orbit Ring */}
            <circle
              cx="60"
              cy="60"
              r="54"
              stroke="url(#ashield-ring-grad)"
              strokeWidth="2.2"
              fill="none"
            />
            <circle
              cx="60"
              cy="60"
              r="49"
              stroke="#38bdf8"
              strokeWidth="1"
              strokeOpacity="0.5"
              fill="none"
            />

            {/* Outer Celestial Tick Rays */}
            <path d="M28 42 L20 38" stroke="#38bdf8" strokeWidth="2.2" strokeLinecap="round" strokeOpacity="0.8" />
            <path d="M28 50 L20 54" stroke="#38bdf8" strokeWidth="2.2" strokeLinecap="round" strokeOpacity="0.8" />
            <path d="M92 42 L100 38" stroke="#38bdf8" strokeWidth="2.2" strokeLinecap="round" strokeOpacity="0.8" />
            <path d="M92 50 L100 54" stroke="#38bdf8" strokeWidth="2.2" strokeLinecap="round" strokeOpacity="0.8" />

            {/* 4 Orbital Colored Nodes */}
            {/* Top Node (Cyan/Blue) */}
            <circle cx="60" cy="6" r="3.8" fill="#0284c7" />
            <circle cx="60" cy="6" r="1.5" fill="#ffffff" />
            {/* Left Node (Saffron Orange) */}
            <circle cx="6" cy="60" r="4" fill="#f97316" />
            <circle cx="6" cy="60" r="1.5" fill="#ffffff" />
            {/* Right Node (Emerald Green) */}
            <circle cx="114" cy="60" r="4" fill="#16a34a" />
            <circle cx="114" cy="60" r="1.5" fill="#ffffff" />
            {/* Bottom Node (Royal Blue) */}
            <circle cx="60" cy="114" r="4" fill="#2563eb" />
            <circle cx="60" cy="114" r="1.5" fill="#ffffff" />

            {/* 3D Shield Base / Outer Border */}
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
              {/* Central Spine */}
              <line x1="60" y1="23.5" x2="60" y2="93.5" stroke="#93c5fd" strokeWidth="1" strokeOpacity="0.8" />

              {/* Bold Centered White Checkmark */}
              <path
                d="M49 57.5 L57 66 L72 49"
                stroke="#ffffff"
                strokeWidth="6"
                strokeLinecap="round"
                strokeLinejoin="round"
                filter="url(#check-shadow)"
              />
            </g>
          </g>

          {/* Exact Brand Typography */}
          <g transform="translate(62, 5)">
            <text x="0" y="22" className="ash-serif" fontSize="23" fontWeight="900" letterSpacing="-0.3">
              <tspan fill="#18bfff">A</tspan>
              <tspan fill="#ffffff">Shield</tspan>
              <tspan fill="#18bfff">ER</tspan>
            </text>

            {/* Exact Official Tricolor Bar */}
            <g transform="translate(0, 27)">
              <rect x="0" y="0" width="18" height="2.8" rx="1.4" fill="#f97316" />
              <rect x="18" y="0" width="18" height="2.8" fill="#e2e8f0" />
              <rect x="36" y="0" width="18" height="2.8" rx="1.4" fill="#16a34a" />
            </g>

            {/* Brand Tagline */}
            <text x="0" y="44" className="ash-sans" fontSize="9.5" fontWeight="600" letterSpacing="0.8" fill="#94a3b8">
              Smarter Threat Detection
            </text>
          </g>

          {/* Breadcrumb Path Divider & Route Info */}
          <g transform="translate(230, 26)">
            <text x="0" y="0" className="ash-sans" fontSize="14" fontWeight="500" fill="#64748b">
              › &nbsp; <tspan fill="#94a3b8" fontWeight="600">Investigator</tspan> &nbsp; / &nbsp; <tspan fill="#38bdf8" fontWeight="700">Case-A2291</tspan>
            </text>
          </g>
        </g>

        {/* Right: Active Threat Status & Malicious Badge */}
        <g transform="translate(750, 24)">
          {/* Active Threat Pulsing Indicator */}
          <g transform="translate(0, 14)">
            <circle cx="10" cy="6" r="4.5" fill="#ff365c">
              <animate attributeName="opacity" values="1;0.4;1" dur="2s" repeatCount="indefinite" />
            </circle>
            <text x="24" y="10" className="ash-sans" fontSize="13" fontWeight="800" letterSpacing="0.5" fill="#ff365c">
              ACTIVE THREAT
            </text>
          </g>

          {/* Malicious Badge Button */}
          <g transform="translate(150, 0)">
            <rect x="0" y="0" width="185" height="42" rx="10" fill="#220710" stroke="#ff365c" strokeWidth="1.6" />
            {/* Shield Icon inside Badge */}
            <path d="M 28 12 C 28 10 37 7 38 7 C 39 7 48 10 48 12 C 48 22 39 28 38 29 C 37 28 28 22 28 12 Z" fill="none" stroke="#ff365c" strokeWidth="2" />
            <path d="M 34 18 L 37 21 L 43 15" fill="none" stroke="#ff365c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <text x="60" y="26" className="ash-sans" fontSize="13.5" fontWeight="900" letterSpacing="1" fill="#ff365c">
              MALICIOUS
            </text>
          </g>
        </g>
      </g>

      {/* ========================================================================= */}
      {/* 2. WORKFLOW STEPPER RIBBON                                                */}
      {/* ========================================================================= */}
      <g transform="translate(24, 104)">
        {/* Stepper Container */}
        <rect x="0" y="0" width="1092" height="54" rx="12" fill="#091b2e" stroke="#163c61" strokeWidth="1.4" filter="url(#ashCardGlow)" />

        {/* Step 1: EMAIL (Completed) */}
        <g transform="translate(22, 15)">
          <circle cx="12" cy="12" r="10" fill="#0c233a" stroke="#38bdf8" strokeWidth="1.6" />
          <path d="M 7 12 L 11 15 L 17 8" fill="none" stroke="#38bdf8" strokeWidth="1.8" strokeLinecap="round" />
          <text x="32" y="16" className="ash-sans" fontSize="12" fontWeight="700" fill="#e2e8f0" letterSpacing="0.5">EMAIL</text>
          <text x="96" y="16" className="ash-sans" fontSize="14" fontWeight="500" fill="#475569">›</text>
        </g>

        {/* Step 2: EXTRACT (Completed) */}
        <g transform="translate(150, 15)">
          <circle cx="12" cy="12" r="10" fill="#0c233a" stroke="#38bdf8" strokeWidth="1.6" />
          <path d="M 7 12 L 11 15 L 17 8" fill="none" stroke="#38bdf8" strokeWidth="1.8" strokeLinecap="round" />
          <text x="32" y="16" className="ash-sans" fontSize="12" fontWeight="700" fill="#e2e8f0" letterSpacing="0.5">EXTRACT</text>
          <text x="114" y="16" className="ash-sans" fontSize="14" fontWeight="500" fill="#475569">›</text>
        </g>

        {/* Step 3: DETECT (Completed) */}
        <g transform="translate(296, 15)">
          <circle cx="12" cy="12" r="10" fill="#0c233a" stroke="#38bdf8" strokeWidth="1.6" />
          <path d="M 7 12 L 11 15 L 17 8" fill="none" stroke="#38bdf8" strokeWidth="1.8" strokeLinecap="round" />
          <text x="32" y="16" className="ash-sans" fontSize="12" fontWeight="700" fill="#e2e8f0" letterSpacing="0.5">DETECT</text>
          <text x="100" y="16" className="ash-sans" fontSize="14" fontWeight="500" fill="#475569">›</text>
        </g>

        {/* Step 4: CORRELATE (Completed) */}
        <g transform="translate(426, 15)">
          <circle cx="12" cy="12" r="10" fill="#0c233a" stroke="#38bdf8" strokeWidth="1.6" />
          <path d="M 7 12 L 11 15 L 17 8" fill="none" stroke="#38bdf8" strokeWidth="1.8" strokeLinecap="round" />
          <text x="32" y="16" className="ash-sans" fontSize="12" fontWeight="700" fill="#e2e8f0" letterSpacing="0.5">CORRELATE</text>
          <text x="126" y="16" className="ash-sans" fontSize="14" fontWeight="500" fill="#475569">›</text>
        </g>

        {/* Step 5: INTELLIGENCE (Completed) */}
        <g transform="translate(582, 15)">
          <circle cx="12" cy="12" r="10" fill="#0c233a" stroke="#38bdf8" strokeWidth="1.6" />
          <path d="M 7 12 L 11 15 L 17 8" fill="none" stroke="#38bdf8" strokeWidth="1.8" strokeLinecap="round" />
          <text x="32" y="16" className="ash-sans" fontSize="12" fontWeight="700" fill="#e2e8f0" letterSpacing="0.5">INTELLIGENCE</text>
          <text x="140" y="16" className="ash-sans" fontSize="14" fontWeight="500" fill="#475569">›</text>
        </g>

        {/* Step 6: INVESTIGATE (Active Cyan Pill) */}
        <g transform="translate(748, 7)">
          <rect x="0" y="0" width="158" height="40" rx="8" fill="#0b314d" stroke="#18bfff" strokeWidth="1.8" filter="url(#ashCyanPillGlow)" />
          {/* Search Glass Icon */}
          <circle cx="28" cy="20" r="6" fill="none" stroke="#18bfff" strokeWidth="2" />
          <line x1="33" y1="24.5" x2="40" y2="31" stroke="#18bfff" strokeWidth="2" strokeLinecap="round" />
          <text x="48" y="24.5" className="ash-sans" fontSize="12.5" fontWeight="900" fill="#ffffff" letterSpacing="0.8">INVESTIGATE</text>
        </g>

        <text x="926" y="31" className="ash-sans" fontSize="14" fontWeight="500" fill="#475569">›</text>

        {/* Step 7: REPORT */}
        <g transform="translate(956, 15)">
          {/* Document Icon */}
          <path d="M 4 2 L 13 2 L 17 6 L 17 22 L 4 22 Z" fill="none" stroke="#64748b" strokeWidth="1.6" />
          <path d="M 13 2 L 13 6 L 17 6" fill="none" stroke="#64748b" strokeWidth="1.6" />
          <text x="26" y="16" className="ash-sans" fontSize="12" fontWeight="700" fill="#94a3b8" letterSpacing="0.5">REPORT</text>
        </g>
      </g>

      {/* ========================================================================= */}
      {/* 3. MAIN WORKSPACE 3-COLUMN GRID                                           */}
      {/* ========================================================================= */}

      {/* ======================== LEFT COLUMN ======================== */}
      <g transform="translate(24, 180)">
        
        {/* Card 1: Email Details */}
        <g transform="translate(0, 0)">
          <rect x="0" y="0" width="310" height="195" rx="14" fill="url(#ashCardSurface)" stroke="#173a5c" strokeWidth="1.4" filter="url(#ashCardGlow)" />
          
          {/* Card Header */}
          <path d="M 22 22 L 38 22 L 38 34 L 22 34 Z M 22 23 L 30 29 L 38 23" fill="none" stroke="#38bdf8" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          <text x="46" y="31" className="ash-sans" fontSize="14.5" fontWeight="800" fill="#ffffff">Email Details</text>

          {/* Subject Block */}
          <g transform="translate(20, 52)">
            <text x="0" y="12" className="ash-sans" fontSize="11.5" fontWeight="600" fill="#94a3b8">Subject</text>
            <text x="0" y="32" className="ash-sans" fontSize="13.5" fontWeight="800" fill="#f8fafc">Urgent: Verify Your PayPal</text>
            <text x="0" y="50" className="ash-sans" fontSize="13.5" fontWeight="800" fill="#f8fafc">Account</text>
            {/* Copy Icon */}
            <g transform="translate(245, 18)" opacity="0.75">
              <rect x="0" y="4" width="13" height="13" rx="2" fill="none" stroke="#94a3b8" strokeWidth="1.5" />
              <path d="M 4 4 L 4 0 L 17 0 L 17 13 L 13 13" fill="none" stroke="#94a3b8" strokeWidth="1.5" />
            </g>
          </g>

          {/* Sender Block */}
          <g transform="translate(20, 128)">
            <text x="0" y="10" className="ash-sans" fontSize="11.5" fontWeight="600" fill="#94a3b8">Sender</text>
            <text x="0" y="30" className="ash-mono" fontSize="12" fontWeight="600" fill="#e2e8f0">security-alert@paypal-....</text>
            {/* Copy Icon */}
            <g transform="translate(245, 16)" opacity="0.75">
              <rect x="0" y="4" width="13" height="13" rx="2" fill="none" stroke="#94a3b8" strokeWidth="1.5" />
              <path d="M 4 4 L 4 0 L 17 0 L 17 13 L 13 13" fill="none" stroke="#94a3b8" strokeWidth="1.5" />
            </g>
          </g>
        </g>

        {/* Card 2: Authentication */}
        <g transform="translate(0, 215)">
          <rect x="0" y="0" width="310" height="195" rx="14" fill="url(#ashCardSurface)" stroke="#173a5c" strokeWidth="1.4" filter="url(#ashCardGlow)" />
          
          {/* Card Header */}
          <path d="M 22 21 C 22 17 30 14 30 14 C 30 14 38 17 38 21 C 38 29 30 35 30 35 C 30 35 22 29 22 21 Z" fill="none" stroke="#38bdf8" strokeWidth="1.8" />
          <text x="46" y="29" className="ash-sans" fontSize="14.5" fontWeight="800" fill="#ffffff">Authentication</text>

          {/* FAILED Badge */}
          <rect x="220" y="14" width="70" height="24" rx="6" fill="#2d0b16" stroke="#ff365c" strokeWidth="1.4" />
          <text x="255" y="30.5" className="ash-sans" fontSize="11" fontWeight="900" fill="#ff365c" textAnchor="middle" letterSpacing="0.5">FAILED</text>

          {/* Donut Gauge Chart */}
          <g transform="translate(24, 58)">
            {/* Track Ring */}
            <circle cx="50" cy="50" r="42" fill="none" stroke="#091b2c" strokeWidth="11" />
            {/* Failed Red Arc */}
            <circle cx="50" cy="50" r="42" fill="none" stroke="#ff365c" strokeWidth="11" strokeDasharray="264" strokeDashoffset="0" transform="rotate(-90 50 50)" />
            <text x="50" y="50" className="ash-sans" fontSize="22" fontWeight="900" fill="#ffffff" textAnchor="middle">0/3</text>
            <text x="50" y="67" className="ash-sans" fontSize="10.5" fontWeight="700" fill="#94a3b8" textAnchor="middle" letterSpacing="0.5">PASS</text>
          </g>

          {/* Auth Items */}
          <g transform="translate(155, 66)">
            {/* SPF */}
            <circle cx="5" cy="14" r="3.8" fill="#ff365c" />
            <text x="18" y="18" className="ash-sans" fontSize="13" fontWeight="700" fill="#e2e8f0">SPF</text>
            <text x="110" y="18" className="ash-sans" fontSize="12" fontWeight="900" fill="#ff365c" textAnchor="end">FAIL</text>

            {/* DKIM */}
            <circle cx="5" cy="46" r="3.8" fill="#ff365c" />
            <text x="18" y="50" className="ash-sans" fontSize="13" fontWeight="700" fill="#e2e8f0">DKIM</text>
            <text x="110" y="50" className="ash-sans" fontSize="12" fontWeight="900" fill="#ff365c" textAnchor="end">FAIL</text>

            {/* DMARC */}
            <circle cx="5" cy="78" r="3.8" fill="#ff365c" />
            <text x="18" y="82" className="ash-sans" fontSize="13" fontWeight="700" fill="#e2e8f0">DMARC</text>
            <text x="110" y="82" className="ash-sans" fontSize="12" fontWeight="900" fill="#ff365c" textAnchor="end">FAIL</text>
          </g>
        </g>

        {/* Card 3: Risk Assessment */}
        <g transform="translate(0, 430)">
          <rect x="0" y="0" width="310" height="215" rx="14" fill="url(#ashCardSurface)" stroke="#173a5c" strokeWidth="1.4" filter="url(#ashCardGlow)" />

          {/* Card Header */}
          <g transform="translate(20, 16)">
            <path d="M 4 16 L 4 8 M 10 16 L 10 4 M 16 16 L 16 11" stroke="#38bdf8" strokeWidth="2" strokeLinecap="round" />
            <text x="26" y="14" className="ash-sans" fontSize="14.5" fontWeight="800" fill="#ffffff">Risk Assessment</text>
          </g>

          {/* CRITICAL Badge */}
          <rect x="208" y="14" width="82" height="24" rx="6" fill="#2d0b16" stroke="#ff365c" strokeWidth="1.4" />
          <text x="249" y="30.5" className="ash-sans" fontSize="11" fontWeight="900" fill="#ff365c" textAnchor="middle" letterSpacing="0.5">CRITICAL</text>

          {/* Semi-circular Speedometer Gauge */}
          <g transform="translate(30, 48)">
            {/* Gauge Track Arc */}
            <path d="M 25 100 A 90 90 0 0 1 225 100" fill="none" stroke="#091b2c" strokeWidth="13" strokeLinecap="round" />
            
            {/* Active Gauge Gradient Arc (fills to 91%) */}
            <path d="M 25 100 A 90 90 0 0 1 216 66" fill="none" stroke="url(#ashGaugeGrad)" strokeWidth="13" strokeLinecap="round" />
            
            {/* Needle Indicator Knob at 91% */}
            <circle cx="216" cy="66" r="6" fill="#ffffff" stroke="#ff365c" strokeWidth="2.5" />

            {/* Gauge Text Values */}
            <text x="18" y="118" className="ash-sans" fontSize="12" fontWeight="700" fill="#94a3b8">0</text>
            <text x="232" y="118" className="ash-sans" fontSize="12" fontWeight="700" fill="#94a3b8" textAnchor="end">100</text>

            {/* Center Score */}
            <text x="125" y="85" className="ash-sans" textAnchor="middle">
              <tspan fontSize="34" fontWeight="900" fill="#ff365c">91</tspan>
              <tspan fontSize="18" fontWeight="700" fill="#94a3b8">/100</tspan>
            </text>

            {/* Verdict Text */}
            <text x="125" y="108" className="ash-sans" fontSize="14" fontWeight="900" letterSpacing="1" fill="#ff365c" textAnchor="middle">
              MALICIOUS
            </text>

            {/* Subtitle */}
            <text x="125" y="142" className="ash-sans" fontSize="12.5" fontWeight="600" fill="#cbd5e1" textAnchor="middle">
              High Risk Phishing Attack
            </text>
          </g>
        </g>

      </g>

      {/* ======================== CENTER COLUMN ======================== */}
      <g transform="translate(356, 180)">

        {/* Card 1: Entity Relationship Graph */}
        <g transform="translate(0, 0)">
          <rect x="0" y="0" width="428" height="410" rx="14" fill="url(#ashCardSurface)" stroke="#173a5c" strokeWidth="1.4" filter="url(#ashCardGlow)" />
          
          {/* Graph Grid Background */}
          <rect x="2" y="52" width="424" height="354" fill="url(#ashCardGrid)" opacity="0.75" />

          {/* Center Ambient Glow */}
          <circle cx="214" cy="180" r="140" fill="url(#ashNodeGlow)" />

          {/* Card Header */}
          <g transform="translate(20, 20)">
            {/* Network Nodes Icon */}
            <circle cx="4" cy="6" r="3" fill="#18bfff" />
            <circle cx="14" cy="16" r="3" fill="#18bfff" />
            <circle cx="20" cy="4" r="3" fill="#18bfff" />
            <line x1="4" y1="6" x2="14" y2="16" stroke="#18bfff" strokeWidth="1.5" />
            <line x1="14" y1="16" x2="20" y2="4" stroke="#18bfff" strokeWidth="1.5" />

            <text x="32" y="13" className="ash-sans" fontSize="14.5" fontWeight="800" fill="#ffffff">Entity Relationship Graph</text>
          </g>

          {/* Header Subtitle / Expand */}
          <text x="360" y="28" className="ash-sans" fontSize="11.5" fontWeight="600" fill="#94a3b8" textAnchor="end">5 primary</text>
          <text x="360" y="42" className="ash-sans" fontSize="11.5" fontWeight="600" fill="#94a3b8" textAnchor="end">nodes</text>
          <g transform="translate(390, 22)">
            <path d="M 0 4 L 4 0 L 10 0 M 10 0 L 10 6" fill="none" stroke="#94a3b8" strokeWidth="1.6" strokeLinecap="round" />
            <path d="M 10 6 L 6 10 L 0 10 M 0 10 L 0 4" fill="none" stroke="#94a3b8" strokeWidth="1.6" strokeLinecap="round" />
          </g>

          {/* Connecting Lines from Central Node to Child Nodes */}
          <g stroke="#1e5482" strokeWidth="2.2" strokeLinecap="round">
            <line x1="214" y1="170" x2="68" y2="280" />
            <line x1="214" y1="170" x2="164" y2="280" />
            <line x1="214" y1="170" x2="264" y2="280" />
            <line x1="214" y1="170" x2="360" y2="280" />
          </g>

          {/* 1. Central EMAIL (Source) Node */}
          <g transform="translate(214, 150)">
            <circle cx="0" cy="0" r="38" fill="#0c2b48" stroke="#18bfff" strokeWidth="3" filter="url(#ashCyanPillGlow)" />
            <circle cx="0" cy="0" r="28" fill="#071829" stroke="#14446e" strokeWidth="1.6" />
            {/* Email Icon */}
            <path d="M -11 -7 L 11 -7 L 11 7 L -11 7 Z M -11 -6 L 0 2 L 11 -6" fill="none" stroke="#18bfff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
            <text x="0" y="52" className="ash-sans" fontSize="13" fontWeight="900" fill="#18bfff" textAnchor="middle" letterSpacing="0.5">EMAIL</text>
            <text x="0" y="68" className="ash-sans" fontSize="11.5" fontWeight="600" fill="#94a3b8" textAnchor="middle">(Source)</text>
          </g>

          {/* 2. Child Node 1: IP (Malicious) */}
          <g transform="translate(68, 280)">
            <circle cx="0" cy="0" r="24" fill="#0d243b" stroke="#38bdf8" strokeWidth="2" />
            {/* Monitor Icon */}
            <rect x="-8" y="-7" width="16" height="11" rx="1.5" fill="none" stroke="#e2e8f0" strokeWidth="1.8" />
            <line x1="-3" y1="7" x2="3" y2="7" stroke="#e2e8f0" strokeWidth="1.8" />
            <line x1="0" y1="4" x2="0" y2="7" stroke="#e2e8f0" strokeWidth="1.8" />
            <text x="0" y="38" className="ash-sans" fontSize="12" fontWeight="800" fill="#ffffff" textAnchor="middle">IP</text>
            <text x="0" y="52" className="ash-sans" fontSize="10.5" fontWeight="800" fill="#ff365c" textAnchor="middle">(Malicious)</text>
          </g>

          {/* 3. Child Node 2: DOMAIN (Impersonation) */}
          <g transform="translate(164, 280)">
            <circle cx="0" cy="0" r="24" fill="#0d243b" stroke="#38bdf8" strokeWidth="2" />
            {/* Globe Icon */}
            <circle cx="0" cy="0" r="9" fill="none" stroke="#e2e8f0" strokeWidth="1.8" />
            <ellipse cx="0" cy="0" rx="4.5" ry="9" fill="none" stroke="#e2e8f0" strokeWidth="1.3" />
            <line x1="-9" y1="0" x2="9" y2="0" stroke="#e2e8f0" strokeWidth="1.3" />
            <text x="0" y="38" className="ash-sans" fontSize="12" fontWeight="800" fill="#ffffff" textAnchor="middle">DOMAIN</text>
            <text x="0" y="52" className="ash-sans" fontSize="10.5" fontWeight="700" fill="#cbd5e1" textAnchor="middle">(Impersonation)</text>
          </g>

          {/* 4. Child Node 3: URL (Suspicious) */}
          <g transform="translate(264, 280)">
            <circle cx="0" cy="0" r="24" fill="#0d243b" stroke="#38bdf8" strokeWidth="2" />
            {/* Link Icon */}
            <path d="M -5 2 L -2 5 A 4 4 0 0 0 4 -1 L 1 -4" fill="none" stroke="#e2e8f0" strokeWidth="1.8" strokeLinecap="round" />
            <path d="M 5 -2 L 2 -5 A 4 4 0 0 0 -4 1 L -1 4" fill="none" stroke="#e2e8f0" strokeWidth="1.8" strokeLinecap="round" />
            <text x="0" y="38" className="ash-sans" fontSize="12" fontWeight="800" fill="#ffffff" textAnchor="middle">URL</text>
            <text x="0" y="52" className="ash-sans" fontSize="10.5" fontWeight="800" fill="#ffb800" textAnchor="middle">(Suspicious)</text>
          </g>

          {/* 5. Child Node 4: ATTACHMENT (Malicious) */}
          <g transform="translate(360, 280)">
            <circle cx="0" cy="0" r="24" fill="#0d243b" stroke="#38bdf8" strokeWidth="2" />
            {/* Document Icon */}
            <path d="M -5 -7 L 2 -7 L 6 -3 L 6 7 L -5 7 Z" fill="none" stroke="#e2e8f0" strokeWidth="1.8" strokeLinejoin="round" />
            <path d="M 2 -7 L 2 -3 L 6 -3" fill="none" stroke="#e2e8f0" strokeWidth="1.8" />
            <text x="0" y="38" className="ash-sans" fontSize="11" fontWeight="800" fill="#ffffff" textAnchor="middle">ATTACHMENT</text>
            <text x="0" y="52" className="ash-sans" fontSize="10.5" fontWeight="800" fill="#ff365c" textAnchor="middle">(Malicious)</text>
          </g>
        </g>

        {/* Card 2: Key Findings */}
        <g transform="translate(0, 430)">
          <rect x="0" y="0" width="428" height="215" rx="14" fill="url(#ashCardSurface)" stroke="#173a5c" strokeWidth="1.4" filter="url(#ashCardGlow)" />

          {/* Card Header */}
          <g transform="translate(20, 22)">
            <path d="M 0 0 L 14 0 L 14 18 L 0 18 Z M 3 5 L 11 5 M 3 9 L 11 9 M 3 13 L 8 13" fill="none" stroke="#38bdf8" strokeWidth="1.8" strokeLinecap="round" />
            <text x="24" y="14" className="ash-sans" fontSize="15" fontWeight="800" fill="#ffffff">Key Findings</text>
          </g>

          {/* Matches Count */}
          <text x="360" y="36" className="ash-sans" fontSize="12" fontWeight="700" fill="#18bfff" textAnchor="end">3 confirmed matches</text>
          <text x="375" y="36" className="ash-sans" fontSize="14" fontWeight="800" fill="#18bfff">→</text>

          {/* Finding 1 */}
          <g transform="translate(24, 70)">
            <circle cx="6" cy="6" r="4.5" fill="#ff365c" />
            <text x="24" y="10" className="ash-sans" fontSize="13" fontWeight="600" fill="#f1f5f9">Domain registered 2 days ago mimics PayPal</text>
          </g>

          {/* Finding 2 */}
          <g transform="translate(24, 114)">
            <circle cx="6" cy="6" r="4.5" fill="#ff365c" />
            <text x="24" y="10" className="ash-sans" fontSize="13" fontWeight="600" fill="#f1f5f9">Sender IP is a known unauthorized relay</text>
          </g>

          {/* Finding 3 */}
          <g transform="translate(24, 158)">
            <circle cx="6" cy="6" r="4.5" fill="#ffb800" />
            <text x="24" y="10" className="ash-sans" fontSize="13" fontWeight="600" fill="#f1f5f9">Embedded link leads to fake login credentials</text>
          </g>
        </g>

      </g>

      {/* ======================== RIGHT COLUMN ======================== */}
      <g transform="translate(804, 180)">
        
        {/* Card: Threat Indicators */}
        <rect x="0" y="0" width="312" height="645" rx="14" fill="url(#ashCardSurface)" stroke="#173a5c" strokeWidth="1.4" filter="url(#ashCardGlow)" />

        {/* Card Header */}
        <g transform="translate(20, 24)">
          {/* Target/Crosshair Icon */}
          <circle cx="8" cy="8" r="8" fill="none" stroke="#18bfff" strokeWidth="2" />
          <circle cx="8" cy="8" r="3" fill="#18bfff" />
          <line x1="8" y1="-2" x2="8" y2="3" stroke="#18bfff" strokeWidth="2" />
          <line x1="8" y1="13" x2="8" y2="18" stroke="#18bfff" strokeWidth="2" />
          <line x1="-2" y1="8" x2="3" y2="8" stroke="#18bfff" strokeWidth="2" />
          <line x1="13" y1="8" x2="18" y2="8" stroke="#18bfff" strokeWidth="2" />

          <text x="28" y="14" className="ash-sans" fontSize="15" fontWeight="800" fill="#ffffff">Threat Indicators</text>
        </g>

        {/* Attack Path Pill */}
        <rect x="214" y="17" width="82" height="28" rx="6" fill="#0c2b48" stroke="#174f7d" strokeWidth="1.2" />
        <text x="255" y="35" className="ash-sans" fontSize="11" fontWeight="700" fill="#bae6fd" textAnchor="middle">Attack Path</text>

        {/* Vertical Stepper Line */}
        <line x1="32" y1="100" x2="32" y2="520" stroke="#15426b" strokeWidth="2.5" />

        {/* ==================== STEP 1: ORIGIN IP ==================== */}
        <g transform="translate(0, 80)">
          {/* Circle Number 1 */}
          <circle cx="32" cy="30" r="16" fill="#0d243b" stroke="#ffffff" strokeWidth="2.2" />
          <text x="32" y="36" className="ash-sans" fontSize="14" fontWeight="900" fill="#ffffff" textAnchor="middle">1</text>

          {/* Content Box */}
          <g transform="translate(64, 16)">
            {/* Monitor Icon + Label + Badge */}
            <rect x="0" y="0" width="16" height="11" rx="1.5" fill="none" stroke="#94a3b8" strokeWidth="1.6" />
            <line x1="4" y1="13" x2="12" y2="13" stroke="#94a3b8" strokeWidth="1.6" />
            <text x="24" y="10" className="ash-sans" fontSize="11.5" fontWeight="900" fill="#e2e8f0" letterSpacing="0.5">ORIGIN IP</text>

            {/* Malicious Badge */}
            <rect x="105" y="-3" width="74" height="22" rx="5" fill="#2d0b16" stroke="#ff365c" strokeWidth="1.2" />
            <text x="142" y="12" className="ash-sans" fontSize="10" fontWeight="900" fill="#ff365c" textAnchor="middle">MALICIOUS</text>

            {/* Primary Value */}
            <text x="0" y="44" className="ash-sans" fontSize="17.5" fontWeight="900" fill="#ffffff" letterSpacing="-0.2">185.234.21.9</text>

            {/* Subtitle */}
            <text x="0" y="68" className="ash-sans" fontSize="12" fontWeight="600" fill="#94a3b8">Unauthorized Origin IP</text>

            {/* Right Chevron */}
            <text x="210" y="48" className="ash-sans" fontSize="18" fontWeight="700" fill="#94a3b8">›</text>
          </g>

          {/* Inner Divider */}
          <line x1="64" y1="116" x2="284" y2="116" stroke="#153654" strokeWidth="1.2" />
        </g>

        {/* ==================== STEP 2: DOMAIN ==================== */}
        <g transform="translate(0, 240)">
          {/* Circle Number 2 */}
          <circle cx="32" cy="30" r="16" fill="#0d243b" stroke="#ffffff" strokeWidth="2.2" />
          <text x="32" y="36" className="ash-sans" fontSize="14" fontWeight="900" fill="#ffffff" textAnchor="middle">2</text>

          {/* Content Box */}
          <g transform="translate(64, 16)">
            {/* Globe Icon + Label + Badge */}
            <circle cx="8" cy="6" r="7" fill="none" stroke="#94a3b8" strokeWidth="1.6" />
            <ellipse cx="8" cy="6" rx="3.5" ry="7" fill="none" stroke="#94a3b8" strokeWidth="1.2" />
            <line x1="1" y1="6" x2="15" y2="6" stroke="#94a3b8" strokeWidth="1.2" />
            <text x="24" y="10" className="ash-sans" fontSize="11.5" fontWeight="900" fill="#e2e8f0" letterSpacing="0.5">DOMAIN</text>

            {/* Malicious Badge */}
            <rect x="95" y="-3" width="74" height="22" rx="5" fill="#2d0b16" stroke="#ff365c" strokeWidth="1.2" />
            <text x="132" y="12" className="ash-sans" fontSize="10" fontWeight="900" fill="#ff365c" textAnchor="middle">MALICIOUS</text>

            {/* Primary Value */}
            <text x="0" y="44" className="ash-sans" fontSize="17.5" fontWeight="900" fill="#ffffff" letterSpacing="-0.2">paypal-verify...</text>

            {/* Subtitle */}
            <text x="0" y="68" className="ash-sans" fontSize="12" fontWeight="600" fill="#94a3b8">Brand Impersonation</text>

            {/* Right Chevron */}
            <text x="210" y="48" className="ash-sans" fontSize="18" fontWeight="700" fill="#94a3b8">›</text>
          </g>

          {/* Inner Divider */}
          <line x1="64" y1="116" x2="284" y2="116" stroke="#153654" strokeWidth="1.2" />
        </g>

        {/* ==================== STEP 3: URL TARGET ==================== */}
        <g transform="translate(0, 400)">
          {/* Circle Number 3 */}
          <circle cx="32" cy="30" r="16" fill="#0d243b" stroke="#ffffff" strokeWidth="2.2" />
          <text x="32" y="36" className="ash-sans" fontSize="14" fontWeight="900" fill="#ffffff" textAnchor="middle">3</text>

          {/* Content Box */}
          <g transform="translate(64, 16)">
            {/* Link Icon + Label + Badge */}
            <path d="M 0 7 L 3 10 A 3 3 0 0 0 7 6 L 5 4" fill="none" stroke="#94a3b8" strokeWidth="1.6" />
            <path d="M 8 3 L 5 0 A 3 3 0 0 0 1 4 L 3 6" fill="none" stroke="#94a3b8" strokeWidth="1.6" />
            <text x="24" y="10" className="ash-sans" fontSize="11.5" fontWeight="900" fill="#e2e8f0" letterSpacing="0.5">URL TARGET</text>

            {/* Suspicious Badge */}
            <rect x="110" y="-3" width="78" height="22" rx="5" fill="#2d1c06" stroke="#ffb800" strokeWidth="1.2" />
            <text x="149" y="12" className="ash-sans" fontSize="10" fontWeight="900" fill="#ffb800" textAnchor="middle">SUSPICIOUS</text>

            {/* Primary Value */}
            <text x="0" y="44" className="ash-sans" fontSize="17.5" fontWeight="900" fill="#ffffff" letterSpacing="-0.2">login-secure...</text>

            {/* Subtitle */}
            <text x="0" y="68" className="ash-sans" fontSize="12" fontWeight="600" fill="#94a3b8">Credential Harvester</text>

            {/* Right Chevron */}
            <text x="210" y="48" className="ash-sans" fontSize="18" fontWeight="700" fill="#94a3b8">›</text>
          </g>
        </g>

      </g>
    </svg>
  );
};
