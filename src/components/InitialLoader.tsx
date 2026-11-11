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
    }, 2500);

    const doneTimer = window.setTimeout(() => {
      setPhase('done');
    }, 3200);

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
      className={`fixed inset-0 z-100 flex flex-col items-center justify-center bg-[#F5EFE6] pointer-events-none select-none transition-opacity duration-700 ease-in-out ${
        phase === 'fading' ? 'opacity-0' : 'opacity-100'
      }`}
    >
      <div className="flex flex-col items-center px-6 text-center">
        {/* Animated TM Monogram Seal where T and M converge unhurriedly from left and right */}
        <div className="relative flex items-center justify-center rounded-2xl border border-[#8A6A3B]/25 bg-[#FBF8F3] p-2.5 shadow-sm tm-crest-container">
          <MonogramIcon variant="animated" className="h-24 w-24 sm:h-28 sm:w-28 rounded-xl" />
        </div>

        {/* Firm Name, Descriptor & Tagline Reveal as Letters Lock Together */}
        <p className="mt-6 font-serif text-2xl sm:text-3xl font-semibold tracking-tight text-[#2B2118] tm-caption-reveal">
          {FIRM_INFO.name}
        </p>
        <p className="mt-1.5 text-xs sm:text-sm font-medium text-[#5C4E40] tm-subcaption-reveal">
          {FIRM_INFO.descriptor}
        </p>
        <p className="mt-2 text-[11px] font-semibold tracking-[0.2em] uppercase text-[#6F5430] tm-subcaption-reveal">
          {FIRM_INFO.tagline}
        </p>

        {/* Unhurried Bronze Ledger Line Sweep */}
        <div className="mt-6 h-[1.5px] w-44 overflow-hidden rounded-full bg-[#E8DCC8]">
          <div className="h-full w-full bg-[#8A6A3B] tm-progress-sweep" />
        </div>
      </div>
    </div>
  );
};
