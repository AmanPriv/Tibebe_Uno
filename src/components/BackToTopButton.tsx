import React, { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';
import { shouldShowBackToTop } from '../utils/validation';

export const BackToTopButton: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const evaluateVisibility = () => {
      const heroSection = document.getElementById('top');
      const footerEl = document.getElementById('site-footer');
      const headerHeight = 80;
      const heroThreshold = heroSection
        ? Math.max(200, heroSection.offsetTop + heroSection.offsetHeight - headerHeight)
        : 560;

      const pastHero = shouldShowBackToTop(window.scrollY, heroThreshold);

      // Hide the floating button when the footer enters the viewport so it never overlaps footer text
      let footerInView = false;
      if (footerEl) {
        const footerRect = footerEl.getBoundingClientRect();
        footerInView = footerRect.top < window.innerHeight - 16;
      }

      setIsVisible(pastHero && !footerInView);
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
      className={`fixed bottom-6 right-6 z-40 inline-flex h-9 w-9 sm:h-9 sm:w-auto sm:px-3.5 items-center justify-center gap-1.5 rounded-md border border-[#1F1B18]/[0.14] bg-[#FCFBF9]/95 text-[#1F1B18] cursor-pointer hover:bg-[#9E7B4F] hover:border-[#9E7B4F] hover:text-white transition-all duration-200 ease-out motion-reduce:transition-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1F1B18] ${
        isVisible
          ? 'opacity-100 translate-y-0 pointer-events-auto'
          : 'opacity-0 translate-y-2 pointer-events-none'
      }`}
    >
      <ArrowUp className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
      <span className="hidden sm:inline text-xs font-medium tracking-wide">Top</span>
    </button>
  );
};
