import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { FAQ_ITEMS } from '../data/firmData';

export const FaqSection: React.FC = () => {
  const [openIds, setOpenIds] = useState<string[]>([FAQ_ITEMS[0].id]);

  const toggleItem = (id: string) => {
    setOpenIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const allExpanded = openIds.length === FAQ_ITEMS.length;

  const handleToggleAll = () => {
    if (allExpanded) {
      setOpenIds([]);
    } else {
      setOpenIds(FAQ_ITEMS.map((item) => item.id));
    }
  };

  return (
    <section
      id="faq"
      aria-labelledby="faq-heading"
      className="border-b border-[#E8DCC8] bg-[#E8DCC8]/35 py-16 sm:py-24"
    >
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div className="max-w-2xl">
            <p className="text-xs sm:text-sm font-medium text-[#6F5430]">
              Frequently Asked Questions
            </p>
            <h2
              id="faq-heading"
              className="mt-2 font-serif text-2xl sm:text-4xl font-semibold tracking-tight text-[#3B2F24] text-balance"
            >
              Common Inquiries Regarding Audits &amp; Engagements
            </h2>
            <p className="mt-3 text-base text-[#5C4E40] leading-[1.6]">
              Clear answers on audit preparation, timelines, fee structures, confidentiality, and statutory deadlines.
            </p>
          </div>

          <button
            type="button"
            onClick={handleToggleAll}
            className="self-start sm:self-auto cursor-pointer whitespace-nowrap shrink-0 rounded-md border border-[#E8DCC8] bg-[#FBF8F3] px-3.5 py-2 text-xs font-medium text-[#2B2118] hover:bg-[#E8DCC8]/50 transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3B2F24]"
          >
            {allExpanded ? 'Collapse All Questions' : 'Expand All Questions'}
          </button>
        </div>

        {/* Accessible 6-Item Accordion */}
        <div className="mt-10 divide-y divide-[#E8DCC8] rounded-lg border border-[#E8DCC8] bg-[#FBF8F3] shadow-xs">
          {FAQ_ITEMS.map((item, idx) => {
            const isOpen = openIds.includes(item.id);
            const panelId = `${item.id}-panel`;
            const buttonId = `${item.id}-button`;

            return (
              <div key={item.id} className="p-5 sm:p-6">
                <h3>
                  <button
                    id={buttonId}
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    onClick={() => toggleItem(item.id)}
                    className="flex w-full cursor-pointer items-start justify-between gap-4 text-left focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#3B2F24]"
                  >
                    <div className="pr-2">
                      <span className="text-xs font-medium text-[#6F5430]">
                        0{idx + 1} · {item.category}
                      </span>
                      <span className="mt-1 block font-serif text-lg sm:text-xl font-semibold text-[#2B2118]">
                        {item.question}
                      </span>
                    </div>
                    <span
                      className={`mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-[#E8DCC8] bg-[#F5EFE6] text-[#2B2118] transition-transform duration-200 ${
                        isOpen ? 'rotate-180 bg-[#8A6A3B] text-white border-[#8A6A3B]' : ''
                      }`}
                      aria-hidden="true"
                    >
                      <ChevronDown className="h-4 w-4" />
                    </span>
                  </button>
                </h3>

                <div
                  id={panelId}
                  role="region"
                  aria-labelledby={buttonId}
                  hidden={!isOpen}
                  className={isOpen ? 'mt-4 pt-3 border-t border-[#E8DCC8]/70' : 'hidden'}
                >
                  <p className="text-sm sm:text-base text-[#5C4E40] leading-[1.65] max-w-[68ch]">
                    {item.answer}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
