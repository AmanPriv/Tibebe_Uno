import React, { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';
import { shouldShowBackToTop } from '../utils/validation';

export const BackToTopButton: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const evaluateVisibility = () => {
      const heroSection = document.getElementById('top');
      const headerHeight = 80;
      const heroThreshold = heroSection
        ? Math.max(200, heroSection.offsetTop + heroSection.offsetHeight - headerHeight)
        : 560;

      setIsVisible(shouldShowBackToTop(window.scrollY, heroThreshold));
    };

    evaluateVisibility();
    window.addEventListener('scroll', evaluateVisibility, { passive: true });
    window.addEventListener('resize', evaluateVisibility, { passive: true });

    return () => {
      window.removeEventListener('scroll', evaluateVisibility);
      window.removeEventListener('resize', evaluateVisibility);
    };
  }, []);

  const handleScrollToTop = () => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({
      top: 0,
      behavior: prefersReducedMotion ? 'auto' : 'smooth',
    });
  };

  return (
    <button
      type="button"
      onClick={handleScrollToTop}
      aria-label="Back to top of page"
      aria-hidden={!isVisible}
      tabIndex={isVisible ? 0 : -1}
      className={`fixed bottom-6 right-6 z-40 inline-flex h-10 w-10 sm:h-10 sm:w-auto sm:px-3.5 items-center justify-center gap-1.5 rounded-md border border-[#8A6A3B]/45 bg-[#FBF8F3]/95 text-[#3B2F24] shadow-sm backdrop-blur-xs cursor-pointer hover:bg-[#8A6A3B] hover:border-[#8A6A3B] hover:text-white transition-all duration-200 ease-out motion-reduce:transition-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2B2118] ${
        isVisible
          ? 'opacity-100 translate-y-0 pointer-events-auto'
          : 'opacity-0 translate-y-2 pointer-events-none'
      }`}
    >
      <ArrowUp className="h-4 w-4 shrink-0" aria-hidden="true" />
      <span className="hidden sm:inline text-xs font-medium tracking-wide">Top</span>
    </button>
  );
};
