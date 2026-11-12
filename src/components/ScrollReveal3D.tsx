import React, { useEffect, useRef, useState } from 'react';

interface ScrollReveal3DProps {
  children: React.ReactNode;
  className?: string;
  delayMs?: number;
}

export const ScrollReveal3D: React.FC<ScrollReveal3DProps> = ({
  children,
  className = '',
  delayMs = 0,
}) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const [isVisible, setIsVisible] = useState(true);
  const [animateReady, setAnimateReady] = useState(false);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      setIsVisible(true);
      return;
    }

    const el = ref.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    // If already within or above the viewport on mount, keep visible immediately
    if (rect.top < window.innerHeight * 0.92) {
      setIsVisible(true);
      return;
    }

    setIsVisible(false);
    setAnimateReady(true);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -30px 0px' }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const style: React.CSSProperties | undefined = animateReady
    ? {
        transitionDelay: delayMs > 0 ? `${delayMs}ms` : undefined,
        transform: isVisible
          ? 'perspective(900px) translateY(0px) rotateX(0deg)'
          : 'perspective(900px) translateY(18px) rotateX(6deg)',
        opacity: isVisible ? 1 : 0,
      }
    : undefined;

  return (
    <div
      ref={ref}
      style={style}
      className={`transition-[transform,opacity] duration-300 ease-out motion-reduce:transition-none motion-reduce:transform-none ${className}`}
    >
      {children}
    </div>
  );
};
