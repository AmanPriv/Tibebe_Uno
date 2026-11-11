import React from 'react';
import { CheckCircle2 } from 'lucide-react';
import { CORE_VALUES, FIRM_INFO } from '../data/firmData';

export const AboutSection: React.FC = () => {
  return (
    <section
      id="about"
      aria-labelledby="about-heading"
      className="border-b border-[#E8DCC8] bg-[#E8DCC8]/35 py-16 sm:py-24"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-start">
          {/* Left Column: Firm Narrative & Placeholders */}
          <div className="lg:col-span-6">
            <p className="text-xs sm:text-sm font-medium text-[#2F4A3A]">
              About the Firm · Why Choose Us
            </p>
            <h2
              id="about-heading"
              className="mt-2 font-serif text-2xl sm:text-4xl font-semibold tracking-tight text-[#3B2F24] text-balance"
            >
              A Steadfast Commitment to Professional Objectivity
            </h2>

            <div className="mt-6 space-y-4 text-base text-[#5C4E40] leading-[1.65] max-w-[65ch]">
              <p>
                Established in <strong className="font-medium text-[#2B2118]">{FIRM_INFO.yearEstablishedPlaceholder}</strong> in {FIRM_INFO.jurisdictionPlaceholder} and led by <strong className="font-medium text-[#2B2118]">{FIRM_INFO.principalName}</strong> ({FIRM_INFO.principalTitle}), <strong className="font-medium text-[#2B2118]">{FIRM_INFO.name}</strong> provides corporate boards, non-governmental organizations, financial institutions, and investors with independent, technically rigorous assurance.
              </p>
              <p>
                As <strong className="font-medium text-[#2B2118]">{FIRM_INFO.descriptor}</strong> registered under <strong className="font-medium text-[#2B2118]">{FIRM_INFO.regulatoryLicensePlaceholder}</strong>, we have supported <strong className="font-medium text-[#2B2118]">{FIRM_INFO.clientCountPlaceholder}</strong> organizations across commercial and development sectors.
              </p>
              <p>
                Our core practice specialties encompass <strong className="font-medium text-[#2B2118]">external audit, tax advisory, due diligence audit, company liquidation, and accounting services</strong>—combining international FCCA (UK) technical standards with deep mastery of Ethiopian commercial and tax law.
              </p>
            </div>

            {/* Key Practice Facts (Using Explicit Placeholders as Requested) */}
            <dl className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3 pt-8 border-t border-[#E8DCC8]">
              <div className="rounded-md border border-[#E8DCC8] bg-[#FBF8F3] p-4">
                <dt className="text-xs text-[#5C4E40]">Established</dt>
                <dd className="mt-1 font-serif text-lg font-semibold text-[#2B2118] tabular-nums">
                  {FIRM_INFO.yearEstablishedPlaceholder}
                </dd>
              </div>
              <div className="rounded-md border border-[#E8DCC8] bg-[#FBF8F3] p-4">
                <dt className="text-xs text-[#5C4E40]">Organizations Served</dt>
                <dd className="mt-1 font-serif text-lg font-semibold text-[#2B2118] tabular-nums">
                  {FIRM_INFO.clientCountPlaceholder}
                </dd>
              </div>
              <div className="rounded-md border border-[#E8DCC8] bg-[#FBF8F3] p-4">
                <dt className="text-xs text-[#5C4E40]">Practice License</dt>
                <dd className="mt-1 font-serif text-sm font-semibold text-[#2B2118]">
                  {FIRM_INFO.regulatoryLicensePlaceholder}
                </dd>
              </div>
            </dl>
          </div>

          {/* Right Column: 4 Core Value Points */}
          <div className="lg:col-span-6">
            <div className="rounded-lg border border-[#E8DCC8] bg-[#FBF8F3] p-6 sm:p-8 shadow-xs">
              <h3 className="font-serif text-xl sm:text-2xl font-semibold text-[#3B2F24]">
                Four Pillars of Our Practice
              </h3>
              <p className="mt-2 text-sm text-[#5C4E40] leading-relaxed">
                Our work is governed by the International Code of Ethics for Professional Accountants (IESBA) and four non-negotiable principles:
              </p>

              <div className="mt-6 divide-y divide-[#E8DCC8]">
                {CORE_VALUES.map((val, idx) => (
                  <div key={val.id} className={idx === 0 ? 'pb-5' : idx === CORE_VALUES.length - 1 ? 'pt-5' : 'py-5'}>
                    <div className="flex items-start gap-3.5">
                      <CheckCircle2 className="h-5 w-5 text-[#2F4A3A] shrink-0 mt-0.5" aria-hidden="true" />
                      <div>
                        <h4 className="font-serif text-lg font-semibold text-[#2B2118]">
                          0{idx + 1}. {val.title}
                        </h4>
                        <p className="mt-1.5 text-sm text-[#5C4E40] leading-[1.6]">
                          {val.description}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
