import React, { useEffect, useRef, useState } from 'react';
import { PROCESS_STEPS } from '../data/firmData';
import { ScrollReveal3D } from './ScrollReveal3D';
import { Tilt3DCard } from './Tilt3DCard';

export const ProcessSection: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const stepRefs = useRef<(HTMLLIElement | null)[]>([]);

  useEffect(() => {
    const elements = stepRefs.current.filter(Boolean) as HTMLLIElement[];
    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const idx = Number(entry.target.getAttribute('data-step-index') || '0');
            setActiveIndex(idx);
          }
        });
      },
      { threshold: 0.45 }
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="process"
      aria-labelledby="process-heading"
      className="border-b border-[#E8DCC8] bg-[#F5EFE6] py-16 sm:py-24"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <ScrollReveal3D className="max-w-3xl">
          <p className="text-xs sm:text-sm font-medium text-[#6F5430]">
            How We Work · Methodology
          </p>
          <h2
            id="process-heading"
            className="mt-2 font-serif text-2xl sm:text-4xl font-semibold tracking-tight text-[#3B2F24] text-balance"
          >
            A Disciplined Four-Stage Engagement Process
          </h2>
          <p className="mt-4 text-base text-[#5C4E40] leading-[1.65] max-w-[65ch]">
            Our audit and advisory methodology is structured to provide thorough verification while respecting your management team’s operational schedule.
          </p>
        </ScrollReveal3D>

        {/* 4-Step Editorial Timeline with 3D Raising Step Markers */}
        <ol className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {PROCESS_STEPS.map((step, index) => {
            const isActive = activeIndex === index;
            return (
              <li
                key={step.stepNumber}
                ref={(el) => {
                  stepRefs.current[index] = el;
                }}
                data-step-index={index}
                onMouseEnter={() => setActiveIndex(index)}
                className="h-full"
              >
                <ScrollReveal3D delayMs={index * 70} className="h-full">
                  <Tilt3DCard
                    maxDegrees={5.5}
                    className={`group relative h-full flex flex-col justify-between rounded-lg border p-6 sm:p-7 transition-colors duration-250 ${
                      isActive
                        ? 'border-[#8A6A3B] bg-[#FBF8F3]'
                        : 'border-[#E8DCC8] bg-[#FBF8F3] hover:border-[#8A6A3B]/60'
                    }`}
                  >
                    <div>
                      {/* Timeline Step Header with 3D Step Marker */}
                      <div className="layer-3d-lift flex items-center justify-between gap-4 pb-4 border-b border-[#E8DCC8]">
                        <span
                          className={`inline-flex h-11 w-11 items-center justify-center rounded-md border font-serif text-lg font-semibold tabular-nums transition-all duration-300 ease-out ${
                            isActive
                              ? '-translate-y-1 bg-[#8A6A3B] text-white border-[#6F5430] shadow-[0_3px_0_0_#4A361C,0_10px_18px_-4px_rgba(59,47,36,0.32)]'
                              : 'bg-[#F5EFE6] text-[#6F5430] border-[#E8DCC8] shadow-[0_2px_0_0_#D5C4A8] group-hover:-translate-y-0.5 group-hover:border-[#8A6A3B]/60'
                          }`}
                        >
                          {step.stepNumber}
                        </span>
                        <span className="text-xs font-medium text-[#5C4E40]">
                          Stage {index + 1} of {PROCESS_STEPS.length}
                        </span>
                      </div>

                      <h3 className="layer-3d-lift-sm mt-5 font-serif text-xl font-semibold text-[#2B2118]">
                        {step.title}
                      </h3>
                      <p className="mt-1 text-xs font-medium text-[#2F4A3A]">
                        {step.subtitle}
                      </p>

                      <p className="mt-3 text-sm text-[#5C4E40] leading-[1.6]">
                        {step.description}
                      </p>
                    </div>

                    <div className="mt-6 pt-4 border-t border-[#E8DCC8]/70">
                      <p className="text-[11px] font-semibold text-[#3B2F24]">
                        Stage Outputs
                      </p>
                      <p className="mt-1 text-xs text-[#5C4E40] leading-relaxed">
                        {step.deliverables}
                      </p>
                    </div>
                  </Tilt3DCard>
                </ScrollReveal3D>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
};

