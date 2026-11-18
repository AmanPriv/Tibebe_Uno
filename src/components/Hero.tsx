import React, { useCallback } from 'react';
import { ArrowRight, ShieldCheck, CheckCircle2, Lock } from 'lucide-react';
import { FIRM_INFO } from '../data/firmData';
import { MonogramIcon } from './MonogramIcon';

interface HeroProps {
  onRequestConsultation: () => void;
}

const REGULATORY_BADGES = [
  { code: 'FCCA (UK)', shortLabel: 'UK Chartered', label: 'Fellow Chartered Certified Accountant' },
  { code: 'ISA', shortLabel: 'Audit Standards', label: 'International Standards on Auditing' },
  { code: 'IFRS', shortLabel: 'Financial Reporting', label: 'International Financial Reporting Standards' },
  { code: 'IPSAS', shortLabel: 'Public Sector', label: 'Public Sector Accounting Standards' },
  { code: 'IESBA', shortLabel: 'Ethics Code', label: 'International Code of Ethics' },
];

export const Hero: React.FC<HeroProps> = ({ onRequestConsultation }) => {
  const attachHeroCardComments = useCallback((node: HTMLElement | null) => {
    if (!node || !node.parentNode) return;
    const prev = node.previousSibling;
    if (
      prev &&
      prev.nodeType === Node.COMMENT_NODE &&
      prev.nodeValue?.includes('HERO CARD IMAGE')
    ) {
      return;
    }
    const c1 = document.createComment(' HERO CARD IMAGE ');
    node.parentNode.insertBefore(c1, node);
  }, []);

  return (
    <section
      id="hero"
      aria-labelledby="hero-heading"
      className="hero-scrim-veil relative border-b border-[#1F1B18]/[0.08] pt-10 pb-14 sm:pt-14 sm:pb-18 lg:pt-16 lg:pb-20"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-stretch lg:gap-12">
          {/* Left Column: Editorial Value Proposition */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            {/* Uppercase Forest-Green Eyebrow */}
            <div className="mb-4 flex flex-wrap items-center gap-2 text-[11px] sm:text-xs font-semibold uppercase tracking-[0.1em] text-[#1D3B2F]">
              <span>{FIRM_INFO.descriptor}</span>
              <span aria-hidden="true" className="text-[#9E7B4F]">·</span>
              <span className="text-[#5E5650]">{FIRM_INFO.tagline}</span>
            </div>

            {/* Primary H1 */}
            <h1
              id="hero-heading"
              className="font-serif text-3xl sm:text-5xl lg:text-[3.25rem] font-semibold tracking-tight text-[#1F1B18] leading-[1.13] text-balance max-w-2xl"
            >
              Independent Audit, Tax, and Financial Assurance Built on Rigor.
            </h1>

            <p className="mt-5 text-base sm:text-lg text-[#5E5650] leading-[1.65] max-w-[62ch]">
              Led by <strong className="font-medium text-[#1F1B18]">{FIRM_INFO.principalName}</strong> ({FIRM_INFO.principalTitle}), {FIRM_INFO.name} delivers independent external audit, tax advisory, due diligence audit, company liquidation, and accounting services for businesses, NGOs, banks, and investors.
            </p>

            {/* Primary & Secondary CTAs */}
            <div className="mt-8 flex flex-col sm:flex-row sm:items-center gap-3.5">
              <a
                href="#contact"
                onClick={onRequestConsultation}
                className="btn-executive-primary inline-flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap shrink-0 rounded-md px-6 py-3.5 text-sm font-medium focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1F1B18]"
              >
                <span>Request a Consultation</span>
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </a>

              <a
                href="#services"
                className="btn-executive-secondary inline-flex items-center justify-center cursor-pointer whitespace-nowrap shrink-0 rounded-md px-6 py-3.5 text-sm font-medium focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1F1B18]"
              >
                Our Services
              </a>
            </div>
          </div>

          {/* Right Column: High-Impact Editorial Hero Card (16:10 Executive Boardroom Photo + Attestation Footer) */}
          <div className="lg:col-span-5">
            <aside
              aria-label="Practice Credentials and Principal Supervision"
              className="surface-card-ivory flex h-full flex-col overflow-hidden rounded-lg"
            >
              {/* Upper Image Frame: 16:10 Aspect Ratio, Full Width, #E8E0D4 Fallback */}
              <div
                style={{ aspectRatio: '16 / 10', backgroundColor: '#E8E0D4' }}
                className="relative w-full shrink-0 overflow-hidden bg-[#E8E0D4]"
              >
                {/* <!-- HERO CARD IMAGE --> */}
                <img
                  ref={attachHeroCardComments}
                  src="https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1600&q=80"
                  alt="Modern executive boardroom and minimalist architectural glass interior"
                  fetchPriority="high"
                  decoding="async"
                  style={{ aspectRatio: '16 / 10', width: '100%', objectFit: 'cover', backgroundColor: '#E8E0D4' }}
                  className="editorial-photo h-full w-full object-cover object-center"
                />

                {/* Subtle Warm-Espresso Editorial Tint & Clean Bottom Gradient Fade into #FFFFFF */}
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#1F1B18]/40 via-[#1F1B18]/10 to-[#FFFFFF]"
                />

                {/* Top Institutional Seal Overlay */}
                <div className="absolute inset-x-0 top-0 flex items-center justify-between gap-3 p-4 sm:p-5">
                  <div className="inline-flex items-center gap-2.5 rounded-md border border-[#FCFBF9]/25 bg-[#1F1B18]/80 px-3 py-1.5 backdrop-blur-xs">
                    <MonogramIcon
                      variant="dark"
                      className="h-6 w-6 shrink-0"
                    />
                    <span className="font-serif text-xs font-medium tracking-wide text-[#FCFBF9]">
                      {FIRM_INFO.name}
                    </span>
                  </div>

                  <span className="rounded border border-[#FCFBF9]/25 bg-[#1F1B18]/80 px-2.5 py-1 font-mono text-[11px] font-medium text-[#F8F6F2] backdrop-blur-xs tabular-nums">
                    FCCA · UK / ET
                  </span>
                </div>
              </div>

              {/* Lower Attestation Quote, Supervision Note & Clean Space-Between Metadata Footer */}
              <div className="flex flex-1 flex-col justify-between bg-[#FFFFFF]">
                <div className="px-6 pt-4 pb-5">
                  <p className="font-serif text-xl sm:text-2xl font-semibold text-[#1F1B18]">
                    “Clarity. Integrity. Assurance.”
                  </p>
                  <p className="mt-2 text-xs sm:text-sm text-[#5E5650] leading-[1.65]">
                    Every external audit, tax advisory, due diligence, and company liquidation engagement is supervised directly by <strong className="font-medium text-[#1F1B18]">{FIRM_INFO.principalName}</strong>, {FIRM_INFO.principalTitle}.
                  </p>
                </div>

                {/* Clean Space-Between Metadata Footer (Zero Floating Dot) */}
                <div className="flex flex-wrap items-center justify-between gap-4 border-t border-[#1F1B18]/[0.08] bg-[#FCFBF9] px-6 py-3.5 text-xs">
                  <div>
                    <span className="text-[11px] font-medium uppercase tracking-[0.06em] text-[#5E5650]">
                      Standards:{' '}
                    </span>
                    <strong className="font-mono font-semibold text-[#1F1B18] tabular-nums">
                      ISA · IFRS · IPSAS
                    </strong>
                  </div>
                  <div>
                    <span className="text-[11px] font-medium uppercase tracking-[0.06em] text-[#5E5650]">
                      Established{' '}
                    </span>
                    <strong className="font-mono font-semibold text-[#1F1B18] tabular-nums">
                      {FIRM_INFO.yearEstablishedPlaceholder}
                    </strong>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </div>

        {/* Sleek 3-Column Trust Bar + Minimalist Regulatory Credential Seals */}
        <div className="mt-12 pt-7 border-t border-[#1F1B18]/[0.10]">
          <dl className="grid grid-cols-1 gap-8 sm:grid-cols-3 sm:gap-8">
            <div className="border-t border-[#1F1B18]/[0.12] pt-4 sm:border-t-0 sm:pt-0">
              <div className="flex items-start gap-3">
                <ShieldCheck className="h-4 w-4 text-[#1D3B2F] shrink-0 mt-0.5" aria-hidden="true" />
                <div>
                  <dt className="text-sm font-semibold text-[#1F1B18]">
                    FCCA (UK) &amp; Authorized Auditors
                  </dt>
                  <dd className="mt-1 text-xs text-[#5E5650] leading-relaxed">
                    Chartered Certified Accountants (UK) &amp; Authorized Auditors in Ethiopia
                  </dd>
                </div>
              </div>
            </div>

            <div className="border-t border-[#1F1B18]/[0.12] pt-4 sm:border-t-0 sm:border-l sm:border-[#1F1B18]/[0.10] sm:pl-8 sm:pt-0">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-4 w-4 text-[#1D3B2F] shrink-0 mt-0.5" aria-hidden="true" />
                <div>
                  <dt className="text-sm font-semibold text-[#1F1B18]">
                    Independent &amp; Objective
                  </dt>
                  <dd className="mt-1 text-xs text-[#5E5650] leading-relaxed">
                    Principal-led attestations trusted by boards, banks, and donors
                  </dd>
                </div>
              </div>
            </div>

            <div className="border-t border-[#1F1B18]/[0.12] pt-4 sm:border-t-0 sm:border-l sm:border-[#1F1B18]/[0.10] sm:pl-8 sm:pt-0">
              <div className="flex items-start gap-3">
                <Lock className="h-4 w-4 text-[#1D3B2F] shrink-0 mt-0.5" aria-hidden="true" />
                <div>
                  <dt className="text-sm font-semibold text-[#1F1B18]">
                    Strict Confidentiality
                  </dt>
                  <dd className="mt-1 text-xs text-[#5E5650] leading-relaxed">
                    Disciplined custody of commercial, tax, liquidation, and payroll records
                  </dd>
                </div>
              </div>
            </div>
          </dl>

          {/* Institutional Authority Strip: Minimalist Typographic Seals (FCCA (UK), ISA, IFRS, IPSAS, IESBA) */}
          <div
            aria-label="Global Regulatory and Accounting Standards"
            className="mt-7 flex flex-col gap-3 border-t border-[#1F1B18]/[0.10] pt-5 lg:flex-row lg:items-center lg:justify-between"
          >
            <span className="shrink-0 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#1D3B2F]">
              Regulatory &amp; Technical Frameworks
            </span>

            <ul className="flex flex-wrap items-center gap-2">
              {REGULATORY_BADGES.map((badge) => (
                <li
                  key={badge.code}
                  title={badge.label}
                  className="surface-card-ivory inline-flex items-center gap-2 rounded px-3 py-1.5"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-[#9E7B4F]" aria-hidden="true" />
                  <span className="font-mono text-[11px] font-semibold tracking-wider text-[#1F1B18]">
                    {badge.code}
                  </span>
                  <span className="hidden sm:inline text-[11px] text-[#5E5650] border-l border-[#1F1B18]/[0.08] pl-2">
                    {badge.shortLabel}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};
