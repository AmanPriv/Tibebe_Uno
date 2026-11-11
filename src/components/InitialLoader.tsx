import React, { useEffect, useState } from 'react';
import { MonogramIcon } from './MonogramIcon';
import { FIRM_INFO } from '../data/firmData';

export const InitialLoader: React.FC = () => {
  const [phase, setPhase] = useState<'converging' | 'fading' | 'done'>('converging');

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      setPhase('done');
      return;
    }

    const fadeTimer = window.setTimeout(() => {
      setPhase('fading');
    }, 950);

    const doneTimer = window.setTimeout(() => {
      setPhase('done');
    }, 1350);

    return () => {
      window.clearTimeout(fadeTimer);
      window.clearTimeout(doneTimer);
    };
  }, []);

  if (phase === 'done') {
    return null;
  }

  return (
    <div
      role="status"
      aria-label="Loading Tibebe Mengistu & Co."
      aria-live="polite"
      className={`fixed inset-0 z-100 flex flex-col items-center justify-center bg-[#F5EFE6] pointer-events-none select-none transition-opacity duration-400 ease-out ${
        phase === 'fading' ? 'opacity-0' : 'opacity-100'
      }`}
    >
      <div className="flex flex-col items-center px-6 text-center">
        {/* Animated TM Monogram Seal where T and M converge from left and right */}
        <div className="relative flex items-center justify-center rounded-xl p-1 shadow-md">
          <MonogramIcon variant="animated" className="h-24 w-24 sm:h-28 sm:w-28" />
        </div>

        {/* Firm Name & Tagline Fade-In as Letters Lock Together */}
        <p className="mt-5 font-serif text-xl sm:text-2xl font-semibold tracking-tight text-[#2B2118] tm-caption-reveal">
          {FIRM_INFO.name}
        </p>
        <p className="mt-1 text-xs font-medium tracking-widest uppercase text-[#6F5430] tm-caption-reveal">
          {FIRM_INFO.tagline}
        </p>

        {/* Subtle Bronze Ledger Line Sweep */}
        <div className="mt-5 h-[1.5px] w-36 overflow-hidden rounded-full bg-[#E8DCC8]">
          <div className="h-full w-full bg-[#8A6A3B] tm-progress-sweep" />
        </div>
      </div>
    </div>
  );
};
