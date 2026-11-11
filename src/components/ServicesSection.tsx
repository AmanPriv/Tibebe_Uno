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

export const ServicesSection: React.FC<ServicesSectionProps> = ({ onSelectService }) => {
  return (
    <section
      id="services"
      aria-labelledby="services-heading"
      className="border-b border-[#E8DCC8] bg-[#F5EFE6] py-16 sm:py-24"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl">
          <p className="text-xs sm:text-sm font-medium text-[#6F5430]">
            Practice Areas &amp; Core Specialties
          </p>
          <h2
            id="services-heading"
            className="mt-2 font-serif text-2xl sm:text-4xl font-semibold tracking-tight text-[#3B2F24] text-balance"
          >
            External Audit, Tax Advisory, Due Diligence, Liquidation &amp; Accounting
          </h2>
          <p className="mt-4 text-base text-[#5C4E40] leading-[1.65] max-w-[68ch]">
            We deliver structured assurance, tax advisory, due diligence audits, statutory company liquidation, and accounting services tailored to commercial enterprises, NGOs, financial institutions, and investors in Ethiopia.
          </p>
        </div>

        {/* 9 Service Cards Grid (3x3 on desktop) */}
        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map((service) => {
            const IconComponent = SERVICE_ICONS[service.iconName];
            return (
              <article
                key={service.id}
                className="group flex flex-col justify-between rounded-lg border border-[#E8DCC8] bg-[#FBF8F3] p-6 transition-all duration-200 hover:border-[#8A6A3B]/60 hover:shadow-sm"
              >
                <div>
                  {/* Top Row: Icon & Editorial Number */}
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-md border border-[#E8DCC8] bg-[#F5EFE6] text-[#6F5430] group-hover:bg-[#8A6A3B] group-hover:text-white transition-colors duration-200">
                      <IconComponent className="h-5 w-5" aria-hidden="true" />
                    </div>
                    <span className="font-serif text-sm font-medium text-[#5C4E40] tabular-nums">
                      {service.number}
                    </span>
                  </div>

                  {/* Service Title */}
                  <h3 className="mt-5 font-serif text-xl font-semibold text-[#2B2118] leading-snug">
                    {service.title}
                  </h3>

                  {/* Summary */}
                  <p className="mt-3 text-sm text-[#5C4E40] leading-[1.6]">
                    {service.summary}
                  </p>

                  {/* Key Deliverables List */}
                  <div className="mt-5 pt-4 border-t border-[#E8DCC8]/80">
                    <p className="text-xs font-semibold text-[#3B2F24]">
                      Key Deliverables
                    </p>
                    <ul className="mt-2 space-y-1.5 text-xs text-[#5C4E40]">
                      {service.deliverables.map((item) => (
                        <li key={item} className="flex items-start gap-2">
                          <span aria-hidden="true" className="text-[#6F5430] font-bold">·</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Action Link to Pre-fill Service in Contact Form */}
                <div className="mt-6 pt-3 border-t border-[#E8DCC8]/60">
                  <a
                    href="#contact"
                    onClick={() => onSelectService(service.title)}
                    aria-label={`Inquire about ${service.title}`}
                    className="inline-flex items-center gap-1.5 cursor-pointer whitespace-nowrap shrink-0 text-xs font-semibold text-[#6F5430] hover:text-[#2B2118] transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3B2F24]"
                  >
                    <span>Request Service Inquiry</span>
                    <ArrowUpRight className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                  </a>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};
