import React from 'react';

interface MonogramIconProps {
  variant?: 'dark' | 'light' | 'animated';
  className?: string;
}

export const MonogramIcon: React.FC<MonogramIconProps> = ({
  variant = 'dark',
  className = 'h-10 w-10',
}) => {
  const isLight = variant === 'light';
  const isAnimated = variant === 'animated';

  const bgFill = isLight ? '#F5EFE6' : '#2B2118';
  const letterFill = isLight ? '#2B2118' : '#FBF8F3';
  const innerStroke = isLight ? '#8A6A3B' : '#E8DCC8';

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 64 64"
      fill="none"
      aria-hidden="true"
      className={`select-none ${className}`}
    >
      {/* Seal Base */}
      <rect width="64" height="64" rx="12" fill={bgFill} />

      {/* Outer Bronze Ledger Frame */}
      <rect
        x="5.5"
        y="5.5"
        width="53"
        height="53"
        rx="8.5"
        stroke="#8A6A3B"
        strokeWidth="1.5"
        strokeOpacity="0.88"
        className={isAnimated ? 'tm-frame-draw' : undefined}
      />

      {/* Inner Hairline Frame */}
      <rect
        x="8.5"
        y="8.5"
        width="47"
        height="47"
        rx="6"
        stroke={innerStroke}
        strokeWidth="0.6"
        strokeOpacity={isLight ? '0.45' : '0.28'}
      />

      {/* Top & Bottom Bronze Keystone Diamonds */}
      <path
        d="M32 3.5L34.5 6L32 8.5L29.5 6L32 3.5Z"
        fill="#8A6A3B"
        className={isAnimated ? 'tm-keystone-fade' : undefined}
      />
      <path
        d="M32 55.5L34.5 58L32 60.5L29.5 58L32 55.5Z"
        fill="#8A6A3B"
        className={isAnimated ? 'tm-keystone-fade' : undefined}
      />

      {/* Central Bronze Axis Pillar */}
      <line
        x1="29.5"
        y1="15"
        x2="29.5"
        y2="49"
        stroke="#8A6A3B"
        strokeWidth="1.2"
        strokeOpacity="0.7"
        className={isAnimated ? 'tm-axis-grow' : undefined}
      />

      {/* Sculpted Serif 'T' — Glides in from Left */}
      <g
        fill={letterFill}
        className={isAnimated ? 'tm-letter-t' : 'transition-transform duration-300 group-hover:translate-x-[0.5px]'}
      >
        <path d="M12.5 18H28.5V22.8H27.1C26.8 20.6 25.9 20.1 23.6 20.1H22.2V42.4C22.2 44.3 22.8 44.8 24.8 44.8V46.5H16.2V44.8C18.2 44.8 18.8 44.3 18.8 42.4V20.1H17.4C15.1 20.1 14.2 20.6 13.9 22.8H12.5V18Z" />
      </g>

      {/* Sculpted Serif 'M' — Glides in from Right */}
      <g
        fill={letterFill}
        className={isAnimated ? 'tm-letter-m' : 'transition-transform duration-300 group-hover:-translate-x-[0.5px]'}
      >
        <path d="M31.5 18H36.6L41.8 36.4L47.0 18H52.1V19.7C50.4 19.7 49.9 20.2 49.9 22.1V42.4C49.9 44.3 50.4 44.8 52.1 44.8V46.5H45.0V44.8C46.6 44.8 47.0 44.3 47.0 42.4V23.4L41.1 44.2H39.8L34.1 23.8V42.0C34.1 44.1 34.7 44.8 36.5 44.8V46.5H31.0V44.8C32.4 44.8 32.8 44.1 32.8 42.0V22.1C32.8 20.2 32.4 19.7 31.0 19.7V18H31.5Z" />
      </g>
    </svg>
  );
};
