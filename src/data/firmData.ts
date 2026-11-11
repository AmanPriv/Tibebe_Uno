export interface ServiceItem {
  id: string;
  number: string;
  title: string;
  iconName:
    | 'ShieldCheck'
    | 'ClipboardCheck'
    | 'Scale'
    | 'BookOpen'
    | 'FileSpreadsheet'
    | 'Compass'
    | 'SearchCheck'
    | 'Users';
  summary: string;
  deliverables: string[];
  audience: string;
}

export interface ValueItem {
  id: string;
  title: string;
  description: string;
}

export interface ProcessStep {
  stepNumber: string;
  title: string;
  subtitle: string;
  description: string;
  deliverables: string;
}

export interface IndustryItem {
  id: string;
  name: string;
  focus: string;
  iconName:
    | 'HeartHandshake'
    | 'Factory'
    | 'Landmark'
    | 'Sprout'
    | 'Building2'
    | 'Store'
    | 'GraduationCap'
    | 'Stethoscope';
}

export interface TeamMember {
  id: string;
  initials: string;
  namePlaceholder: string;
  titlePlaceholder: string;
  credentialsPlaceholder: string;
  bioPlaceholder: string;
  focusAreas: string[];
}

export interface TestimonialItem {
  id: string;
  quotePlaceholder: string;
  clientNamePlaceholder: string;
  rolePlaceholder: string;
  organizationPlaceholder: string;
  engagementType: string;
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
  category: string;
}

export const FIRM_INFO = {
  name: 'Tibebe Mengistu & Co.',
  descriptor: 'Authorized Chartered Accountants',
  tagline: 'Clarity. Integrity. Assurance.',
  yearEstablishedPlaceholder: '[Year Established]',
  clientCountPlaceholder: '[Number of Clients]',
  regulatoryLicensePlaceholder: '[Regulatory Body & License Number]',
  managingPartnerPlaceholder: '[Managing Partner Name, FCCA / CPA]',
  jurisdictionPlaceholder: '[City, Country]',
  addressPlaceholder: '[Building Name, Floor / Suite, Street Address, City]',
  phonePlaceholder: '[+251 (0) 11 XXX XXXX / Primary Office Telephone]',
  secondaryPhonePlaceholder: '[+251 (0) 9XX XXX XXX / Direct Consultation Line]',
  emailPlaceholder: '[inquiries@tibebemengistu-audit.com]',
  hoursPlaceholder: '[Monday – Friday: 8:30 AM – 5:30 PM | Saturday: 9:00 AM – 12:30 PM]',
  mapCoordinatesPlaceholder: '[Map Embed / Office District & Landmark Directions]',
};

export const SERVICES: ServiceItem[] = [
  {
    id: 'statutory-audit',
    number: '01',
    title: 'Statutory Audit',
    iconName: 'ShieldCheck',
    summary:
      'Independent examination of annual financial statements in accordance with International Standards on Auditing (ISA) and national regulatory mandates.',
    deliverables: [
      'Independent Auditor’s Report',
      'Management Letter on Internal Controls',
      'Regulatory Filing Attestation',
    ],
    audience: 'Corporations, Banks, NGOs & Public Interest Entities',
  },
  {
    id: 'internal-audit',
    number: '02',
    title: 'Internal Audit & Risk Review',
    iconName: 'ClipboardCheck',
    summary:
      'Objective evaluation of operational governance, financial controls, procurement integrity, and enterprise risk mitigation frameworks.',
    deliverables: [
      'Risk Control Matrix & Gap Analysis',
      'Operational Compliance Audit',
      'Board Audit Committee Briefings',
    ],
    audience: 'Growing Enterprises, Financial Institutions & Boards',
  },
  {
    id: 'tax-planning',
    number: '03',
    title: 'Tax Planning & Compliance',
    iconName: 'Scale',
    summary:
      'Structured corporate tax advisory, timely statutory declarations, withholding and VAT reviews, and representation during tax authority assessments.',
    deliverables: [
      'Annual Corporate Income Tax Computation',
      'VAT, Withholding & Excise Health Checks',
      'Tax Clearance & Audit Representation',
    ],
    audience: 'Commercial Entities, Exporters & Multinationals',
  },
  {
    id: 'accounting-bookkeeping',
    number: '04',
    title: 'Accounting & Bookkeeping',
    iconName: 'BookOpen',
    summary:
      'Methodical maintenance of general ledgers, chart-of-accounts architecture, bank reconciliations, and monthly management reporting packages.',
    deliverables: [
      'Monthly Trial Balance & Ledger Close',
      'Fixed Asset Register Maintenance',
      'Chart of Accounts Restructuring',
    ],
    audience: 'SMEs, Foreign Subsidiaries & Project Offices',
  },
  {
    id: 'financial-reporting-ifrs',
    number: '05',
    title: 'Financial Reporting (IFRS)',
    iconName: 'FileSpreadsheet',
    summary:
      'First-time adoption, conversion, and ongoing preparation of financial statements compliant with International Financial Reporting Standards (IFRS) and IPSAS.',
    deliverables: [
      'IFRS / IPSAS Conversion Financial Statements',
      'Technical Disclosure Notes & Policies',
      'Impairment & Fair-Value Schedules',
    ],
    audience: 'Banks, Corporates & Donor-Funded Programs',
  },
  {
    id: 'business-advisory',
    number: '06',
    title: 'Business Advisory',
    iconName: 'Compass',
    summary:
      'Pragmatic financial structuring, working capital optimization, corporate governance charters, and strategic financial modeling for executive leadership.',
    deliverables: [
      'Financial Policies & Procedures Manual',
      'Working Capital & Cash Flow Models',
      'Corporate Restructuring Advisory',
    ],
    audience: 'Founders, Executive Teams & Institutional Boards',
  },
  {
    id: 'due-diligence',
    number: '07',
    title: 'Due Diligence & Feasibility Studies',
    iconName: 'SearchCheck',
    summary:
      'Rigorous financial and tax investigation for mergers, acquisitions, joint ventures, credit underwriting, and capital project viability assessments.',
    deliverables: [
      'Buy-Side / Sell-Side Financial Due Diligence',
      'Quality of Earnings & Historical Liability Review',
      'Bankable Project Feasibility Study',
    ],
    audience: 'Private Equity, Commercial Banks & Strategic Investors',
  },
  {
    id: 'payroll-support',
    number: '08',
    title: 'Payroll Support',
    iconName: 'Users',
    summary:
      'Confidential end-to-end payroll administration, employment income tax calculation, pension contributions, and severance compliance verification.',
    deliverables: [
      'Monthly Payroll Register & Payslips',
      'Income Tax & Pension Statutory Remittances',
      'Expatriate & Executive Payroll Administration',
    ],
    audience: 'NGOs, Corporate Employers & Diplomatic Missions',
  },
];

export const CORE_VALUES: ValueItem[] = [
  {
    id: 'integrity',
    title: 'Integrity',
    description:
      'Uncompromising adherence to professional ethics. Our opinions reflect what the evidence supports—never convenience or external pressure.',
  },
  {
    id: 'independence',
    title: 'Independence',
    description:
      'Strict objectivity in both fact and appearance, giving shareholders, lenders, donors, and regulators dependable assurance.',
  },
  {
    id: 'technical-excellence',
    title: 'Technical Excellence',
    description:
      'Rigorous application of ISA, IFRS, IPSAS, and prevailing tax statutes through partner-led supervision and multi-stage quality review.',
  },
  {
    id: 'confidentiality',
    title: 'Confidentiality',
    description:
      'Disciplined information custody and access controls to safeguard sensitive commercial, financial, and personnel records at every stage.',
  },
];

export const PROCESS_STEPS: ProcessStep[] = [
  {
    stepNumber: '01',
    title: 'Engage',
    subtitle: 'Scope Definition & Independence Clearance',
    description:
      'We begin by understanding your governance structure, reporting obligations, and statutory deadlines. We confirm ethical independence and formalize clear terms of reference in a detailed engagement letter.',
    deliverables: 'Independence Confirmation · Scope Charter · Engagement Letter',
  },
  {
    stepNumber: '02',
    title: 'Plan',
    subtitle: 'Risk Assessment & Audit Strategy',
    description:
      'Our partner-led team evaluates your internal control environment, industry-specific regulatory risks, and materiality thresholds to design a tailored audit or advisory work program.',
    deliverables: 'Audit Planning Memorandum · Document Request Schedule · Timeline',
  },
  {
    stepNumber: '03',
    title: 'Execute',
    subtitle: 'Substantive Testing & Technical Review',
    description:
      'We perform disciplined analytical procedures, sample verification, and statutory compliance checks with minimal disruption to your daily operations, maintaining transparent communication throughout fieldwork.',
    deliverables: 'Fieldwork Verification · Working Paper Review · Draft Findings Discussion',
  },
  {
    stepNumber: '04',
    title: 'Report & Advise',
    subtitle: 'Formal Opinion & Actionable Recommendations',
    description:
      'We issue our independent auditor’s opinion or advisory report alongside a practical Management Letter detailing internal control improvements and tax compliance safeguards.',
    deliverables: 'Signed Audit Report · Management Letter · Board Debriefing',
  },
];

export const INDUSTRIES: IndustryItem[] = [
  {
    id: 'ngos',
    name: 'NGOs & Development Agencies',
    focus: 'Donor fund accountability, IPSAS reporting, grant expenditure verification, and statutory civil society compliance.',
    iconName: 'HeartHandshake',
  },
  {
    id: 'manufacturing',
    name: 'Manufacturing & Industrial',
    focus: 'Inventory valuation, cost accounting controls, fixed asset verification, and customs/excise tax compliance.',
    iconName: 'Factory',
  },
  {
    id: 'banking-finance',
    name: 'Banking & Finance',
    focus: 'IFRS 9 expected credit loss review, regulatory capital adequacy, internal risk assurance, and statutory audits.',
    iconName: 'Landmark',
  },
  {
    id: 'agriculture',
    name: 'Agriculture & Agribusiness',
    focus: 'Biological asset accounting (IAS 41), export incentives, seasonal working capital controls, and cooperative audits.',
    iconName: 'Sprout',
  },
  {
    id: 'real-estate',
    name: 'Real Estate & Construction',
    focus: 'IFRS 15 revenue recognition over time, project cost controls, contractor withholding tax, and joint venture feasibility.',
    iconName: 'Building2',
  },
  {
    id: 'retail-trade',
    name: 'Retail, Import & Trade',
    focus: 'Multi-location stock reconciliation, point-of-sale internal controls, foreign exchange accounting, and VAT compliance.',
    iconName: 'Store',
  },
  {
    id: 'education',
    name: 'Education & Academic Institutions',
    focus: 'Endowment fund stewardship, tuition revenue assurance, payroll governance, and institutional budgeting.',
    iconName: 'GraduationCap',
  },
  {
    id: 'healthcare',
    name: 'Healthcare & Pharmaceuticals',
    focus: 'Medical inventory cycle counts, regulatory import compliance, equipment depreciation, and revenue cycle audits.',
    iconName: 'Stethoscope',
  },
];

export const TEAM_MEMBERS: TeamMember[] = [
  {
    id: 'partner-1',
    initials: 'TM',
    namePlaceholder: 'Tibebe Mengistu [Confirm Full Credentials]',
    titlePlaceholder: 'Managing Partner · Authorized Auditor',
    credentialsPlaceholder: '[FCCA / CPA / Authorized Practising Certificate No.]',
    bioPlaceholder:
      '[Placeholder Bio: Over XX years of public practice experience leading statutory audits, IFRS conversions, and high-level regulatory advisory for commercial enterprises, financial institutions, and international NGOs.]',
    focusAreas: ['Statutory Assurance', 'IFRS Implementation', 'Corporate Governance'],
  },
  {
    id: 'partner-2',
    initials: 'AP',
    namePlaceholder: '[Audit & Assurance Partner Name]',
    titlePlaceholder: 'Partner, Audit & Risk Assurance',
    credentialsPlaceholder: '[ACCA / CPA / CIA Qualification Placeholder]',
    bioPlaceholder:
      '[Placeholder Bio: Specializes in complex statutory audits, donor-funded project attestations, and internal control architecture across manufacturing, banking, and development sectors.]',
    focusAreas: ['Internal Control Reviews', 'NGO Grant Audits', 'Risk Advisory'],
  },
  {
    id: 'director-3',
    initials: 'TD',
    namePlaceholder: '[Tax & Advisory Director Name]',
    titlePlaceholder: 'Director, Tax Compliance & Transaction Advisory',
    credentialsPlaceholder: '[Master of Laws in Taxation / CPA Placeholder]',
    bioPlaceholder:
      '[Placeholder Bio: Leads corporate tax structuring, statutory tax health checks, financial due diligence, and investment feasibility studies for domestic and cross-border organizations.]',
    focusAreas: ['Tax Structuring', 'Financial Due Diligence', 'Feasibility Studies'],
  },
];

export const TESTIMONIALS: TestimonialItem[] = [
  {
    id: 'testimonial-1',
    quotePlaceholder:
      '[Placeholder Client Testimonial: "Tibebe Mengistu & Co. conducted our annual statutory audit and IFRS review with exceptional rigor. Their Management Letter gave our board clear, practical recommendations that strengthened our internal controls."]',
    clientNamePlaceholder: '[Client Executive Name Placeholder]',
    rolePlaceholder: '[Chief Financial Officer / Board Audit Chair]',
    organizationPlaceholder: '[Leading Commercial Enterprise / Financial Institution]',
    engagementType: 'Statutory Audit & IFRS Reporting',
  },
  {
    id: 'testimonial-2',
    quotePlaceholder:
      '[Placeholder Client Testimonial: "For our multi-donor development programs, timely and accurate grant audits are non-negotiable. The firm delivered thorough, independent verification ahead of every international reporting deadline."]',
    clientNamePlaceholder: '[Country Director / Finance Manager Name]',
    rolePlaceholder: '[Country Director]',
    organizationPlaceholder: '[International NGO / Development Agency Placeholder]',
    engagementType: 'Donor Grant Audit & Compliance',
  },
  {
    id: 'testimonial-3',
    quotePlaceholder:
      '[Placeholder Client Testimonial: "Their financial due diligence and tax compliance review provided the clarity we needed prior to expanding our manufacturing operations. Calm, objective, and technically thorough."]',
    clientNamePlaceholder: '[Managing Director Name Placeholder]',
    rolePlaceholder: '[Managing Director]',
    organizationPlaceholder: '[Industrial & Manufacturing Group Placeholder]',
    engagementType: 'Tax Compliance & Due Diligence',
  },
];

export const FAQ_ITEMS: FaqItem[] = [
  {
    id: 'faq-audit-involves',
    category: 'Audit Process',
    question: 'What does an independent statutory audit involve?',
    answer:
      'A statutory audit is an objective examination of your organization’s financial statements and underlying accounting records in accordance with International Standards on Auditing (ISA). Our process covers engagement planning, evaluation of internal financial controls, substantive testing of balances and transactions, verification of statutory tax obligations, and issuance of an Independent Auditor’s Report accompanied by a constructive Management Letter.',
  },
  {
    id: 'faq-timelines',
    category: 'Scheduling',
    question: 'How long does a typical audit or advisory engagement take?',
    answer:
      'Timelines depend on the size, complexity, and readiness of your financial records. Once trial balances and supporting schedules are provided, a standard statutory or project audit typically requires between two and four weeks from fieldwork commencement to draft report review. We establish a clear milestone schedule during the initial planning phase so statutory and donor filing deadlines are met without last-minute pressure.',
  },
  {
    id: 'faq-confidentiality',
    category: 'Data Protection',
    question: 'How do you protect the confidentiality of our financial and payroll records?',
    answer:
      'Strict confidentiality is a foundational ethical obligation of Chartered Accountants. Every member of our firm is bound by formal non-disclosure undertakings, and working papers are stored in access-controlled repositories accessible only to the assigned engagement team and quality review partner. We never disclose client information to third parties without explicit written authorization or statutory mandate.',
  },
  {
    id: 'faq-fees',
    category: 'Engagement Terms',
    question: 'How are professional fees determined and structured?',
    answer:
      'In accordance with professional standards, our fees are never contingent on audit outcomes or tax findings. Fees are calculated transparently based on the estimated time, technical complexity, and seniority of the staff required for the assignment. Following an initial scoping consultation, we provide a fixed-fee or phased engagement proposal with clearly defined deliverables and no hidden charges.',
  },
  {
    id: 'faq-documents',
    category: 'Preparation',
    question: 'What documents are needed to prepare for an upcoming audit?',
    answer:
      'Upon engagement, we provide a tailored Prepared-by-Client (PBC) schedule. Core records typically include the finalized trial balance, general ledger, bank statements and reconciliations, fixed asset register, inventory count sheets, revenue and procurement contracts, payroll registers, monthly tax declarations (VAT, withholding, income tax), board minutes, and prior-year audited financial statements.',
  },
  {
    id: 'faq-tax-deadlines',
    category: 'Tax & Compliance',
    question: 'How do you help organizations stay ahead of statutory tax and reporting deadlines?',
    answer:
      'Annual corporate tax filings, audited financial statement submissions, and monthly indirect tax declarations carry strict statutory cutoffs based on your fiscal year-end. We conduct pre-year-end tax health checks and interim audit reviews to identify reconciling items early, ensuring your financial statements and tax computations are finalized well ahead of regulatory submission dates.',
  },
];
