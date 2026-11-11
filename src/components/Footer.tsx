import React from 'react';
import { FIRM_INFO } from '../data/firmData';

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
  return (
    <footer className="bg-[#FBF8F3] text-[#2B2118] border-t border-[#E8DCC8]">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-12">
          {/* Column 1: Brand & Short Description */}
          <div className="md:col-span-5">
            <a
              href="#top"
              className="inline-block cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#3B2F24]"
            >
              <span className="block font-serif text-xl font-semibold text-[#2B2118]">
                {FIRM_INFO.name}
              </span>
              <span className="mt-0.5 block text-xs font-medium text-[#6F5430]">
                {FIRM_INFO.descriptor}
              </span>
            </a>

            <p className="mt-4 text-sm text-[#5C4E40] leading-[1.65] max-w-sm">
              {FIRM_INFO.tagline} Led by {FIRM_INFO.principalName} ({FIRM_INFO.principalTitle}), providing external audit, tax advisory, due diligence audit, company liquidation, and accounting services.
            </p>

            <p className="mt-4 text-xs text-[#5C4E40]">
              Established {FIRM_INFO.yearEstablishedPlaceholder} · {FIRM_INFO.jurisdictionPlaceholder}
            </p>
          </div>

          {/* Column 2: Quick Links */}
          <div className="md:col-span-3">
            <h2 className="font-serif text-sm font-semibold text-[#3B2F24]">
              Quick Links
            </h2>
            <ul className="mt-4 space-y-2.5 text-sm text-[#5C4E40]">
              {QUICK_LINKS.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="cursor-pointer hover:text-[#2B2118] hover:underline underline-offset-4 transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3B2F24]"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Contact Summary */}
          <div className="md:col-span-4">
            <h2 className="font-serif text-sm font-semibold text-[#3B2F24]">
              Contact &amp; Chambers
            </h2>
            <dl className="mt-4 space-y-2.5 text-sm text-[#5C4E40]">
              <div>
                <dt className="sr-only">Address</dt>
                <dd>
                  <a
                    href={FIRM_INFO.mapUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="cursor-pointer hover:text-[#2B2118] hover:underline underline-offset-4 transition-colors duration-150"
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
                    className="cursor-pointer hover:text-[#2B2118] hover:underline underline-offset-4 transition-colors duration-150"
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
                    className="cursor-pointer hover:text-[#2B2118] hover:underline underline-offset-4 transition-colors duration-150"
                  >
                    {FIRM_INFO.emailPlaceholder}
                  </a>
                </dd>
              </div>
              <div>
                <dt className="sr-only">Office Hours</dt>
                <dd className="text-xs text-[#5C4E40]/90 pt-1">
                  {FIRM_INFO.hoursPlaceholder}
                </dd>
              </div>
            </dl>
          </div>
        </div>

        {/* Bottom Legal & Copyright Bar */}
        <div className="mt-12 pt-8 border-t border-[#E8DCC8] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 text-xs text-[#5C4E40]">
          <p>© 2026 Tibebe Mengistu &amp; Co. All rights reserved.</p>
          <p>
            {FIRM_INFO.descriptor}
          </p>
        </div>
      </div>
    </footer>
  );
};
