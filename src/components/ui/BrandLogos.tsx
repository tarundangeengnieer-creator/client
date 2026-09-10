import React from 'react';

interface LogoProps {
  className?: string;
  size?: number | string;
}

/**
 * Official Google Gmail Logo (Multi-color Google Workspace Envelope)
 */
export const OfficialGmailLogo: React.FC<LogoProps> = ({ className = 'w-5 h-5' }) => (
  <svg
    className={className}
    viewBox="20 45 216 165"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-label="Official Google Gmail Logo"
  >
    {/* Left blue pillar */}
    <path
      d="M41.6364 203.028H73.4545V125.755L28 91.6646V189.392C28 196.937 34.1136 203.028 41.6364 203.028Z"
      fill="#4285F4"
    />
    {/* Right green pillar */}
    <path
      d="M182.545 203.028H214.364C221.909 203.028 228 196.915 228 189.392V91.6646L182.545 125.755V203.028Z"
      fill="#34A853"
    />
    {/* Right yellow corner */}
    <path
      d="M182.545 66.6643V125.755L228 91.6643V73.4825C228 56.6189 208.75 47.0052 195.273 57.1189L182.545 66.6643Z"
      fill="#FBBC04"
    />
    {/* Center red V fold */}
    <path
      d="M73.4545 125.755V66.6646L128 107.574L182.545 66.6646V125.755L128 166.665L73.4545 125.755Z"
      fill="#EA4335"
    />
    {/* Left dark red / crimson corner */}
    <path
      d="M28 73.4825V91.6643L73.4545 125.755V66.6643L60.7273 57.1189C47.2273 47.0052 28 56.6189 28 73.4825Z"
      fill="#C5221F"
    />
  </svg>
);

/**
 * Official Microsoft Logo (4-color corporate quad symbol)
 */
export const OfficialMicrosoftLogo: React.FC<LogoProps> = ({ className = 'w-5 h-5' }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-label="Official Microsoft Logo"
  >
    {/* Top-Left Red Square */}
    <rect x="1.5" y="1.5" width="9.8" height="9.8" fill="#F25022" rx="0.5" />
    {/* Top-Right Green Square */}
    <rect x="12.7" y="1.5" width="9.8" height="9.8" fill="#7FBA00" rx="0.5" />
    {/* Bottom-Left Blue Square */}
    <rect x="1.5" y="12.7" width="9.8" height="9.8" fill="#00A4EF" rx="0.5" />
    {/* Bottom-Right Yellow Square */}
    <rect x="12.7" y="12.7" width="9.8" height="9.8" fill="#FFB900" rx="0.5" />
  </svg>
);

/**
 * Official Microsoft Outlook Logo (Modern Blue Envelope / O icon)
 */
export const OfficialOutlookLogo: React.FC<LogoProps> = ({ className = 'w-5 h-5' }) => (
  <svg
    className={className}
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-label="Official Microsoft Outlook Logo"
  >
    <path
      d="M18.5 6H29.5C30.3284 6 31 6.67157 31 7.5V24.5C31 25.3284 30.3284 26 29.5 26H18.5V6Z"
      fill="#0078D4"
    />
    <path
      d="M18.5 13L25 18L31 13.5V7.5C31 6.67157 30.3284 6 29.5 6H18.5V13Z"
      fill="#28A8EA"
    />
    <path
      d="M18.5 6L25 11.5L31 7.5L25 2.5L18.5 6Z"
      fill="#50E6FF"
      opacity="0.6"
    />
    <rect
      x="1"
      y="7"
      width="18"
      height="18"
      rx="3"
      fill="#0078D4"
    />
    <circle
      cx="10"
      cy="16"
      r="5"
      stroke="white"
      strokeWidth="2.5"
      fill="none"
    />
  </svg>
);
