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
import { Tilt3DCard } from './Tilt3DCard';
import { ScrollReveal3D } from './ScrollReveal3D';

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
      className="border-b border-[#E8DCC8] bg-[#E8DCC8]/35 py-16 sm:py-24"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <ScrollReveal3D className="max-w-3xl">
          <p className="text-xs sm:text-sm font-medium text-[#6F5430]">
            Sector Experience
          </p>
          <h2
            id="industries-heading"
            className="mt-2 font-serif text-2xl sm:text-4xl font-semibold tracking-tight text-[#3B2F24] text-balance"
          >
            Industries &amp; Institutions We Serve
          </h2>
          <p className="mt-4 text-base text-[#5C4E40] leading-[1.65] max-w-[65ch]">
            Different sectors face distinct regulatory reporting frameworks, donor conditions, and tax regimes. Our teams bring sector-specific familiarity to every assignment.
          </p>
        </ScrollReveal3D>

        <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {INDUSTRIES.map((industry, idx) => {
            const IconComponent = INDUSTRY_ICONS[industry.iconName];
            return (
              <ScrollReveal3D key={industry.id} delayMs={(idx % 4) * 55}>
                <Tilt3DCard
                  maxDegrees={6}
                  className="h-full flex flex-col rounded-lg border border-[#E8DCC8] bg-[#FBF8F3] p-6 hover:border-[#8A6A3B]/50"
                >
                  <div className="layer-3d-lift flex h-9 w-9 items-center justify-center rounded-md border border-[#E8DCC8] bg-[#F5EFE6] text-[#3B2F24] shadow-2xs">
                    <IconComponent className="h-4 w-4 text-[#6F5430]" aria-hidden="true" />
                  </div>
                  <h3 className="layer-3d-lift-sm mt-4 font-serif text-lg font-semibold text-[#2B2118]">
                    {industry.name}
                  </h3>
                  <p className="mt-2 text-sm text-[#5C4E40] leading-[1.6]">
                    {industry.focus}
                  </p>
                </Tilt3DCard>
              </ScrollReveal3D>
            );
          })}
        </div>
      </div>
    </section>
  );
};

