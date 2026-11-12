import React, { useEffect, useState } from 'react';

interface ParallaxBackdropProps {
  variant?: 'sand' | 'bronze';
}

export const ParallaxBackdrop: React.FC<ParallaxBackdropProps> = ({ variant = 'sand' }) => {
  const [scrollY, setScrollY] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mq.matches);
    if (mq.matches) return;

    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setScrollY(window.scrollY);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const slowOffset = reducedMotion ? 0 : Math.round((scrollY % 1800) * 0.035);
  const reverseOffset = reducedMotion ? 0 : Math.round((scrollY % 1800) * -0.025);

  return (
    <div
      aria-hidden="true"
      className="hidden lg:block pointer-events-none absolute inset-0 overflow-hidden select-none z-0"
    >
      {/* Subtle Isometric Octagonal Ledger Frame (Outer Top Right Margin) */}
      <svg
        viewBox="0 0 240 240"
        fill="none"
        style={{
          transform: `translate3d(0, ${slowOffset}px, 0) rotate(${variant === 'sand' ? 12 : -8}deg)`,
        }}
        className="absolute -top-20 -right-24 h-72 w-72 opacity-[0.12] transition-transform duration-150 ease-out"
      >
        <polygon
          points="72,12 168,12 228,72 228,168 168,228 72,228 12,168 12,72"
          stroke="#8A6A3B"
          strokeWidth="1.2"
        />
        <polygon
          points="82,32 158,32 208,82 208,158 158,208 82,208 32,158 32,82"
          stroke="#3B2F24"
          strokeWidth="0.7"
          strokeDasharray="4 4"
        />
        <circle cx="120" cy="120" r="46" stroke="#8A6A3B" strokeWidth="0.9" />
      </svg>

      {/* Subtle Layered Geometric Diamond & Ring Form (Outer Bottom Left Margin) */}
      <svg
        viewBox="0 0 220 220"
        fill="none"
        style={{
          transform: `translate3d(0, ${reverseOffset}px, 0)`,
        }}
        className="absolute -bottom-24 -left-24 h-64 w-64 opacity-[0.11] transition-transform duration-150 ease-out"
      >
        <rect
          x="38"
          y="38"
          width="144"
          height="144"
          rx="14"
          transform="rotate(18 110 110)"
          stroke="#8A6A3B"
          strokeWidth="1.1"
        />
        <rect
          x="56"
          y="56"
          width="108"
          height="108"
          rx="10"
          transform="rotate(45 110 110)"
          stroke="#3B2F24"
          strokeWidth="0.75"
        />
      </svg>
    </div>
  );
};
