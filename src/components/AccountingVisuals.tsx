import React, { useState } from 'react';
import {
  Scale,
  FileSpreadsheet,
  ShieldCheck,
  CheckCircle2,
  BookOpen,
  Award,
  Layers,
  Eye,
} from 'lucide-react';
import heroLedgerImg from '../assets/images/accounting_audit_ledger_hero_1794850434820.jpg';
import auditWorkpapersImg from '../assets/images/statutory_audit_workpapers_1794850436673.jpg';
import chambersInteriorImg from '../assets/images/tax_advisory_boardroom_1794850437912.jpg';
import principalEmblemImg from '../assets/images/principal_chambers_emblem_1794850437795.jpg';

export const ACCOUNTING_IMAGES = {
  heroLedger: heroLedgerImg,
  auditWorkpapers: auditWorkpapersImg,
  chambersInterior: chambersInteriorImg,
  principalEmblem: principalEmblemImg,
};

interface EditorialAccountingImageProps {
  src: string;
  alt: string;
  caption?: string;
  subcaption?: string;
  aspectClass?: string;
  className?: string;
}

/**
 * Resilient editorial image container with Zero-Broken-Image fallback,
 * measured contrast scrim, and subtle hover depth transition.
 */
export const EditorialAccountingImage: React.FC<EditorialAccountingImageProps> = ({
  src,
  alt,
  caption,
  subcaption,
  aspectClass = 'aspect-4/3',
  className = '',
}) => {
  const [hasError, setHasError] = useState(false);

  return (
    <div
      className={`group relative overflow-hidden rounded-lg border border-[#E8DCC8] bg-[#EFE8DC] ${aspectClass} ${className}`}
    >
      {!hasError ? (
        <img
          src={src}
          alt={alt}
          decoding="async"
          referrerPolicy="no-referrer"
          onError={() => setHasError(true)}
          className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
        />
      ) : (
        <div className="flex h-full w-full flex-col items-center justify-center bg-gradient-to-br from-[#EFE8DC] via-[#F7F3EC] to-[#E8DCC8] p-6 text-center">
          <Scale className="h-10 w-10 text-[#A68352]" aria-hidden="true" />
          <p className="mt-3 font-serif text-sm font-semibold text-[#241F1C]">{alt}</p>
        </div>
      )}

      {/* Measured contrast scrim for editorial caption */}
      {(caption || subcaption) && (
        <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#241F1C]/88 via-[#241F1C]/50 to-transparent px-4 pt-10 pb-3.5 sm:px-5 sm:pb-4">
          {caption && (
            <p className="font-serif text-xs sm:text-sm font-semibold text-[#FBF8F3] tracking-wide">
              {caption}
            </p>
          )}
          {subcaption && (
            <p className="mt-0.5 text-[11px] text-[#EFE8DC]/90">
              {subcaption}
            </p>
          )}
        </div>
      )}
    </div>
  );
};

/**
 * Animated SVG Balance Scale & Double-Entry Trial Balance Strip for Hero Section
 */
export const HeroAccountingAnimationCard: React.FC<{
  showPhotoOverlay: boolean;
  onTogglePhotoOverlay: () => void;
}> = ({ showPhotoOverlay, onTogglePhotoOverlay }) => {
  return (
    <div className="border-t border-[#E8DCC8] bg-[#FBF8F3]/96 px-5 py-4 sm:px-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* Left: Animated SVG Balance Scale + Live Double-Entry Equilibrium */}
        <div className="flex items-center gap-3">
          <div className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-md border border-[#E8DCC8] bg-[#F7F3EC]">
            <svg
              viewBox="0 0 40 40"
              className="h-7 w-7"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              {/* Base & Pillar */}
              <path d="M12 34H28" stroke="#3B2F24" strokeWidth="2" strokeLinecap="round" />
              <path d="M20 10V34" stroke="#A68352" strokeWidth="1.8" strokeLinecap="round" />
              <polygon points="20,6 23,10 17,10" fill="#A68352" />
              {/* Animated Oscillating Balance Beam & Pans */}
              <g className="animate-balance-beam">
                <line x1="7" y1="13" x2="33" y2="13" stroke="#A68352" strokeWidth="1.8" strokeLinecap="round" />
                <line x1="9" y1="13" x2="6" y2="23" stroke="#5C4E40" strokeWidth="1" />
                <line x1="9" y1="13" x2="12" y2="23" stroke="#5C4E40" strokeWidth="1" />
                <path d="M5 23C5 25 13 25 13 23H5Z" fill="#1E3F32" />
                <line x1="31" y1="13" x2="28" y2="23" stroke="#5C4E40" strokeWidth="1" />
                <line x1="31" y1="13" x2="34" y2="23" stroke="#5C4E40" strokeWidth="1" />
                <path d="M27 23C27 25 35 25 35 23H27Z" fill="#A68352" />
              </g>
            </svg>
          </div>

          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-[#241F1C]">
              <span>Double-Entry Assurance Equilibrium</span>
              <span aria-hidden="true" className="text-[#A68352]">·</span>
              <span className="font-mono text-[11px] text-[#1E3F32] tabular-nums">DR ≡ CR</span>
            </div>
            {/* Animated Trial Balance Reconciliation Bars */}
            <div className="mt-1.5 flex items-center gap-2">
              <div className="h-1.5 w-20 overflow-hidden rounded-full bg-[#EFE8DC]">
                <div className="h-full w-full rounded-full bg-[#1E3F32] animate-ledger-bar" />
              </div>
              <div className="h-1.5 w-20 overflow-hidden rounded-full bg-[#EFE8DC]">
                <div
                  className="h-full w-full rounded-full bg-[#A68352] animate-ledger-bar"
                  style={{ animationDelay: '0.4s' }}
                />
              </div>
              <span className="text-[10.5px] font-medium text-[#5C4E40] tabular-nums">
                ISA · IFRS Verified
              </span>
            </div>
          </div>
        </div>

        {/* Right: Interactive Toggle between 3D Monolith & Editorial Audit Ledger Photo */}
        <button
          type="button"
          onClick={onTogglePhotoOverlay}
          className="inline-flex items-center gap-1.5 cursor-pointer whitespace-nowrap shrink-0 rounded-md border border-[#E8DCC8] bg-[#F7F3EC] px-3 py-1.5 text-xs font-medium text-[#3B2F24] hover:border-[#A68352] hover:bg-[#EFE8DC] transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3B2F24]"
        >
          {showPhotoOverlay ? (
            <>
              <Layers className="h-3.5 w-3.5 text-[#A68352]" aria-hidden="true" />
              <span>View 3D Monolith</span>
            </>
          ) : (
            <>
              <Eye className="h-3.5 w-3.5 text-[#A68352]" aria-hidden="true" />
              <span>View Audit Ledger Study</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

interface AuditScheduleTab {
  id: string;
  label: string;
  standard: string;
  title: string;
  subtitle: string;
  rows: { account: string; ref: string; debit: string; credit: string; status: string }[];
}

const AUDIT_SCHEDULE_TABS: AuditScheduleTab[] = [
  {
    id: 'trial-balance',
    label: 'Statutory Audit & Trial Balance',
    standard: 'ISA 500 · ISA 700',
    title: 'Substantive General Ledger & Trial Balance Verification',
    subtitle: 'Independent examination of assets, liabilities, equity, and revenue recognition.',
    rows: [
      { account: 'Cash & Bank Balances (Confirmed)', ref: 'WP-A10', debit: 'ETB 48,250,000', credit: '—', status: 'Verified' },
      { account: 'Trade Receivables & Allowance (IFRS 9)', ref: 'WP-B20', debit: 'ETB 31,400,000', credit: '—', status: 'Reconciled' },
      { account: 'Property, Plant & Equipment (IAS 16)', ref: 'WP-C30', debit: 'ETB 64,800,000', credit: '—', status: 'Inspected' },
      { account: 'Trade Payables & Statutory Accruals', ref: 'WP-D15', debit: '—', credit: 'ETB 52,150,000', status: 'Vouched' },
      { account: 'Share Capital & Retained Earnings', ref: 'WP-E05', debit: '—', credit: 'ETB 92,300,000', status: 'Attested' },
    ],
  },
  {
    id: 'ifrs-conversion',
    label: 'IFRS & IPSAS Reporting',
    standard: 'IAS 1 · IFRS 15 · IPSAS',
    title: 'International Financial Reporting Standards Conversion Schedule',
    subtitle: 'Technical disclosure notes, fair-value adjustments, and donor fund accountability.',
    rows: [
      { account: 'IFRS 16 Right-of-Use Lease Assets', ref: 'IFRS-16', debit: 'ETB 18,900,000', credit: '—', status: 'Recognized' },
      { account: 'IFRS 15 Contract Revenue Allocation', ref: 'IFRS-15', debit: '—', credit: 'ETB 18,900,000', status: 'Measured' },
      { account: 'IAS 19 Employee Benefit Obligations', ref: 'IAS-19', debit: 'ETB 6,420,000', credit: '—', status: 'Actuarial' },
      { account: 'IPSAS Restricted Donor Grant Fund', ref: 'IPSAS-23', debit: '—', credit: 'ETB 6,420,000', status: 'Compliant' },
    ],
  },
  {
    id: 'tax-compliance',
    label: 'Tax Advisory & Declarations',
    standard: 'Proclamation 979/2016',
    title: 'Corporate Income Tax, VAT & Withholding Reconciliation',
    subtitle: 'Statutory tax health check, deductible expense verification, and authority filing.',
    rows: [
      { account: 'Schedule C Corporate Taxable Profit', ref: 'TAX-101', debit: 'ETB 42,600,000', credit: '—', status: 'Computed' },
      { account: 'Withholding Tax Credits (2% / 30%)', ref: 'TAX-204', debit: 'ETB 8,150,000', credit: '—', status: 'Vouched' },
      { account: 'Monthly VAT Output vs Input Ledger', ref: 'VAT-309', debit: '—', credit: 'ETB 50,750,000', status: 'Cleared' },
    ],
  },
];

/**
 * Interactive Accounting & Audit Workpapers Showcase for Services Section
 */
export const ServicesAccountingShowcase: React.FC = () => {
  const [activeTabId, setActiveTabId] = useState<string>(AUDIT_SCHEDULE_TABS[0].id);
  const activeTab =
    AUDIT_SCHEDULE_TABS.find((t) => t.id === activeTabId) || AUDIT_SCHEDULE_TABS[0];

  return (
    <div className="mt-10 rounded-lg border border-[#E8DCC8] bg-[#FBF8F3]/95 p-5 sm:p-7 shadow-xs">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-stretch">
        {/* Left Column: Documentary Audit Workpapers Photography with Animated Scan Line */}
        <div className="lg:col-span-5 flex flex-col justify-between">
          <div className="relative overflow-hidden rounded-lg border border-[#E8DCC8]">
            <EditorialAccountingImage
              src={ACCOUNTING_IMAGES.auditWorkpapers}
              alt="Executive statutory audit working papers, trial balance schedules, and brass magnifying glass"
              caption="Statutory Audit & Financial Statement Examination"
              subcaption="Principal-led working paper review under ISA, IFRS, and Ethiopian regulatory standards"
              aspectClass="aspect-16/10 sm:aspect-16/9 lg:aspect-4/3"
              className="border-0 rounded-none"
            />
            {/* Subtle Animated Audit Verification Sweep Line */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-0 top-0 h-12 bg-gradient-to-b from-transparent via-[#A68352]/20 to-transparent animate-audit-scan"
            />
          </div>

          {/* Animated SVG Financial Assurance Curve & Telemetry Footer */}
          <div className="mt-4 flex items-center justify-between gap-4 rounded-md border border-[#E8DCC8] bg-[#F7F3EC] px-4 py-3">
            <div>
              <p className="text-xs font-semibold text-[#241F1C]">
                Analytical Variance &amp; Materiality Curve
              </p>
              <p className="text-[11px] text-[#5C4E40]">
                Substantive analytical procedures · ISA 520
              </p>
            </div>
            <svg
              viewBox="0 0 140 36"
              className="h-9 w-32 shrink-0"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <line x1="0" y1="30" x2="140" y2="30" stroke="#E8DCC8" strokeWidth="1" />
              <line x1="0" y1="18" x2="140" y2="18" stroke="#E8DCC8" strokeWidth="0.75" strokeDasharray="3 3" />
              <path
                d="M4 26 C 24 24, 34 14, 54 16 C 74 18, 88 8, 110 10 C 122 11, 130 6, 136 5"
                stroke="#A68352"
                strokeWidth="2.2"
                strokeLinecap="round"
                className="animate-audit-curve"
              />
              <circle cx="54" cy="16" r="2.5" fill="#1E3F32" />
              <circle cx="110" cy="10" r="2.5" fill="#1E3F32" />
              <circle cx="136" cy="5" r="3" fill="#A68352" />
            </svg>
          </div>
        </div>

        {/* Right Column: Interactive Animated General Ledger & Trial Balance Workpaper */}
        <div className="lg:col-span-7 flex flex-col justify-between rounded-lg border border-[#E8DCC8] bg-[#F7F3EC]/85 p-4 sm:p-6">
          <div>
            {/* Interactive Schedule Switcher Tabs */}
            <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-[#E8DCC8]">
              <div
                role="tablist"
                aria-label="Accounting and Audit Workpaper Schedules"
                className="flex flex-wrap items-center gap-1.5"
              >
                {AUDIT_SCHEDULE_TABS.map((tab) => {
                  const isSelected = tab.id === activeTab.id;
                  return (
                    <button
                      key={tab.id}
                      role="tab"
                      type="button"
                      aria-selected={isSelected}
                      onClick={() => setActiveTabId(tab.id)}
                      className={`cursor-pointer whitespace-nowrap shrink-0 rounded-md px-3 py-1.5 text-xs font-medium transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3B2F24] ${
                        isSelected
                          ? 'bg-[#241F1C] text-[#FBF8F3] shadow-2xs'
                          : 'bg-[#FBF8F3] text-[#5C4E40] border border-[#E8DCC8] hover:border-[#A68352] hover:text-[#241F1C]'
                      }`}
                    >
                      {tab.label}
                    </button>
                  );
                })}
              </div>

              <span className="font-mono text-[11px] font-medium text-[#1E3F32] tabular-nums">
                {activeTab.standard}
              </span>
            </div>

            {/* Active Schedule Header */}
            <div className="mt-4">
              <h3 className="font-serif text-lg sm:text-xl font-semibold text-[#241F1C]">
                {activeTab.title}
              </h3>
              <p className="mt-1 text-xs sm:text-sm text-[#5C4E40]">
                {activeTab.subtitle}
              </p>
            </div>

            {/* Animated Tabular Ledger Schedule */}
            <div className="mt-4 overflow-x-auto rounded-md border border-[#E8DCC8] bg-[#FBF8F3]">
              <table className="w-full text-left border-collapse text-xs tabular-nums">
                <thead>
                  <tr className="border-b border-[#E8DCC8] bg-[#EFE8DC]/65 text-[11px] font-semibold text-[#3B2F24]">
                    <th className="py-2.5 px-3">Ledger Account / Schedule</th>
                    <th className="py-2.5 px-2.5 hidden sm:table-cell">W/P Ref</th>
                    <th className="py-2.5 px-3 text-right">Debit (DR)</th>
                    <th className="py-2.5 px-3 text-right">Credit (CR)</th>
                    <th className="py-2.5 px-3 text-right">Assurance</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E8DCC8]/70">
                  {activeTab.rows.map((row) => (
                    <tr
                      key={row.ref}
                      className="hover:bg-[#F7F3EC]/80 transition-colors duration-150"
                    >
                      <td className="py-2.5 px-3 font-medium text-[#241F1C]">
                        {row.account}
                      </td>
                      <td className="py-2.5 px-2.5 font-mono text-[11px] text-[#8A6A3B] hidden sm:table-cell">
                        {row.ref}
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono text-[#241F1C]">
                        {row.debit}
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono text-[#241F1C]">
                        {row.credit}
                      </td>
                      <td className="py-2.5 px-3 text-right">
                        <span className="inline-flex items-center gap-1 font-medium text-[#1E3F32]">
                          <CheckCircle2 className="h-3.5 w-3.5 text-[#1E3F32] shrink-0" aria-hidden="true" />
                          <span>{row.status}</span>
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Bottom Reconciliation Status Bar */}
          <div className="mt-4 pt-3 border-t border-[#E8DCC8] flex flex-wrap items-center justify-between gap-2 text-xs text-[#5C4E40]">
            <div className="flex items-center gap-2">
              <FileSpreadsheet className="h-4 w-4 text-[#A68352]" aria-hidden="true" />
              <span>Double-Entry Trial Balance Equilibrium: <strong className="font-semibold text-[#1E3F32]">Unqualified / Balanced</strong></span>
            </div>
            <span className="font-mono text-[11px] text-[#8A6A3B] tabular-nums">
              Variance: 0.00%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * Practice Chambers Image & Animated Audit Quality Card for About Section
 */
export const AboutChambersVisualCard: React.FC = () => {
  return (
    <div className="mt-8 overflow-hidden rounded-lg border border-[#E8DCC8] bg-[#FBF8F3]/95 shadow-2xs">
      <div className="grid grid-cols-1 sm:grid-cols-12 items-stretch">
        <div className="sm:col-span-7 relative overflow-hidden">
          <EditorialAccountingImage
            src={ACCOUNTING_IMAGES.chambersInterior}
            alt="Tibebe Mengistu Chartered Certified Accountants practice chambers and statutory library"
            caption="Practice Chambers · Addis Ababa"
            subcaption="Bole, Abyssinia Plaza, 6th Floor"
            aspectClass="aspect-4/3 sm:aspect-auto sm:h-full min-h-[220px] w-full"
            className="border-0 rounded-none"
          />
        </div>
        <div className="sm:col-span-5 relative z-10 flex flex-col justify-between p-5 bg-[#FBF8F3] border-t sm:border-t-0 sm:border-l border-[#E8DCC8]">
          <div>
            <p className="text-[11px] font-semibold text-[#1E3F32]">
              IESBA &amp; ISQM 1 Quality Management
            </p>
            <h4 className="mt-1 font-serif text-base font-semibold text-[#241F1C]">
              Methodical Evidence &amp; Custody
            </h4>
            <p className="mt-2 text-xs text-[#5C4E40] leading-relaxed">
              Every engagement file undergoes multi-stage technical review, statutory cross-referencing, and strict archival custody.
            </p>
          </div>

          {/* Animated Quality Assurance Bars */}
          <div className="mt-4 space-y-2.5 pt-3 border-t border-[#E8DCC8]">
            <div>
              <div className="flex justify-between text-[11px] font-medium text-[#241F1C] tabular-nums">
                <span>ISA Audit Evidence Rigor</span>
                <span>100%</span>
              </div>
              <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-[#EFE8DC]">
                <div className="h-full w-full rounded-full bg-[#1E3F32] animate-ledger-bar" />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-[11px] font-medium text-[#241F1C] tabular-nums">
                <span>IFRS / IPSAS Disclosure Review</span>
                <span>100%</span>
              </div>
              <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-[#EFE8DC]">
                <div
                  className="h-full w-full rounded-full bg-[#A68352] animate-ledger-bar"
                  style={{ animationDelay: '0.6s' }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * Principal Attestation Dossier & Animated Brass Assurance Seal for Team Section
 */
export const PrincipalAttestationVisualCard: React.FC = () => {
  return (
    <div className="mt-6 overflow-hidden rounded-lg border border-[#E8DCC8] bg-[#F7F3EC] p-4 sm:p-5">
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-5 items-center">
        <div className="sm:col-span-5">
          <EditorialAccountingImage
            src={ACCOUNTING_IMAGES.principalEmblem}
            alt="Embossed brass audit attestation seal and signed financial statement dossier"
            aspectClass="aspect-4/3"
          />
        </div>
        <div className="sm:col-span-7 flex flex-col justify-between">
          <div className="flex items-center gap-3.5">
            {/* Animated Rotating Brass Assurance Seal SVG */}
            <div className="relative flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-[#A68352]/40 bg-[#FBF8F3] shadow-2xs">
              <svg
                viewBox="0 0 64 64"
                className="h-12 w-12"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <g className="animate-seal-ring">
                  <circle
                    cx="32"
                    cy="32"
                    r="27"
                    stroke="#A68352"
                    strokeWidth="1.4"
                    strokeDasharray="4 3"
                  />
                  <polygon points="32,3 34,7 30,7" fill="#A68352" />
                  <polygon points="32,61 34,57 30,57" fill="#A68352" />
                  <polygon points="3,32 7,34 7,30" fill="#A68352" />
                  <polygon points="61,32 57,34 57,30" fill="#A68352" />
                </g>
                <circle cx="32" cy="32" r="20" stroke="#1E3F32" strokeWidth="1.2" />
                <text
                  x="32"
                  y="30"
                  textAnchor="middle"
                  fill="#241F1C"
                  className="font-serif text-[9px] font-bold"
                >
                  FCCA
                </text>
                <text
                  x="32"
                  y="39"
                  textAnchor="middle"
                  fill="#8A6A3B"
                  className="font-sans text-[6.5px] font-semibold"
                >
                  ATTESTED
                </text>
              </svg>
            </div>

            <div>
              <p className="text-xs font-semibold text-[#1E3F32]">
                Direct Principal Sign-Off &amp; Seal
              </p>
              <h5 className="font-serif text-base font-semibold text-[#241F1C]">
                Independent Auditor’s Opinion Custody
              </h5>
            </div>
          </div>

          <p className="mt-3 text-xs text-[#5C4E40] leading-relaxed">
            Every statutory external audit report, tax computation, due diligence memorandum, and liquidation schedule is personally reviewed and attested by <strong className="font-medium text-[#241F1C]">Tibebe Mengistu, BA, FCCA</strong>.
          </p>

          <div className="mt-3 pt-2.5 border-t border-[#E8DCC8] flex items-center justify-between text-[11px] text-[#5C4E40] tabular-nums">
            <span className="inline-flex items-center gap-1.5 font-medium text-[#3B2F24]">
              <ShieldCheck className="h-3.5 w-3.5 text-[#1E3F32]" aria-hidden="true" />
              <span>UK Chartered Certified · Ethiopia Authorized</span>
            </span>
            <span className="font-mono text-[#8A6A3B]">Est. May 2011</span>
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * Animated 4-Stage Audit Workpaper Flow Ribbon for Process Section
 */
export const ProcessAuditFlowStrip: React.FC<{ activeStep: number; onSelectStep: (idx: number) => void }> = ({
  activeStep,
  onSelectStep,
}) => {
  const stages = [
    { idx: 0, code: 'WP-01', label: 'Engagement & Independence Charter', icon: BookOpen },
    { idx: 1, code: 'WP-02', label: 'Risk Matrix & Materiality Plan', icon: Scale },
    { idx: 2, code: 'WP-03', label: 'Substantive Ledger Verification', icon: FileSpreadsheet },
    { idx: 3, code: 'WP-04', label: 'Signed Auditor’s Opinion & Report', icon: Award },
  ];

  return (
    <div className="mt-8 rounded-lg border border-[#E8DCC8] bg-[#FBF8F3]/95 p-4 sm:p-5 shadow-2xs">
      <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-[#E8DCC8]">
        <div className="flex items-center gap-2 text-xs font-semibold text-[#241F1C]">
          <FileSpreadsheet className="h-4 w-4 text-[#A68352]" aria-hidden="true" />
          <span>Interactive Audit Working-Paper Progression</span>
        </div>
        <span className="font-mono text-[11px] text-[#1E3F32] tabular-nums">
          Active Workpaper: WP-0{activeStep + 1} / WP-04
        </span>
      </div>

      {/* Animated Progress Bar Linking the 4 Stages */}
      <div className="mt-3.5 h-1.5 w-full overflow-hidden rounded-full bg-[#EFE8DC]">
        <div
          className="h-full rounded-full bg-gradient-to-r from-[#1E3F32] via-[#A68352] to-[#8A6A3B] transition-all duration-300 ease-out"
          style={{ width: `${((activeStep + 1) / 4) * 100}%` }}
        />
      </div>

      <div className="mt-3.5 grid grid-cols-1 gap-2 sm:grid-cols-4">
        {stages.map((st) => {
          const IconComp = st.icon;
          const isCurrent = activeStep === st.idx;
          return (
            <button
              key={st.code}
              type="button"
              onClick={() => onSelectStep(st.idx)}
              className={`flex items-center gap-2.5 cursor-pointer rounded-md border px-3 py-2 text-left transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3B2F24] ${
                isCurrent
                  ? 'border-[#A68352] bg-[#F7F3EC] text-[#241F1C]'
                  : 'border-transparent bg-transparent text-[#5C4E40] hover:bg-[#F7F3EC]/60 hover:text-[#241F1C]'
              }`}
            >
              <IconComp
                className={`h-4 w-4 shrink-0 ${isCurrent ? 'text-[#A68352]' : 'text-[#5C4E40]'}`}
                aria-hidden="true"
              />
              <div className="min-w-0">
                <p className="font-mono text-[10.5px] font-semibold text-[#8A6A3B] tabular-nums">
                  {st.code}
                </p>
                <p className="truncate text-xs font-medium text-[#241F1C]">
                  {st.label}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
