import React, { useCallback } from 'react';
import { CORE_VALUES, FIRM_INFO } from '../data/firmData';

export const AboutSection: React.FC = () => {
  const attachHtmlComment = useCallback((commentText: string) => {
    return (node: HTMLElement | null) => {
      if (!node || !node.parentNode) return;
      const prev = node.previousSibling;
      if (prev && prev.nodeType === Node.COMMENT_NODE && prev.nodeValue?.trim() === commentText) {
        return;
      }
      const commentNode = document.createComment(` ${commentText} `);
      node.parentNode.insertBefore(commentNode, node);
    };
  }, []);

  return (
    <section
      id="about"
      aria-labelledby="about-heading"
      className="section-veil-sand border-b border-[#1F1B18]/[0.08] py-16 sm:py-24"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-stretch">
          {/* Left Column: Firm Narrative, Horizontal Editorial Chambers Image & Crisp Stat Blocks */}
          <div className="lg:col-span-6 flex flex-col justify-between">
            <div>
              <p className="text-[11px] sm:text-xs font-semibold uppercase tracking-[0.12em] text-[#1D3B2F]">
                About the Firm · Why Choose Us
              </p>
              <h2
                id="about-heading"
                className="mt-2.5 font-serif text-2xl sm:text-4xl font-semibold tracking-tight text-[#1F1B18] leading-[1.18] text-balance"
              >
                A Steadfast Commitment to Professional Objectivity
              </h2>

              <div className="mt-5 space-y-3.5 text-base text-[#5E5650] leading-[1.65] max-w-[62ch]">
                <p>
                  Established in <strong className="font-medium text-[#1F1B18]">{FIRM_INFO.yearEstablishedPlaceholder}</strong> in {FIRM_INFO.jurisdictionPlaceholder} and led by <strong className="font-medium text-[#1F1B18]">{FIRM_INFO.principalName}</strong> ({FIRM_INFO.principalTitle}), <strong className="font-medium text-[#1F1B18]">{FIRM_INFO.name}</strong> provides corporate boards, non-governmental organizations, financial institutions, and investors with independent, technically rigorous assurance.
                </p>
                <p>
                  As <strong className="font-medium text-[#1F1B18]">{FIRM_INFO.descriptor}</strong>, we have supported <strong className="font-medium text-[#1F1B18] lowercase">{FIRM_INFO.clientCountPlaceholder}</strong> organizations across commercial and development sectors.
                </p>
                <p>
                  Our core practice specialties encompass <strong className="font-medium text-[#1F1B18]">external audit, tax advisory, due diligence audit, company liquidation, and accounting services</strong>—combining international FCCA (UK) technical standards with deep mastery of Ethiopian commercial and tax law.
                </p>
              </div>
            </div>

            {/* Key Practice Facts (Established: May 2011 / Organizations Served: Countless) */}
            <dl className="mt-6 grid grid-cols-2 gap-4">
              <div className="surface-card-ivory rounded-lg px-5 py-4">
                <dt className="text-[11px] font-medium uppercase tracking-[0.08em] text-[#5E5650]">
                  Established
                </dt>
                <dd className="mt-1 font-serif text-xl sm:text-2xl font-semibold text-[#1F1B18] tabular-nums">
                  {FIRM_INFO.yearEstablishedPlaceholder}
                </dd>
              </div>
              <div className="surface-card-ivory rounded-lg px-5 py-4">
                <dt className="text-[11px] font-medium uppercase tracking-[0.08em] text-[#5E5650]">
                  Organizations Served
                </dt>
                <dd className="mt-1 font-serif text-xl sm:text-2xl font-semibold text-[#1F1B18] tabular-nums">
                  {FIRM_INFO.clientCountPlaceholder}
                </dd>
              </div>
            </dl>

            {/* Horizontal Editorial Chambers / Architecture Image Directly Below Stat Boxes */}
            <div className="surface-card-ivory mt-4 overflow-hidden rounded-lg">
              <div
                style={{ backgroundColor: '#E8E0D4' }}
                className="relative h-44 sm:h-48 w-full overflow-hidden bg-[#E8E0D4]"
              >
                {/* <!-- CHAMBERS IMAGE --> */}
                <img
                  ref={attachHtmlComment('CHAMBERS IMAGE')}
                  src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1600&q=80"
                  alt="Minimalist executive boardroom and architectural glass chambers"
                  decoding="async"
                  style={{ width: '100%', height: '100%', objectFit: 'cover', backgroundColor: '#E8E0D4' }}
                  className="editorial-photo h-full w-full object-cover object-center"
                />
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#1F1B18]/65 via-[#1F1B18]/15 to-transparent"
                />
                <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-4 px-5 py-3">
                  <span className="text-[11px] font-medium uppercase tracking-[0.1em] text-[#FCFBF9]">
                    Executive Practice Chambers · Bole, Abyssinia Plaza
                  </span>
                  <span className="font-mono text-[11px] font-medium text-[#F2EFE9]">
                    Addis Ababa
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Clean Numbered List for the 4 Core Pillars */}
          <div className="lg:col-span-6 flex">
            <div className="surface-card-ivory flex w-full flex-col justify-between rounded-lg p-6 sm:p-8">
              <div>
                <div className="flex items-center justify-between gap-4 pb-5 border-b border-[#1F1B18]/[0.08]">
                  <div>
                    <h3 className="font-serif text-xl sm:text-2xl font-semibold text-[#1F1B18]">
                      Four Pillars of Our Practice
                    </h3>
                    <p className="mt-1.5 text-xs sm:text-sm text-[#5E5650] leading-relaxed">
                      Governed by the International Code of Ethics for Professional Accountants (IESBA):
                    </p>
                  </div>
                  <span className="hidden sm:inline-block shrink-0 rounded border border-[#1F1B18]/[0.08] bg-[#F8F6F2] px-2.5 py-1 font-mono text-[11px] font-medium text-[#1D3B2F]">
                    IESBA · ISQM 1
                  </span>
                </div>

                <ol className="divide-y divide-[#1F1B18]/[0.08]">
                  {CORE_VALUES.map((val, idx) => (
                    <li
                      key={val.id}
                      className={idx === 0 ? 'pt-5 pb-5' : idx === CORE_VALUES.length - 1 ? 'pt-5 pb-2' : 'py-5'}
                    >
                      <div className="flex items-start gap-4">
                        <span className="mt-0.5 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded border border-[#1F1B18]/[0.08] bg-[#F8F6F2] font-mono text-xs font-medium text-[#9E7B4F] tabular-nums">
                          0{idx + 1}
                        </span>
                        <div>
                          <h4 className="font-serif text-lg font-semibold text-[#1F1B18]">
                            {val.title}
                          </h4>
                          <p className="mt-1 text-sm text-[#5E5650] leading-[1.65]">
                            {val.description}
                          </p>
                        </div>
                      </div>
                    </li>
                  ))}
                </ol>
              </div>

              <div className="mt-6 flex items-center justify-between gap-4 border-t border-[#1F1B18]/[0.08] pt-4 text-xs text-[#5E5650]">
                <span>Quality Management System</span>
                <span className="font-mono font-medium text-[#1F1B18]">ISA 220 · ISQM 1 Compliant</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
