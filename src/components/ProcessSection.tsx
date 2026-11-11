import React from 'react';
import { PROCESS_STEPS } from '../data/firmData';

export const ProcessSection: React.FC = () => {
  return (
    <section
      id="process"
      aria-labelledby="process-heading"
      className="border-b border-[#E8DCC8] bg-[#F5EFE6] py-16 sm:py-24"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
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
        </div>

        {/* 4-Step Editorial Timeline */}
        <ol className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {PROCESS_STEPS.map((step, index) => (
            <li
              key={step.stepNumber}
              className="relative flex flex-col justify-between rounded-lg border border-[#E8DCC8] bg-[#FBF8F3] p-6 sm:p-7"
            >
              <div>
                {/* Timeline Step Header */}
                <div className="flex items-center justify-between gap-4 pb-4 border-b border-[#E8DCC8]">
                  <span className="font-serif text-2xl font-semibold text-[#6F5430] tabular-nums">
                    {step.stepNumber}
                  </span>
                  <span className="text-xs font-medium text-[#5C4E40]">
                    Stage {index + 1} of {PROCESS_STEPS.length}
                  </span>
                </div>

                <h3 className="mt-5 font-serif text-xl font-semibold text-[#2B2118]">
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
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
};
