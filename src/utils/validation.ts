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

