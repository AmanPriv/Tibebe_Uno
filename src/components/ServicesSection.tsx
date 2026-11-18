import React from 'react';
import {
  ShieldCheck,
  ClipboardCheck,
  Scale,
  BookOpen,
  FileSpreadsheet,
  Compass,
  SearchCheck,
  FileCheck2,
  Users,
  ArrowUpRight,
} from 'lucide-react';
import { SERVICES, ServiceItem } from '../data/firmData';

interface ServicesSectionProps {
  onSelectService: (serviceTitle: string) => void;
  onHoverService?: (index: number | null) => void;
}

const SERVICE_ICONS: Record<ServiceItem['iconName'], React.ComponentType<{ className?: string }>> = {
  ShieldCheck,
  ClipboardCheck,
  Scale,
  BookOpen,
  FileSpreadsheet,
  Compass,
  SearchCheck,
  FileCheck2,
  Users,
};

export const ServicesSection: React.FC<ServicesSectionProps> = ({
  onSelectService,
  onHoverService,
}) => {
  return (
    <section
      id="services"
      aria-labelledby="services-heading"
      className="section-veil-alabaster border-b border-[#1F1B18]/[0.08] py-16 sm:py-24"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl">
          <p className="text-[11px] sm:text-xs font-semibold uppercase tracking-[0.12em] text-[#1D3B2F]">
            Practice Areas &amp; Core Specialties
          </p>
          <h2
            id="services-heading"
            className="mt-2.5 font-serif text-2xl sm:text-4xl font-semibold tracking-tight text-[#1F1B18] leading-[1.18] text-balance"
          >
            External Audit, Tax Advisory, Due Diligence, Liquidation &amp; Accounting
          </h2>
          <p className="mt-4 text-base text-[#5E5650] leading-[1.65] max-w-[66ch]">
            We deliver structured assurance, tax advisory, due diligence audits, statutory company liquidation, and accounting services tailored to commercial enterprises, NGOs, financial institutions, and investors in Ethiopia.
          </p>
        </div>

        {/* 9 Service Cards Grid (Uniform 3x3 on Desktop with 1px Hairline Borders) */}
        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map((service, idx) => {
            const IconComponent = SERVICE_ICONS[service.iconName];
            return (
              <article
                key={service.id}
                onMouseEnter={() => onHoverService?.(idx)}
                onMouseLeave={() => onHoverService?.(null)}
                className="service-card surface-card-ivory group h-full flex flex-col rounded-lg p-6 sm:p-7 hover:border-[#9E7B4F] transition-colors duration-200"
              >
                {/* Top Block: Monospace Badge, Icon, Title & Summary */}
                <div className="pb-5">
                  <div className="flex items-center justify-between gap-4">
                    <span className="inline-flex items-center rounded border border-[#1F1B18]/[0.08] bg-[#F8F6F2] px-2.5 py-1 font-mono text-xs font-medium text-[#1F1B18] tabular-nums group-hover:border-[#9E7B4F]/40 transition-colors duration-200">
                      {service.number}
                    </span>
                    <div className="flex h-9 w-9 items-center justify-center rounded-md border border-[#1F1B18]/[0.08] bg-[#FFFFFF] text-[#9E7B4F]">
                      <IconComponent className="h-4 w-4" aria-hidden="true" />
                    </div>
                  </div>

                  <h3 className="mt-5 font-serif text-xl font-semibold text-[#1F1B18] leading-snug">
                    {service.title}
                  </h3>

                  <p className="mt-2.5 text-sm text-[#5E5650] leading-[1.65]">
                    {service.summary}
                  </p>
                </div>

                {/* Key Deliverables Block: Pushed to bottom via margin-top: auto so divider lines align across every row */}
                <div className="deliverables mt-auto pt-4 border-t border-[#1F1B18]/[0.08]">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#1F1B18]">
                    Key Deliverables
                  </p>
                  <ul className="mt-2.5 space-y-1.5 text-xs text-[#5E5650] min-h-[5.5rem]">
                    {service.deliverables.map((item) => (
                      <li key={item} className="flex items-start gap-2">
                        <span aria-hidden="true" className="text-[#9E7B4F] font-semibold">·</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Action Link to Pre-fill Service in Contact Form */}
                  <div className="mt-5 pt-4 border-t border-[#1F1B18]/[0.08]">
                    <a
                      href="#contact"
                      onClick={() => onSelectService(service.title)}
                      aria-label={`Inquire about ${service.title}`}
                      className="inline-flex items-center gap-1.5 cursor-pointer whitespace-nowrap shrink-0 text-xs font-semibold text-[#9E7B4F] group-hover:text-[#1F1B18] group-hover:underline underline-offset-4 transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1F1B18]"
                    >
                      <span>Request Service Inquiry</span>
                      <ArrowUpRight className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                    </a>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};
