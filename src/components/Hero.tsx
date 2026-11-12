import React, { Suspense } from 'react';
import { ArrowRight, ShieldCheck, CheckCircle2, Lock } from 'lucide-react';
import { FIRM_INFO } from '../data/firmData';
import { ParallaxBackdrop } from './ParallaxBackdrop';

const HeroAssuranceScene = React.lazy(() => import('./HeroAssuranceScene'));

interface HeroProps {
  onRequestConsultation: () => void;
}

const HeroSceneFallback: React.FC = () => (
  <div
    aria-hidden="true"
    className="flex h-full w-full min-h-[280px] sm:min-h-[340px] flex-col items-center justify-center bg-gradient-to-b from-[#FBF8F3] via-[#F5EFE6] to-[#E8DCC8]/65 p-8 text-center"
  >
    <div className="relative flex h-20 w-20 items-center justify-center rounded-full border border-[#8A6A3B]/35 bg-[#FBF8F3] shadow-xs">
      <ShieldCheck className="h-9 w-9 text-[#8A6A3B]" aria-hidden="true" />
    </div>
    <p className="mt-4 font-serif text-base font-medium text-[#3B2F24]">
      {FIRM_INFO.name}
    </p>
    <p className="mt-1 text-xs text-[#5C4E40]">
      {FIRM_INFO.descriptor}
    </p>
  </div>
);

export const Hero: React.FC<HeroProps> = ({ onRequestConsultation }) => {
  return (
    <section
      id="top"
      aria-labelledby="hero-heading"
      className="relative overflow-hidden border-b border-[#E8DCC8] bg-[#F5EFE6] pt-10 pb-16 sm:pt-16 sm:pb-24 lg:pt-20 lg:pb-28"
    >
      <ParallaxBackdrop variant="sand" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-stretch lg:gap-12">
          {/* Left Column: Editorial Value Proposition */}
          <div className="flex flex-col justify-between lg:col-span-7 animate-fade-up">
            <div>
              {/* Quiet Unboxed Editorial Lead-In */}
              <div className="mb-5 flex flex-wrap items-center gap-2 text-xs sm:text-sm font-medium text-[#2F4A3A]">
                <span>{FIRM_INFO.descriptor}</span>
                <span aria-hidden="true" className="text-[#5C4E40]">·</span>
                <span className="text-[#5C4E40]">{FIRM_INFO.tagline}</span>
              </div>

              {/* Single H1 on the Page */}
              <h1
                id="hero-heading"
                className="font-serif text-3xl sm:text-5xl lg:text-[3.35rem] font-semibold tracking-tight text-[#2B2118] leading-[1.14] text-balance max-w-2xl"
              >
                Independent Audit, Tax, and Financial Assurance Built on Rigor.
              </h1>

              <p className="mt-6 text-base sm:text-lg text-[#5C4E40] leading-[1.65] max-w-[65ch]">
                Led by <strong className="font-medium text-[#2B2118]">{FIRM_INFO.principalName}</strong> ({FIRM_INFO.principalTitle}), {FIRM_INFO.name} delivers independent external audit, tax advisory, due diligence audit, company liquidation, and accounting services for businesses, NGOs, banks, and investors.
              </p>

              {/* Action Buttons */}
              <div className="mt-8 flex flex-col sm:flex-row sm:items-center gap-4">
                <a
                  href="#contact"
                  onClick={onRequestConsultation}
                  className="btn-3d-primary inline-flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap shrink-0 rounded-md bg-[#8A6A3B] px-6 py-3.5 text-sm sm:text-base font-medium text-white hover:bg-[#6F5430] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2B2118]"
                >
                  <span>Request a Consultation</span>
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </a>

                <a
                  href="#services"
                  className="btn-3d-secondary inline-flex items-center justify-center cursor-pointer whitespace-nowrap shrink-0 rounded-md border border-[#8A6A3B]/40 bg-[#FBF8F3] px-6 py-3.5 text-sm sm:text-base font-medium text-[#2B2118] hover:bg-[#E8DCC8]/60 hover:border-[#8A6A3B] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3B2F24]"
                >
                  Our Services
                </a>
              </div>
            </div>

            {/* Trust Strip */}
            <div className="mt-12 pt-8 border-t border-[#E8DCC8]">
              <dl className="grid grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-6">
                <div className="flex items-start gap-3">
                  <ShieldCheck className="h-5 w-5 text-[#2F4A3A] shrink-0 mt-0.5" aria-hidden="true" />
                  <div>
                    <dt className="text-sm font-semibold text-[#2B2118]">
                      FCCA (UK) &amp; Authorized Auditors
                    </dt>
                    <dd className="mt-0.5 text-xs text-[#5C4E40] leading-relaxed">
                      Chartered Certified Accountants (UK) &amp; Authorized Auditors in Ethiopia
                    </dd>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-[#2F4A3A] shrink-0 mt-0.5" aria-hidden="true" />
                  <div>
                    <dt className="text-sm font-semibold text-[#2B2118]">
                      Independent &amp; Objective
                    </dt>
                    <dd className="mt-0.5 text-xs text-[#5C4E40] leading-relaxed">
                      Principal-led attestations trusted by boards, banks, and donors
                    </dd>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Lock className="h-5 w-5 text-[#2F4A3A] shrink-0 mt-0.5" aria-hidden="true" />
                  <div>
                    <dt className="text-sm font-semibold text-[#2B2118]">
                      Strict Confidentiality
                    </dt>
                    <dd className="mt-0.5 text-xs text-[#5C4E40] leading-relaxed">
                      Disciplined custody of commercial, tax, liquidation, and payroll records
                    </dd>
                  </div>
                </div>
              </dl>
            </div>
          </div>

          {/* Right Column: Interactive 3D Financial Assurance Sculpture & Standards Ledger */}
          <div className="lg:col-span-5 flex flex-col">
            <div className="relative flex-1 overflow-hidden rounded-lg border border-[#E8DCC8] bg-[#FBF8F3] shadow-[0_14px_34px_-12px_rgba(43,33,24,0.12)] flex flex-col">
              <div
                aria-hidden="true"
                className="relative w-full flex-1 min-h-[280px] sm:min-h-[340px] overflow-hidden bg-gradient-to-b from-[#FBF8F3] via-[#F5EFE6] to-[#E8DCC8]/55"
              >
                <Suspense fallback={<HeroSceneFallback />}>
                  <HeroAssuranceScene />
                </Suspense>
              </div>

              {/* Editorial Standards & Practice Summary Footer inside Card */}
              <div className="p-6 sm:p-7 bg-[#FBF8F3] border-t border-[#E8DCC8]">
                <p className="font-serif text-lg font-semibold text-[#3B2F24]">
                  “Clarity. Integrity. Assurance.”
                </p>
                <p className="mt-2 text-xs sm:text-sm text-[#5C4E40] leading-relaxed">
                  Every external audit, tax advisory, due diligence, and company liquidation engagement is supervised directly by {FIRM_INFO.principalName}, {FIRM_INFO.principalTitle}.
                </p>
                <div className="mt-4 pt-4 border-t border-[#E8DCC8] flex flex-wrap items-center justify-between gap-2 text-xs text-[#5C4E40] tabular-nums">
                  <span>Standards: ISA · IFRS · IPSAS</span>
                  <span aria-hidden="true">·</span>
                  <span>Established {FIRM_INFO.yearEstablishedPlaceholder}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

