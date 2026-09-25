import React from 'react';

interface PrintedDesiresLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'rose-gold' | 'gold' | 'monochrome';
}

export const PrintedDesiresLogo: React.FC<PrintedDesiresLogoProps> = ({
  className = '',
  size = 'md',
  variant = 'rose-gold',
}) => {
  const heights = {
    sm: 'h-8',
    md: 'h-10 sm:h-12',
    lg: 'h-14 sm:h-16',
    xl: 'h-20 sm:h-24',
  };

  // Luxury gradient definition:
  // Rose gold metallic (#B98989, #D4AFA0, #B99A62, #946868)
  const isRose = variant === 'rose-gold';

  return (
    <div
      className={`inline-flex items-center select-none group cursor-pointer ${className}`}
      title="Printed Desires | Fine Art Editions"
    >
      <svg
        viewBox="0 0 460 180"
        className={`${heights[size]} w-auto transition-transform duration-200 group-hover:scale-[1.02]`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ filter: 'drop-shadow(0 2px 5px rgba(18, 18, 18, 0.12))' }}
      >
        <defs>
          {/* Metallic Rose Gold Gradient matching user uploaded logo */}
          <linearGradient id="roseGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#C99B9B" />
            <stop offset="25%" stopColor="#E2C2B3" />
            <stop offset="50%" stopColor="#B98989" />
            <stop offset="75%" stopColor="#D8B5A4" />
            <stop offset="100%" stopColor="#8C5C5C" />
          </linearGradient>

          {/* Warm Antique Gold Gradient */}
          <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#D4B67D" />
            <stop offset="35%" stopColor="#F3E5C8" />
            <stop offset="70%" stopColor="#B99A62" />
            <stop offset="100%" stopColor="#8C6E38" />
          </linearGradient>

          {/* Deep dark / chocolate for drop depth */}
          <linearGradient id="bevelShade" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="rgba(255,255,255,0.4)" />
            <stop offset="100%" stopColor="rgba(23,21,19,0.5)" />
          </linearGradient>

          {/* Inner metallic glow */}
          <radialGradient id="apertureGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#F8F5F0" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#8C5C5C" stopOpacity="0" />
          </radialGradient>
        </defs>

        <g fill={isRose ? 'url(#roseGoldGrad)' : 'url(#goldGrad)'}>
          {/* Stylized 'P' with Camera Aperture Blades in its bowl */}
          <g transform="translate(18, 16)">
            {/* P Flourish Stem and Top Swash */}
            <path
              d="M18 10 C10 10 2 16 0 24 C-2 32 4 38 12 36 C8 32 8 26 14 20 C18 16 26 16 32 16 L32 78 C32 82 28 84 20 85 L20 90 L52 90 L52 85 C44 84 40 82 40 78 L40 50 C44 51 48 51 52 51 C76 51 92 38 92 24 C92 10 74 10 52 10 Z"
            />
            {/* Camera Shutter / Aperture ring inside the P */}
            <circle cx="52" cy="30" r="17" fill="none" stroke={isRose ? 'url(#roseGoldGrad)' : 'url(#goldGrad)'} strokeWidth="3" />
            
            {/* Aperture blades pattern */}
            <path d="M52 14 L57 26 L47 28 Z" fill={isRose ? '#A67373' : '#9E7E49'} opacity="0.9" />
            <path d="M67 25 L56 31 L58 39 Z" fill={isRose ? '#C99B9B' : '#C7A973'} opacity="0.85" />
            <path d="M62 44 L51 38 L43 45 Z" fill={isRose ? '#8C5C5C' : '#7D5F2E'} opacity="0.9" />
            <path d="M41 43 L48 33 L40 27 Z" fill={isRose ? '#B98989' : '#B99A62'} opacity="0.85" />
            <path d="M38 23 L49 26 L52 16 Z" fill={isRose ? '#E2C2B3' : '#DFCCA2'} opacity="0.75" />
            <circle cx="52" cy="30" r="4.5" fill="#F8F5F0" opacity="0.85" />
          </g>

          {/* "RINTED" Typography */}
          <text
            x="115"
            y="76"
            fontFamily="'Cormorant Garamond', Garamond, Georgia, serif"
            fontSize="74"
            fontWeight="500"
            letterSpacing="5"
          >
            RINTED
          </text>

          {/* "DESIRES" Typography */}
          <text
            x="20"
            y="142"
            fontFamily="'Cormorant Garamond', Garamond, Georgia, serif"
            fontSize="78"
            fontWeight="500"
            letterSpacing="8"
          >
            DESIRES
          </text>

          {/* Thin Hairline Divider */}
          <rect x="65" y="152" width="330" height="2" rx="1" opacity="0.85" />

          {/* "FINE ART EDITIONS" Subtitle */}
          <text
            x="230"
            y="173"
            fontFamily="'Cormorant Garamond', Garamond, Georgia, serif"
            fontSize="18"
            fontWeight="600"
            letterSpacing="7"
            textAnchor="middle"
          >
            FINE ART EDITIONS
          </text>
        </g>
      </svg>
    </div>
  );
};
