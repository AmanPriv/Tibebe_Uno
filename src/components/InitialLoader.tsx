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
    }, 2200);

    const doneTimer = window.setTimeout(() => {
      setPhase('done');
    }, 2850);

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
      aria-label={`Loading ${FIRM_INFO.name}`}
      aria-live="polite"
      className={`fixed inset-0 z-100 flex flex-col items-center justify-center bg-[#F8F6F2] pointer-events-none select-none transition-opacity duration-650 ease-in-out ${
        phase === 'fading' ? 'opacity-0' : 'opacity-100'
      }`}
    >
      <div className="flex flex-col items-center px-6 text-center">
        {/* Animated TM Monogram Seal where T and M converge from left and right */}
        <div className="relative flex items-center justify-center rounded-2xl border border-[#9E7B4F]/35 bg-[#FCFBF9] p-3 shadow-xs tm-crest-container">
          <MonogramIcon variant="animated" className="h-24 w-24 sm:h-28 sm:w-28 rounded-xl" />
        </div>

        {/* Firm Name, Descriptor & Tagline Reveal as Letters Lock Together */}
        <p className="mt-6 font-serif text-2xl sm:text-3xl font-semibold tracking-tight text-[#1F1B18] tm-caption-reveal">
          {FIRM_INFO.name}
        </p>
        <p className="mt-1.5 text-xs sm:text-sm font-medium text-[#5E5650] tm-subcaption-reveal">
          {FIRM_INFO.descriptor}
        </p>
        <p className="mt-2.5 text-[11px] font-semibold tracking-[0.2em] uppercase text-[#1D3B2F] tm-subcaption-reveal">
          {FIRM_INFO.tagline}
        </p>

        {/* Unhurried Brushed-Bronze Ledger Line Sweep */}
        <div className="mt-6 h-[1.5px] w-48 overflow-hidden rounded-full bg-[#1F1B18]/10">
          <div className="h-full w-full bg-[#9E7B4F] tm-progress-sweep" />
        </div>
      </div>
    </div>
  );
};
