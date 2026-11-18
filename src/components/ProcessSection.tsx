import React, { useState } from 'react';
import { PROCESS_STEPS } from '../data/firmData';

interface ProcessSectionProps {
  activeStep?: number;
  onActiveStepChange?: (stepIndex: number) => void;
}

export const ProcessSection: React.FC<ProcessSectionProps> = ({
  activeStep,
  onActiveStepChange,
}) => {
  // Default highlight on Stage 04 — Report & Advise (index 3) as specified
  const [internalActive, setInternalActive] = useState<number>(3);
  const currentActive = activeStep !== undefined ? activeStep : internalActive;

  const updateStep = (idx: number) => {
    setInternalActive(idx);
    onActiveStepChange?.(idx);
  };

  return (
    <section
      id="process"
      aria-labelledby="process-heading"
      className="section-veil-alabaster border-b border-[#1F1B18]/[0.08] py-16 sm:py-24"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <p className="text-[11px] sm:text-xs font-semibold uppercase tracking-[0.12em] text-[#1D3B2F]">
            How We Work · Methodology
          </p>
          <h2
            id="process-heading"
            className="mt-2.5 font-serif text-2xl sm:text-4xl font-semibold tracking-tight text-[#1F1B18] leading-[1.18] text-balance"
          >
            A Disciplined Four-Stage Engagement Process
          </h2>
          <p className="mt-4 text-base text-[#5E5650] leading-[1.65] max-w-[65ch]">
            Our audit and advisory methodology is structured to provide thorough verification while respecting your management team’s operational schedule.
          </p>
        </div>

        {/* Sleek Horizontal 4-Column Step Rail with Continuous Hairline Connector */}
        <div className="relative mt-12">
          {/* Continuous Horizontal Hairline Connector on Desktop */}
          <div
            aria-hidden="true"
            className="hidden lg:block absolute top-8 left-8 right-8 h-px bg-[#1F1B18]/[0.12]"
          />

          <ol className="relative grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            {PROCESS_STEPS.map((step, index) => {
              const isStageFour = index === 3;
              const isActive = currentActive === index;
              const isHighlighted = isStageFour || isActive;

              return (
                <li
                  key={step.stepNumber}
                  onMouseEnter={() => updateStep(index)}
                  className="h-full"
                >
                  <article
                    className={`surface-card-ivory h-full flex flex-col justify-between rounded-lg p-6 transition-colors duration-200 ${
                      isStageFour
                        ? 'border-[#1D3B2F]/45'
                        : isHighlighted
                          ? 'border-[#9E7B4F]'
                          : 'border-[#1F1B18]/[0.08] hover:border-[#9E7B4F]/60'
                    }`}
                  >
                    <div>
                      {/* Step Marker Header */}
                      <div className="flex items-center justify-between gap-4 pb-4 border-b border-[#1F1B18]/[0.08]">
                        <span
                          className={`inline-flex h-8 w-8 items-center justify-center rounded border font-mono text-xs font-semibold tabular-nums transition-colors duration-200 ${
                            isStageFour
                              ? 'border-[#1D3B2F] bg-[#1D3B2F] text-[#FFFFFF]'
                              : isActive
                                ? 'border-[#9E7B4F] bg-[#9E7B4F] text-[#FFFFFF]'
                                : 'border-[#1F1B18]/[0.12] bg-[#F8F6F2] text-[#1F1B18]'
                          }`}
                        >
                          {step.stepNumber}
                        </span>
                        <span className="font-mono text-[11px] font-medium text-[#5E5650] tabular-nums">
                          Stage 0{index + 1} / 0{PROCESS_STEPS.length}
                        </span>
                      </div>

                      <h3 className="mt-5 font-serif text-xl font-semibold text-[#1F1B18]">
                        {step.title}
                      </h3>
                      <p className="mt-1 text-xs font-medium text-[#1D3B2F]">
                        {step.subtitle}
                      </p>

                      <p className="mt-3 text-sm text-[#5E5650] leading-[1.65]">
                        {step.description}
                      </p>
                    </div>

                    <div className="mt-6 pt-4 border-t border-[#1F1B18]/[0.08]">
                      <p className="text-[10.5px] font-semibold uppercase tracking-[0.08em] text-[#1F1B18]">
                        Stage Outputs
                      </p>
                      <p className="mt-1 text-xs text-[#5E5650] leading-relaxed">
                        {step.deliverables}
                      </p>
                    </div>
                  </article>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
};
