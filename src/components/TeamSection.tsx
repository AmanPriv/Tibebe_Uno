import React from 'react';
import { Award, CheckCircle2, ArrowRight } from 'lucide-react';
import { TEAM_MEMBERS, FIRM_INFO } from '../data/firmData';

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

  return (
    <section
      id="team"
      aria-labelledby="team-heading"
      className="border-b border-[#E8DCC8] bg-[#F5EFE6] py-16 sm:py-24"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <p className="text-xs sm:text-sm font-medium text-[#6F5430]">
            Principal Leadership &amp; Supervision
          </p>
          <h2
            id="team-heading"
            className="mt-2 font-serif text-2xl sm:text-4xl font-semibold tracking-tight text-[#3B2F24] text-balance"
          >
            Principal-Led Assurance &amp; Advisory
          </h2>
          <p className="mt-4 text-base text-[#5C4E40] leading-[1.65] max-w-[65ch]">
            Every engagement at {FIRM_INFO.name} is directly supervised by the firm’s Owner &amp; Principal, ensuring consistent technical rigor, personal accountability, and direct senior counsel.
          </p>
        </div>

        {/* Distinguished Principal Profile Card */}
        <article className="mt-12 rounded-lg border border-[#E8DCC8] bg-[#FBF8F3] p-6 sm:p-10 shadow-xs">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-start">
            {/* Left Column: Principal Identity, Credentials & Bio */}
            <div className="lg:col-span-6 flex flex-col justify-between">
              <div>
                <div className="flex items-start sm:items-center gap-5">
                  <div
                    aria-hidden="true"
                    className="flex h-16 w-16 sm:h-20 sm:w-20 shrink-0 items-center justify-center rounded-md border border-[#8A6A3B]/40 bg-[#F5EFE6] font-serif text-2xl sm:text-3xl font-semibold text-[#3B2F24]"
                  >
                    {principal.initials}
                  </div>
                  <div>
                    <h3 className="font-serif text-2xl sm:text-3xl font-semibold text-[#2B2118]">
                      {principal.namePlaceholder}
                    </h3>
                    <p className="mt-1 text-sm font-semibold text-[#6F5430]">
                      {principal.titlePlaceholder} · General Manager
                    </p>
                    <p className="mt-0.5 text-xs text-[#5C4E40]">
                      {FIRM_INFO.name}
                    </p>
                  </div>
                </div>

                {/* Credentials Block */}
                <div className="mt-6 flex items-start gap-2.5 border-y border-[#E8DCC8] py-3.5">
                  <Award className="h-4 w-4 text-[#2F4A3A] shrink-0 mt-0.5" aria-hidden="true" />
                  <p className="text-xs sm:text-sm font-medium text-[#2F4A3A] leading-relaxed">
                    {principal.credentialsPlaceholder}
                  </p>
                </div>

                {/* Bio */}
                <p className="mt-5 text-sm sm:text-base text-[#5C4E40] leading-[1.7]">
                  {principal.bioPlaceholder}
                </p>
              </div>

              <div className="mt-8 pt-5 border-t border-[#E8DCC8] flex flex-wrap items-center justify-between gap-4">
                <div className="text-xs text-[#5C4E40]">
                  <span>Fellow Chartered Certified Accountant (UK) · </span>
                  <strong className="font-semibold text-[#2B2118]">FCCA</strong>
                </div>
                <a
                  href="#contact"
                  className="inline-flex items-center gap-1.5 cursor-pointer whitespace-nowrap shrink-0 text-xs sm:text-sm font-semibold text-[#6F5430] hover:text-[#2B2118] transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3B2F24]"
                >
                  <span>Schedule a Consultation with the Principal</span>
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </a>
              </div>
            </div>

            {/* Right Column: 5 Core Specialties */}
            <div className="lg:col-span-6 lg:border-l lg:border-[#E8DCC8] lg:pl-10">
              <h4 className="font-serif text-lg sm:text-xl font-semibold text-[#3B2F24]">
                Principal Areas of Specialization
              </h4>
              <p className="mt-1 text-xs sm:text-sm text-[#5C4E40]">
                Direct principal oversight across five core practice pillars:
              </p>

              <ul className="mt-5 divide-y divide-[#E8DCC8]">
                {PRINCIPAL_SPECIALTIES.map((spec, idx) => (
                  <li
                    key={spec.title}
                    className={
                      idx === 0
                        ? 'pb-3.5'
                        : idx === PRINCIPAL_SPECIALTIES.length - 1
                        ? 'pt-3.5'
                        : 'py-3.5'
                    }
                  >
                    <div className="flex items-start gap-3">
                      <CheckCircle2
                        className="h-4 w-4 text-[#2F4A3A] shrink-0 mt-1"
                        aria-hidden="true"
                      />
                      <div>
                        <p className="text-sm font-semibold text-[#2B2118]">
                          {spec.title}
                        </p>
                        <p className="mt-0.5 text-xs sm:text-sm text-[#5C4E40] leading-relaxed">
                          {spec.detail}
                        </p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </article>
      </div>
    </section>
  );
};
