import React from 'react';
import {
  HeartHandshake,
  Factory,
  Landmark,
  Sprout,
  Building2,
  Store,
  GraduationCap,
  Stethoscope,
} from 'lucide-react';
import { INDUSTRIES, IndustryItem } from '../data/firmData';

const INDUSTRY_ICONS: Record<IndustryItem['iconName'], React.ComponentType<{ className?: string }>> = {
  HeartHandshake,
  Factory,
  Landmark,
  Sprout,
  Building2,
  Store,
  GraduationCap,
  Stethoscope,
};

export const IndustriesSection: React.FC = () => {
  return (
    <section
      id="industries"
      aria-labelledby="industries-heading"
      className="section-veil-sand border-b border-[#1F1B18]/[0.08] py-16 sm:py-24"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <p className="text-[11px] sm:text-xs font-semibold uppercase tracking-[0.12em] text-[#1D3B2F]">
            Sector Experience
          </p>
          <h2
            id="industries-heading"
            className="mt-2.5 font-serif text-2xl sm:text-4xl font-semibold tracking-tight text-[#1F1B18] leading-[1.18] text-balance"
          >
            Industries &amp; Institutions We Serve
          </h2>
          <p className="mt-4 text-base text-[#5E5650] leading-[1.65] max-w-[65ch]">
            Different sectors face distinct regulatory reporting frameworks, donor conditions, and tax regimes. Our teams bring sector-specific familiarity to every assignment.
          </p>
        </div>

        {/* Minimal 4x2 Sector Grid */}
        <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {INDUSTRIES.map((industry, idx) => {
            const IconComponent = INDUSTRY_ICONS[industry.iconName];
            return (
              <div
                key={industry.id}
                className="surface-card-ivory h-full flex flex-col justify-between rounded-lg p-6 hover:border-[#9E7B4F] transition-colors duration-200"
              >
                <div>
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded border border-[#1F1B18]/[0.08] bg-[#FFFFFF] text-[#9E7B4F]">
                      <IconComponent className="h-4 w-4" aria-hidden="true" />
                    </div>
                    <span className="font-mono text-[11px] font-medium text-[#5E5650] tabular-nums">
                      0{idx + 1}
                    </span>
                  </div>
                  <h3 className="mt-4 font-serif text-lg font-semibold text-[#1F1B18] leading-snug">
                    {industry.name}
                  </h3>
                  <p className="mt-2 text-xs sm:text-sm text-[#5E5650] leading-[1.6]">
                    {industry.focus}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
