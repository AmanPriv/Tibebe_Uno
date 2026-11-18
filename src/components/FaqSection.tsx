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
      className="section-veil-sand border-b border-[#1F1B18]/[0.08] py-16 sm:py-24"
    >
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div className="max-w-2xl">
            <p className="text-[11px] sm:text-xs font-semibold uppercase tracking-[0.12em] text-[#1D3B2F]">
              Frequently Asked Questions
            </p>
            <h2
              id="faq-heading"
              className="mt-2.5 font-serif text-2xl sm:text-4xl font-semibold tracking-tight text-[#1F1B18] leading-[1.18] text-balance"
            >
              Common Inquiries Regarding Audits &amp; Engagements
            </h2>
            <p className="mt-3 text-base text-[#5E5650] leading-[1.65]">
              Clear answers on audit preparation, timelines, fee structures, confidentiality, and statutory deadlines.
            </p>
          </div>

          <button
            type="button"
            onClick={handleToggleAll}
            className="btn-executive-secondary self-start sm:self-auto cursor-pointer whitespace-nowrap shrink-0 rounded-md px-3.5 py-2 text-xs font-medium focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1F1B18]"
          >
            {allExpanded ? 'Collapse All Questions' : 'Expand All Questions'}
          </button>
        </div>

        {/* Accessible 6-Item Accordion with Clean Hairline Dividers */}
        <div className="surface-card-ivory mt-10 divide-y divide-[#1F1B18]/[0.08] rounded-lg">
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
                    className="flex w-full cursor-pointer items-start justify-between gap-4 text-left focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#1F1B18]"
                  >
                    <div className="pr-2">
                      <span className="font-mono text-[11px] font-medium uppercase tracking-[0.06em] text-[#9E7B4F] tabular-nums">
                        0{idx + 1} · {item.category}
                      </span>
                      <span className="mt-1 block font-serif text-lg sm:text-xl font-semibold text-[#1F1B18]">
                        {item.question}
                      </span>
                    </div>
                    <span
                      className={`mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded border transition-all duration-200 ${
                        isOpen
                          ? 'rotate-180 border-[#9E7B4F] bg-[#9E7B4F] text-white'
                          : 'border-[#1F1B18]/[0.12] bg-[#F8F6F2] text-[#1F1B18]'
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
                  className={isOpen ? 'mt-4 pt-3.5 border-t border-[#1F1B18]/[0.08]' : 'hidden'}
                >
                  <p className="text-sm sm:text-base text-[#5E5650] leading-[1.68] max-w-[68ch]">
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
