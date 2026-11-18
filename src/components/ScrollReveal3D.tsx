import React from 'react';

interface ScrollReveal3DProps {
  children: React.ReactNode;
  className?: string;
  delayMs?: number;
}

/**
 * Clean, zero-lag wrapper that renders section headings and cards 100% crisp
 * and immediately legible without sluggish scroll-fade or squish artifacts.
 */
export const ScrollReveal3D: React.FC<ScrollReveal3DProps> = ({
  children,
  className = '',
}) => {
  return <div className={className}>{children}</div>;
};
