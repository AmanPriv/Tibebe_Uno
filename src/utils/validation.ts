export interface ConsultationFormInput {
  name: string;
  email: string;
  phone: string;
  company: string;
  serviceNeeded: string;
  message: string;
}

export type ConsultationFormErrors = Partial<Record<keyof ConsultationFormInput, string>>;

export interface ValidationResult {
  isValid: boolean;
  errors: ConsultationFormErrors;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE_REGEX = /^[+\d][\d\s().-]{6,22}$/;

export function validateConsultationForm(input: ConsultationFormInput): ValidationResult {
  const errors: ConsultationFormErrors = {};

  const name = input.name.trim();
  const email = input.email.trim();
  const phone = input.phone.trim();
  const company = input.company.trim();
  const serviceNeeded = input.serviceNeeded.trim();
  const message = input.message.trim();

  if (!name) {
    errors.name = 'Please enter your full name.';
  } else if (name.length < 2) {
    errors.name = 'Name must be at least 2 characters.';
  }

  if (!email) {
    errors.email = 'Please enter your professional email address.';
  } else if (!EMAIL_REGEX.test(email)) {
    errors.email = 'Please enter a valid email address (e.g., name@organization.com).';
  }

  if (!phone) {
    errors.phone = 'Please provide a contact telephone number.';
  } else if (!PHONE_REGEX.test(phone)) {
    errors.phone = 'Please enter a valid telephone number (at least 7 digits).';
  }

  if (!company) {
    errors.company = 'Please enter your company, NGO, or institution name.';
  }

  if (!serviceNeeded) {
    errors.serviceNeeded = 'Please select the primary service you require.';
  }

  if (!message) {
    errors.message = 'Please briefly describe your engagement requirements or timeline.';
  } else if (message.length < 15) {
    errors.message = 'Please provide at least 15 characters of context so we can route your inquiry.';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

export function formatInquiryReference(company: string, serviceNeeded: string): string {
  const cleanCompany =
    company
      .replace(/[^a-zA-Z0-9]/g, '')
      .toUpperCase()
      .slice(0, 4) || 'INQ';
  const cleanService =
    serviceNeeded
      .replace(/[^a-zA-Z0-9]/g, '')
      .toUpperCase()
      .slice(0, 3) || 'GEN';
  return `TMC-2026-${cleanService}-${cleanCompany}`;
}

export function shouldShowBackToTop(scrollY: number, heroHeight: number = 560): boolean {
  const threshold = heroHeight > 0 ? heroHeight : 560;
  return scrollY > threshold;
}

export interface CardTiltResult {
  rotateX: number;
  rotateY: number;
  glowX: number;
  glowY: number;
}

/**
 * Computes clamped 3D perspective tilt angles (in degrees) and highlight coordinates (0-100%)
 * from normalized pointer coordinates (0..1 within a card's bounding box).
 */
export function calculateCardTilt(
  normX: number,
  normY: number,
  maxDegrees: number = 6.5
): CardTiltResult {
  const clampedX = Math.max(0, Math.min(1, normX));
  const clampedY = Math.max(0, Math.min(1, normY));
  const limit = Math.max(0, Math.min(8, maxDegrees));

  // Center is (0.5, 0.5). Moving pointer right tilts +Y; moving pointer down tilts -X.
  const rotateY = Number(((clampedX - 0.5) * 2 * limit).toFixed(2));
  const rotateX = Number(((0.5 - clampedY) * 2 * limit).toFixed(2));
  const glowX = Math.round(clampedX * 100);
  const glowY = Math.round(clampedY * 100);

  return { rotateX, rotateY, glowX, glowY };
}

export interface InquiryDispatchLinks {
  subject: string;
  plainTextBody: string;
  mailtoHref: string;
  gmailComposeHref: string;
  outlookComposeHref: string;
  whatsappHref: string;
}

/**
 * Builds structured email subject, formatted body text, and direct dispatch URLs
 * (mailto, Gmail Web, Outlook Web, and WhatsApp) so the firm receives all form details.
 */
export function buildInquiryDispatchLinks(
  input: ConsultationFormInput,
  referenceCode: string,
  recipientEmail: string = 'Tibebe@Tibebemengistu.com',
  recipientPhoneDigits: string = '251911516027'
): InquiryDispatchLinks {
  const cleanName = input.name.trim();
  const cleanEmail = input.email.trim();
  const cleanPhone = input.phone.trim();
  const cleanCompany = input.company.trim();
  const cleanService = input.serviceNeeded.trim();
  const cleanMessage = input.message.trim();

  const subject = `Consultation Inquiry [${referenceCode}] — ${cleanCompany} (${cleanService})`;

  const plainTextBody = [
    'TIBEBE MENGISTU — ENGAGEMENT CONSULTATION INQUIRY',
    '==========================================================',
    `Inquiry Reference: ${referenceCode}`,
    `Service Requested: ${cleanService}`,
    '',
    'CLIENT & ORGANIZATION DETAILS',
    '----------------------------------------------------------',
    `Full Name:         ${cleanName}`,
    `Organization:      ${cleanCompany}`,
    `Professional Email:${cleanEmail ? ` ${cleanEmail}` : ''}`,
    `Telephone Number:  ${cleanPhone}`,
    '',
    'ENGAGEMENT DETAILS & FISCAL YEAR TIMELINE',
    '----------------------------------------------------------',
    cleanMessage,
    '',
    '----------------------------------------------------------',
    'Submitted via Tibebe Mengistu Official Website',
  ].join('\n');

  const encodedSubject = encodeURIComponent(subject);
  const encodedBody = encodeURIComponent(plainTextBody);
  const encodedRecipient = encodeURIComponent(recipientEmail);

  const mailtoHref = `mailto:${recipientEmail}?subject=${encodedSubject}&body=${encodedBody}`;
  const gmailComposeHref = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodedRecipient}&su=${encodedSubject}&body=${encodedBody}`;
  const outlookComposeHref = `https://outlook.office.com/mail/deeplink/compose?to=${encodedRecipient}&subject=${encodedSubject}&body=${encodedBody}`;

  const cleanDigits = recipientPhoneDigits.replace(/[^\d]/g, '');
  const whatsappText = [
    `*Tibebe Mengistu — Consultation Inquiry*`,
    `*Ref:* ${referenceCode}`,
    `*Name:* ${cleanName}`,
    `*Organization:* ${cleanCompany}`,
    `*Email:* ${cleanEmail}`,
    `*Phone:* ${cleanPhone}`,
    `*Service:* ${cleanService}`,
    `*Details:* ${cleanMessage}`,
  ].join('\n');
  const whatsappHref = `https://wa.me/${cleanDigits}?text=${encodeURIComponent(whatsappText)}`;

  return {
    subject,
    plainTextBody,
    mailtoHref,
    gmailComposeHref,
    outlookComposeHref,
    whatsappHref,
  };
}

export type ScrollytellingStageId =
  | 'hero'
  | 'services'
  | 'about'
  | 'process'
  | 'industries-team'
  | 'faq-contact';

export interface ScrollytellingStageState {
  stage: ScrollytellingStageId;
  stageLabel: string;
  cameraPos: [number, number, number];
  lookAtTarget: [number, number, number];
  monolithDeconstruct: number;
  monolithExit: number;
  pillarsRise: number;
  railProgress: number;
  horizonCalm: number;
}

/**
 * Pure interpolation helper mapping normalized scroll progress (0..1) across the 6 choreographed
 * architectural 3D stages (Hero -> Services -> About -> Process -> Sectors/Principal -> FAQ/Contact).
 */
export function computeScrollytellingStageState(progress: number): ScrollytellingStageState {
  const p = Math.max(0, Math.min(1, Number.isFinite(progress) ? progress : 0));

  const lerp = (a: number, b: number, t: number) => a + (b - a) * Math.max(0, Math.min(1, t));
  const lerpVec = (
    a: [number, number, number],
    b: [number, number, number],
    t: number
  ): [number, number, number] => [
    Number(lerp(a[0], b[0], t).toFixed(3)),
    Number(lerp(a[1], b[1], t).toFixed(3)),
    Number(lerp(a[2], b[2], t).toFixed(3)),
  ];

  // Keyframe anchors calibrated to the DOM section scroll ranges:
  // Hero (0.00..0.09), Services (0.10..0.29), About (0.30..0.41), Process (0.42..0.53),
  // Industries & Team (0.54..0.75), FAQ & Contact (0.76..1.00)
  const keyframes: {
    at: number;
    stage: ScrollytellingStageId;
    label: string;
    pos: [number, number, number];
    target: [number, number, number];
  }[] = [
    {
      at: 0.0,
      stage: 'hero',
      label: '01 · Architectural Balance & Ledger Monolith',
      pos: [0.0, 0.2, 6.2],
      target: [0.0, 0.08, 0.0],
    },
    {
      at: 0.18,
      stage: 'services',
      label: '02 · Nine Practice Ledger Plates (ISA · IFRS)',
      pos: [-0.85, 0.28, 7.1],
      target: [0.15, -0.05, -0.4],
    },
    {
      at: 0.35,
      stage: 'about',
      label: '03 · Four Interlocking IESBA Pillars',
      pos: [0.95, 0.45, 6.5],
      target: [-0.15, 0.15, -0.4],
    },
    {
      at: 0.47,
      stage: 'process',
      label: '04 · Four-Stage Engagement Timeline Rail',
      pos: [0.0, 0.65, 6.7],
      target: [0.0, 0.1, -0.5],
    },
    {
      at: 0.64,
      stage: 'industries-team',
      label: '05 · Sector & Principal Assurance Grid',
      pos: [0.0, 1.35, 8.1],
      target: [0.0, -0.15, -1.0],
    },
    {
      at: 1.0,
      stage: 'faq-contact',
      label: '06 · Calm Architectural Horizon',
      pos: [0.0, 1.85, 9.2],
      target: [0.0, -0.4, -1.5],
    },
  ];

  let idx = 0;
  for (let i = 0; i < keyframes.length - 1; i++) {
    if (p >= keyframes[i].at && p <= keyframes[i + 1].at) {
      idx = i;
      break;
    }
  }

  const curr = keyframes[idx];
  const next = keyframes[Math.min(idx + 1, keyframes.length - 1)];
  const span = Math.max(0.0001, next.at - curr.at);
  const localT = Math.max(0, Math.min(1, (p - curr.at) / span));
  // Smoothstep easing for unhurried architectural camera motion
  const smoothT = localT * localT * (3 - 2 * localT);

  const activeFrame = localT < 0.5 ? curr : next;

  // Stage-specific morph weights (0..1)
  const monolithDeconstruct =
    p < 0.06 ? 0 : p < 0.18 ? Number(((p - 0.06) / 0.12).toFixed(3)) : 1;
  const monolithExit =
    p < 0.26 ? 0 : p < 0.33 ? Number(((p - 0.26) / 0.07).toFixed(3)) : 1;
  const pillarsRise =
    p < 0.27
      ? 0
      : p < 0.34
        ? Number(((p - 0.27) / 0.07).toFixed(3))
        : p < 0.41
          ? 1
          : Math.max(0, Number((1 - (p - 0.41) / 0.06).toFixed(3)));
  const railProgress =
    p < 0.41 ? 0 : p < 0.54 ? Number(((p - 0.41) / 0.13).toFixed(3)) : 1;
  const horizonCalm =
    p < 0.72 ? 0 : Number(((p - 0.72) / 0.28).toFixed(3));

  return {
    stage: activeFrame.stage,
    stageLabel: activeFrame.label,
    cameraPos: lerpVec(curr.pos, next.pos, smoothT),
    lookAtTarget: lerpVec(curr.target, next.target, smoothT),
    monolithDeconstruct,
    monolithExit,
    pillarsRise,
    railProgress,
    horizonCalm,
  };
}

