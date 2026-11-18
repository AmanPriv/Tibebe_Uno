import React from 'react';
import { ArrowUp } from 'lucide-react';
import { FIRM_INFO } from '../data/firmData';
import { MonogramIcon } from './MonogramIcon';

const QUICK_LINKS = [
  { label: 'Services', href: '#services' },
  { label: 'About the Firm', href: '#about' },
  { label: 'How We Work', href: '#process' },
  { label: 'Industries Served', href: '#industries' },
  { label: 'Leadership Team', href: '#team' },
  { label: 'FAQ', href: '#faq' },
  { label: 'Contact', href: '#contact' },
];

export const Footer: React.FC = () => {
  const handleBackToTop = () => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({
      top: 0,
      behavior: prefersReducedMotion ? 'auto' : 'smooth',
    });
  };

  return (
    <footer
      id="site-footer"
      className="bg-[#FCFBF9] text-[#1F1B18] border-t border-[#1F1B18]/[0.08]"
    >
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-12">
          {/* Column 1: Brand & Short Description */}
          <div className="md:col-span-5">
            <a
              href="#top"
              className="group inline-flex items-center gap-3 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#1F1B18]"
            >
              <MonogramIcon
                variant="dark"
                className="h-10 w-10 shrink-0 rounded-md"
              />
              <span>
                <span className="block font-serif text-xl font-semibold text-[#1F1B18]">
                  {FIRM_INFO.name}
                </span>
                <span className="mt-0.5 block text-xs font-medium text-[#9E7B4F]">
                  {FIRM_INFO.descriptor}
                </span>
              </span>
            </a>

            <p className="mt-4 text-sm text-[#5E5650] leading-[1.65] max-w-sm">
              {FIRM_INFO.tagline} Led by {FIRM_INFO.principalName} ({FIRM_INFO.principalTitle}), providing external audit, tax advisory, due diligence audit, and company liquidation services.
            </p>

            <p className="mt-4 text-xs text-[#5E5650]">
              Established {FIRM_INFO.yearEstablishedPlaceholder} · {FIRM_INFO.jurisdictionPlaceholder}
            </p>
          </div>

          {/* Column 2: Quick Links */}
          <div className="md:col-span-3">
            <h2 className="text-xs font-semibold uppercase tracking-[0.1em] text-[#1F1B18]">
              Quick Links
            </h2>
            <ul className="mt-4 space-y-2.5 text-sm text-[#5E5650]">
              {QUICK_LINKS.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="cursor-pointer hover:text-[#1F1B18] hover:underline underline-offset-4 transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1F1B18]"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Contact Summary */}
          <div className="md:col-span-4">
            <h2 className="text-xs font-semibold uppercase tracking-[0.1em] text-[#1F1B18]">
              Contact &amp; Chambers
            </h2>
            <dl className="mt-4 space-y-2.5 text-sm text-[#5E5650]">
              <div>
                <dt className="sr-only">Address</dt>
                <dd>
                  <a
                    href={FIRM_INFO.mapUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="cursor-pointer hover:text-[#1F1B18] hover:underline underline-offset-4 transition-colors duration-150"
                  >
                    {FIRM_INFO.addressPlaceholder}
                  </a>
                </dd>
              </div>
              <div>
                <dt className="sr-only">Phone</dt>
                <dd className="tabular-nums">
                  <a
                    href="tel:+251911516027"
                    className="cursor-pointer hover:text-[#1F1B18] hover:underline underline-offset-4 transition-colors duration-150"
                  >
                    {FIRM_INFO.phonePlaceholder}
                  </a>
                </dd>
              </div>
              <div>
                <dt className="sr-only">Email</dt>
                <dd className="break-all">
                  <a
                    href={`mailto:${FIRM_INFO.emailPlaceholder}`}
                    className="cursor-pointer hover:text-[#1F1B18] hover:underline underline-offset-4 transition-colors duration-150"
                  >
                    {FIRM_INFO.emailPlaceholder}
                  </a>
                </dd>
              </div>
              <div>
                <dt className="sr-only">Office Hours</dt>
                <dd className="text-xs text-[#5E5650] pt-1">
                  {FIRM_INFO.hoursPlaceholder}
                </dd>
              </div>
            </dl>

            <div className="mt-5 pt-4 border-t border-[#1F1B18]/[0.08]">
              <a
                href="#top"
                onClick={(e) => {
                  e.preventDefault();
                  handleBackToTop();
                }}
                className="inline-flex items-center gap-1.5 cursor-pointer text-xs font-semibold text-[#9E7B4F] hover:text-[#1F1B18] transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1F1B18]"
              >
                <span>Back to Top</span>
                <ArrowUp className="h-3.5 w-3.5" aria-hidden="true" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Legal & Copyright Bar with 90px Right Clearance & Zero Overlap */}
        <div className="mt-12 pt-8 border-t border-[#1F1B18]/[0.08] lg:pr-[90px] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 text-xs text-[#5E5650]">
          <p>© 2026 {FIRM_INFO.name}. All rights reserved.</p>
          <p>{FIRM_INFO.descriptor}</p>
        </div>
      </div>
    </footer>
  );
};
