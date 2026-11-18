import React, { useCallback } from 'react';
import { Award, CheckCircle2, ArrowRight, ShieldCheck } from 'lucide-react';
import { TEAM_MEMBERS, FIRM_INFO } from '../data/firmData';
import { MonogramIcon } from './MonogramIcon';

const PRINCIPAL_SPECIALTIES = [
  {
    title: 'External Audit',
    detail: 'Independent statutory and donor-funded financial statement audits under ISA and Ethiopian regulatory standards.',
  },
  {
    title: 'Tax Advisory',
    detail: 'Corporate tax planning, statutory compliance reviews, VAT and withholding health checks, and authority representation.',
  },
  {
    title: 'Due Diligence Audit',
    detail: 'Pre-acquisition, joint venture, and investment due diligence examinations verifying quality of earnings and tax exposure.',
  },
  {
    title: 'Company Liquidation',
    detail: 'Full statutory winding-up audits, creditor settlement verification, tax clearance, and commercial deregistration.',
  },
  {
    title: 'Accounting Services',
    detail: 'IFRS/IPSAS financial reporting, general ledger supervision, chart-of-accounts structuring, and payroll compliance.',
  },
];

export const TeamSection: React.FC = () => {
  const principal = TEAM_MEMBERS[0];

  const attachPortraitComments = useCallback((node: HTMLElement | null) => {
    if (!node || !node.parentNode) return;
    const prev = node.previousSibling;
    if (
      prev &&
      prev.nodeType === Node.COMMENT_NODE &&
      prev.nodeValue?.includes('REPLACE WITH: Tibebe Mengistu Headshot')
    ) {
      return;
    }
    const c1 = document.createComment(' PRINCIPAL PORTRAIT ');
    const c2 = document.createComment(' REPLACE WITH: Tibebe Mengistu Headshot ');
    node.parentNode.insertBefore(c1, node);
    node.parentNode.insertBefore(c2, node);
  }, []);

  return (
    <section
      id="team"
      aria-labelledby="team-heading"
      className="section-veil-alabaster border-b border-[#1F1B18]/[0.08] py-16 sm:py-24"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <p className="text-[11px] sm:text-xs font-semibold uppercase tracking-[0.12em] text-[#1D3B2F]">
            Principal Leadership &amp; Supervision
          </p>
          <h2
            id="team-heading"
            className="mt-2.5 font-serif text-2xl sm:text-4xl font-semibold tracking-tight text-[#1F1B18] leading-[1.18] text-balance"
          >
            Principal-Led Assurance &amp; Advisory
          </h2>
          <p className="mt-4 text-base text-[#5E5650] leading-[1.65] max-w-[65ch]">
            Every engagement at {FIRM_INFO.name} is directly supervised by the firm’s Owner &amp; Principal, ensuring consistent technical rigor, personal accountability, and direct senior counsel.
          </p>
        </div>

        {/* Executive Principal Card with Dedicated 4:5 Portrait Frame on Left */}
        <article className="surface-card-ivory mt-12 rounded-lg p-6 sm:p-10">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-start">
            {/* Left Column (4 cols): Dedicated 4:5 Executive Portrait Frame */}
            <div className="lg:col-span-4">
              <div className="mx-auto max-w-sm lg:max-w-none overflow-hidden rounded-lg border border-[#1F1B18]/[0.08] bg-[#E8E0D4]">
                <div
                  style={{ aspectRatio: '4 / 5', backgroundColor: '#E8E0D4' }}
                  className="relative w-full overflow-hidden bg-[#E8E0D4]"
                >
                  {/* <!-- PRINCIPAL PORTRAIT --> */}
                  {/* <!-- REPLACE WITH: Tibebe Mengistu Headshot --> */}
                  <img
                    ref={attachPortraitComments}
                    src="https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1600&q=80"
                    alt="Executive chambers portrait frame for Tibebe Mengistu, BA, FCCA"
                    decoding="async"
                    style={{ aspectRatio: '4 / 5', width: '100%', height: '100%', objectFit: 'cover', backgroundColor: '#E8E0D4' }}
                    className="editorial-photo h-full w-full object-cover object-center"
                  />

                  {/* Subtle Warm-Espresso Gradient Overlay */}
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#1F1B18]/85 via-[#1F1B18]/35 to-[#1F1B18]/15"
                  />

                  {/* Centered Architectural Monogram Crest */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
                    <div className="rounded-xl border border-[#9E7B4F]/50 bg-[#1F1B18]/85 p-3.5 backdrop-blur-xs">
                      <MonogramIcon
                        variant="dark"
                        className="h-14 w-14 sm:h-16 sm:w-16 rounded-lg"
                      />
                    </div>
                    <span className="mt-3.5 inline-block rounded border border-[#FCFBF9]/25 bg-[#1F1B18]/80 px-3 py-1 font-mono text-[10.5px] font-medium uppercase tracking-[0.14em] text-[#F2EFE9]">
                      Principal Chambers · FCCA (UK)
                    </span>
                  </div>

                  {/* Bottom Portrait Nameplate */}
                  <div className="absolute inset-x-0 bottom-0 border-t border-[#FCFBF9]/15 bg-[#1F1B18]/90 px-5 py-4 backdrop-blur-xs">
                    <p className="font-serif text-lg font-semibold text-[#FCFBF9]">
                      {principal.namePlaceholder}
                    </p>
                    <p className="mt-0.5 text-xs text-[#E5DEC9]">
                      {principal.titlePlaceholder} · General Manager
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Middle/Right Columns (8 cols): Principal Biography, Credentials & 5 Core Specialties */}
            <div className="lg:col-span-8 flex flex-col justify-between">
              <div>
                <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-[#1F1B18]/[0.08] pb-4">
                  <div>
                    <h3 className="font-serif text-2xl sm:text-3xl font-semibold text-[#1F1B18]">
                      {principal.namePlaceholder}
                    </h3>
                    <p className="mt-1 text-sm font-medium text-[#9E7B4F]">
                      {principal.titlePlaceholder} · General Manager · {FIRM_INFO.name}
                    </p>
                  </div>
                  <span className="rounded border border-[#1F1B18]/[0.08] bg-[#F8F6F2] px-2.5 py-1 font-mono text-xs font-medium text-[#1D3B2F] tabular-nums">
                    Est. {FIRM_INFO.yearEstablishedPlaceholder}
                  </span>
                </div>

                {/* Credentials Block */}
                <div className="mt-4 flex items-start gap-2.5 rounded-md border border-[#1F1B18]/[0.08] bg-[#F8F6F2] px-4 py-3">
                  <Award className="h-4 w-4 text-[#1D3B2F] shrink-0 mt-0.5" aria-hidden="true" />
                  <p className="text-xs sm:text-sm font-medium text-[#1D3B2F] leading-relaxed">
                    {principal.credentialsPlaceholder}
                  </p>
                </div>

                {/* Bio */}
                <p className="mt-4 text-sm sm:text-base text-[#5E5650] leading-[1.7]">
                  {principal.bioPlaceholder}
                </p>

                {/* 5 Core Specialties */}
                <div className="mt-6 pt-6 border-t border-[#1F1B18]/[0.08]">
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="font-serif text-lg font-semibold text-[#1F1B18]">
                      Principal Areas of Specialization
                    </h4>
                    <span className="inline-flex items-center gap-1.5 text-xs font-medium text-[#1D3B2F]">
                      <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" />
                      <span>Direct Principal Sign-Off</span>
                    </span>
                  </div>

                  <ul className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                    {PRINCIPAL_SPECIALTIES.map((spec) => (
                      <li
                        key={spec.title}
                        className="rounded-md border border-[#1F1B18]/[0.08] bg-[#F8F6F2]/70 p-3.5"
                      >
                        <div className="flex items-start gap-2.5">
                          <CheckCircle2
                            className="h-4 w-4 text-[#1D3B2F] shrink-0 mt-0.5"
                            aria-hidden="true"
                          />
                          <div>
                            <p className="text-xs sm:text-sm font-semibold text-[#1F1B18]">
                              {spec.title}
                            </p>
                            <p className="mt-0.5 text-xs text-[#5E5650] leading-relaxed">
                              {spec.detail}
                            </p>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="mt-6 pt-5 border-t border-[#1F1B18]/[0.08] flex flex-wrap items-center justify-between gap-4">
                <div className="text-xs text-[#5E5650]">
                  <span>Fellow Chartered Certified Accountant (UK) · </span>
                  <strong className="font-semibold text-[#1F1B18]">FCCA</strong>
                </div>
                <a
                  href="#contact"
                  className="inline-flex items-center gap-1.5 cursor-pointer whitespace-nowrap shrink-0 text-xs sm:text-sm font-semibold text-[#9E7B4F] hover:text-[#1F1B18] hover:underline underline-offset-4 transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1F1B18]"
                >
                  <span>Schedule a Consultation with the Principal</span>
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </a>
              </div>
            </div>
          </div>
        </article>
      </div>
    </section>
  );
};
