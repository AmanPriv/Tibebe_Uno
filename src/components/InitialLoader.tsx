import React, { useEffect, useState } from 'react';
import { MonogramIcon } from './MonogramIcon';
import { FIRM_INFO } from '../data/firmData';

interface InitialLoaderProps {
  sceneReady?: boolean;
}

export const InitialLoader: React.FC<InitialLoaderProps> = ({ sceneReady = true }) => {
  const [minDelayPassed, setMinDelayPassed] = useState(false);
  const [phase, setPhase] = useState<'converging' | 'fading' | 'done'>(() => {
    try {
      if (sessionStorage.getItem('tm_loader_seen_v2') === '1') {
        return 'done';
      }
    } catch {
      // ignore
    }
    return 'converging';
  });

  useEffect(() => {
    if (phase === 'done') return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      setPhase('done');
      return;
    }

    const timer = window.setTimeout(() => {
      setMinDelayPassed(true);
    }, 2200);

    return () => window.clearTimeout(timer);
  }, [phase]);

  useEffect(() => {
    if (phase === 'done') return;
    if (minDelayPassed && sceneReady) {
      setPhase('fading');
      const doneTimer = window.setTimeout(() => {
        try {
          sessionStorage.setItem('tm_loader_seen_v2', '1');
        } catch {
          // ignore
        }
        setPhase('done');
      }, 650);
      return () => window.clearTimeout(doneTimer);
    }
  }, [minDelayPassed, sceneReady, phase]);

  if (phase === 'done') {
    return null;
  }

  return (
    <div
      role="status"
      aria-label="Loading Tibebe Mengistu"
      aria-live="polite"
      className={`fixed inset-0 z-100 flex flex-col items-center justify-center bg-[#F7F3EC] pointer-events-none select-none transition-opacity duration-700 ease-in-out ${
        phase === 'fading' ? 'opacity-0' : 'opacity-100'
      }`}
    >
      <div className="flex flex-col items-center px-6 text-center">
        {/* Animated TM Monogram Seal where T and M converge unhurriedly from left and right */}
        <div className="relative flex items-center justify-center rounded-2xl border border-[#A68352]/30 bg-[#FBF8F3] p-2.5 shadow-sm tm-crest-container">
          <MonogramIcon variant="animated" className="h-24 w-24 sm:h-28 sm:w-28 rounded-xl" />
        </div>

        {/* Firm Name, Descriptor & Tagline Reveal as Letters Lock Together */}
        <p className="mt-6 font-serif text-2xl sm:text-3xl font-semibold tracking-tight text-[#241F1C] tm-caption-reveal">
          {FIRM_INFO.name}
        </p>
        <p className="mt-1.5 text-xs sm:text-sm font-medium text-[#5C4E40] tm-subcaption-reveal">
          {FIRM_INFO.descriptor}
        </p>
        <p className="mt-2 text-[11px] font-semibold tracking-[0.2em] uppercase text-[#A68352] tm-subcaption-reveal">
          {FIRM_INFO.tagline}
        </p>

        {/* Unhurried Bronze Ledger Line Sweep */}
        <div className="mt-6 h-[1.5px] w-44 overflow-hidden rounded-full bg-[#EFE8DC]">
          <div className="h-full w-full bg-[#A68352] tm-progress-sweep" />
        </div>
      </div>
    </div>
  );
};

