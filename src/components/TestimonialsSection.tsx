import React from 'react';
import { Quote } from 'lucide-react';
import { TESTIMONIALS } from '../data/firmData';

export const TestimonialsSection: React.FC = () => {
  return (
    <section
      id="testimonials"
      aria-labelledby="testimonials-heading"
      className="border-b border-[#E8DCC8] bg-[#E8DCC8]/35 py-16 sm:py-24"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <p className="text-xs sm:text-sm font-medium text-[#2F4A3A]">
            Client Perspectives · Placeholder Endorsements
          </p>
          <h2
            id="testimonials-heading"
            className="mt-2 font-serif text-2xl sm:text-4xl font-semibold tracking-tight text-[#3B2F24] text-balance"
          >
            Trusted by Boards, Donors, and Executive Teams
          </h2>
          <p className="mt-4 text-base text-[#5C4E40] leading-[1.65] max-w-[65ch]">
            Below are structured placeholder blocks reserved for verified client endorsements prior to public deployment.
          </p>
        </div>

        {/* 3 Clearly Marked Placeholder Quotes */}
        <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-3">
          {TESTIMONIALS.map((item) => (
            <figure
              key={item.id}
              className="flex flex-col justify-between rounded-lg border border-[#E8DCC8] bg-[#FBF8F3] p-6 sm:p-8 shadow-xs"
            >
              <div>
                <div className="flex items-center justify-between gap-2">
                  <Quote className="h-6 w-6 text-[#8A6A3B]/70" aria-hidden="true" />
                  <span className="text-xs font-medium text-[#5C4E40]">
                    {item.engagementType}
                  </span>
                </div>

                <blockquote className="mt-5 font-serif text-base italic text-[#2B2118] leading-[1.65]">
                  {item.quotePlaceholder}
                </blockquote>
              </div>

              <figcaption className="mt-6 pt-4 border-t border-[#E8DCC8]">
                <p className="text-sm font-semibold text-[#2B2118]">
                  {item.clientNamePlaceholder}
                </p>
                <p className="mt-0.5 text-xs text-[#5C4E40]">
                  {item.rolePlaceholder} · {item.organizationPlaceholder}
                </p>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
};
