import React from 'react';
import { TEAM_MEMBERS } from '../data/firmData';

export const TeamSection: React.FC = () => {
  return (
    <section
      id="team"
      aria-labelledby="team-heading"
      className="border-b border-[#E8DCC8] bg-[#F5EFE6] py-16 sm:py-24"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <p className="text-xs sm:text-sm font-medium text-[#6F5430]">
            Leadership &amp; Supervision
          </p>
          <h2
            id="team-heading"
            className="mt-2 font-serif text-2xl sm:text-4xl font-semibold tracking-tight text-[#3B2F24] text-balance"
          >
            Partner-Led Engagement Team
          </h2>
          <p className="mt-4 text-base text-[#5C4E40] leading-[1.65] max-w-[65ch]">
            Every assignment at Tibebe Mengistu &amp; Co. is directly supervised by seasoned partners and directors who bring deep regulatory and industry insight.
          </p>
        </div>

        {/* 3 Partner / Manager Cards with Initials Avatars */}
        <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-3">
          {TEAM_MEMBERS.map((member) => (
            <article
              key={member.id}
              className="flex flex-col justify-between rounded-lg border border-[#E8DCC8] bg-[#FBF8F3] p-6 sm:p-8 shadow-xs"
            >
              <div>
                {/* Initials Avatar & Credentials */}
                <div className="flex items-center gap-4">
                  <div
                    aria-hidden="true"
                    className="flex h-14 w-14 shrink-0 items-center justify-center rounded-md border border-[#8A6A3B]/40 bg-[#F5EFE6] font-serif text-xl font-semibold text-[#3B2F24]"
                  >
                    {member.initials}
                  </div>
                  <div>
                    <h3 className="font-serif text-lg sm:text-xl font-semibold text-[#2B2118]">
                      {member.namePlaceholder}
                    </h3>
                    <p className="mt-0.5 text-xs font-medium text-[#6F5430]">
                      {member.titlePlaceholder}
                    </p>
                  </div>
                </div>

                {/* Qualification Placeholder */}
                <p className="mt-4 text-xs font-medium text-[#2F4A3A]">
                  Credentials: {member.credentialsPlaceholder}
                </p>

                {/* Short Bio Placeholder */}
                <p className="mt-3 text-sm text-[#5C4E40] leading-[1.65]">
                  {member.bioPlaceholder}
                </p>
              </div>

              {/* Clean Unboxed Focus Areas */}
              <div className="mt-6 pt-4 border-t border-[#E8DCC8]">
                <p className="text-[11px] font-semibold text-[#3B2F24]">
                  Practice Focus
                </p>
                <p className="mt-1 text-xs text-[#5C4E40]">
                  {member.focusAreas.join(' · ')}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};
