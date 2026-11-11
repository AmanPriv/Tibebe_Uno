import React, { useState, useEffect } from 'react';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  CheckCircle2,
  AlertCircle,
  Send,
  RotateCcw,
} from 'lucide-react';
import { FIRM_INFO, SERVICES } from '../data/firmData';
import {
  ConsultationFormInput,
  ConsultationFormErrors,
  validateConsultationForm,
  formatInquiryReference,
} from '../utils/validation';

interface ContactSectionProps {
  selectedService: string;
}

export const ContactSection: React.FC<ContactSectionProps> = ({ selectedService }) => {
  const [formData, setFormData] = useState<ConsultationFormInput>({
    name: '',
    email: '',
    phone: '',
    company: '',
    serviceNeeded: selectedService || '',
    message: '',
  });

  const [errors, setErrors] = useState<ConsultationFormErrors>({});
  const [submittedRecord, setSubmittedRecord] = useState<{
    referenceCode: string;
    data: ConsultationFormInput;
  } | null>(null);

  useEffect(() => {
    if (selectedService) {
      setFormData((prev) => ({ ...prev, serviceNeeded: selectedService }));
      setErrors((prev) => ({ ...prev, serviceNeeded: undefined }));
    }
  }, [selectedService]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof ConsultationFormInput]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const validation = validateConsultationForm(formData);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    const referenceCode = formatInquiryReference(formData.company, formData.serviceNeeded);
    setSubmittedRecord({
      referenceCode,
      data: { ...formData },
    });
    setErrors({});
  };

  const handleReset = () => {
    setSubmittedRecord(null);
    setFormData({
      name: '',
      email: '',
      phone: '',
      company: '',
      serviceNeeded: '',
      message: '',
    });
    setErrors({});
  };

  return (
    <section
      id="contact"
      aria-labelledby="contact-heading"
      className="border-b border-[#E8DCC8] bg-[#E8DCC8]/35 py-16 sm:py-24"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <p className="text-xs sm:text-sm font-medium text-[#2F4A3A]">
            Engage With Us · Confidential Consultation
          </p>
          <h2
            id="contact-heading"
            className="mt-2 font-serif text-2xl sm:text-4xl font-semibold tracking-tight text-[#3B2F24] text-balance"
          >
            Request a Professional Consultation
          </h2>
          <p className="mt-4 text-base text-[#5C4E40] leading-[1.65] max-w-[65ch]">
            Discuss your upcoming statutory audit, donor grant attestation, tax compliance review, or advisory requirement directly with a senior partner. All inquiries are treated with strict confidentiality.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-start">
          {/* Left Column: Consultation Form or Confirmation State */}
          <div className="lg:col-span-7 rounded-lg border border-[#E8DCC8] bg-[#FBF8F3] p-6 sm:p-8 shadow-xs">
            {submittedRecord ? (
              <div
                role="status"
                aria-live="polite"
                className="py-2"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-md bg-[#2F4A3A]/10 text-[#2F4A3A]">
                  <CheckCircle2 className="h-6 w-6" aria-hidden="true" />
                </div>

                <h3 className="mt-4 font-serif text-2xl font-semibold text-[#2B2118]">
                  Consultation Request Received
                </h3>
                <p className="mt-2 text-sm sm:text-base text-[#5C4E40] leading-relaxed">
                  Thank you, <strong className="font-medium text-[#2B2118]">{submittedRecord.data.name}</strong>. Your inquiry on behalf of <strong className="font-medium text-[#2B2118]">{submittedRecord.data.company}</strong> has been logged for partner review. We respond to all formal inquiries within one business day.
                </p>

                <dl className="mt-6 border-y border-[#E8DCC8] py-4 text-xs sm:text-sm space-y-2.5">
                  <div className="flex flex-wrap justify-between gap-2">
                    <dt className="text-[#5C4E40]">Inquiry Reference:</dt>
                    <dd className="font-mono font-semibold text-[#2B2118] tabular-nums">
                      {submittedRecord.referenceCode}
                    </dd>
                  </div>
                  <div className="flex flex-wrap justify-between gap-2">
                    <dt className="text-[#5C4E40]">Service Requested:</dt>
                    <dd className="font-medium text-[#2B2118]">
                      {submittedRecord.data.serviceNeeded}
                    </dd>
                  </div>
                  <div className="flex flex-wrap justify-between gap-2">
                    <dt className="text-[#5C4E40]">Contact Details:</dt>
                    <dd className="text-[#2B2118]">
                      {submittedRecord.data.email} · {submittedRecord.data.phone}
                    </dd>
                  </div>
                </dl>

                <div className="mt-6">
                  <button
                    type="button"
                    onClick={handleReset}
                    className="inline-flex items-center gap-2 cursor-pointer rounded-md border border-[#8A6A3B]/50 bg-[#FBF8F3] px-4 py-2.5 text-xs sm:text-sm font-medium text-[#2B2118] hover:bg-[#E8DCC8]/50 transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3B2F24]"
                  >
                    <RotateCcw className="h-4 w-4" aria-hidden="true" />
                    <span>Submit Another Inquiry</span>
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate aria-label="Request a Consultation Form">
                <h3 className="font-serif text-xl font-semibold text-[#2B2118]">
                  Engagement Inquiry Form
                </h3>
                <p className="mt-1 text-xs text-[#5C4E40]">
                  All fields marked with an asterisk (*) are required.
                </p>

                <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2">
                  {/* Full Name */}
                  <div>
                    <label
                      htmlFor="contact-name"
                      className="block text-xs font-semibold text-[#2B2118]"
                    >
                      Full Name *
                    </label>
                    <input
                      id="contact-name"
                      name="name"
                      type="text"
                      autoComplete="name"
                      value={formData.name}
                      onChange={handleChange}
                      aria-invalid={Boolean(errors.name)}
                      aria-describedby={errors.name ? 'contact-name-error' : undefined}
                      placeholder="e.g., Ato Dawit Alemu"
                      className={`mt-1.5 block w-full rounded-md border px-3.5 py-2.5 text-sm text-[#2B2118] bg-[#F5EFE6]/60 placeholder:text-[#5C4E40]/60 focus:bg-[#FBF8F3] focus-visible:outline-2 focus-visible:outline-offset-0 focus-visible:outline-[#8A6A3B] ${
                        errors.name ? 'border-red-700' : 'border-[#E8DCC8]'
                      }`}
                    />
                    {errors.name && (
                      <p
                        id="contact-name-error"
                        role="alert"
                        className="mt-1.5 flex items-center gap-1 text-xs text-red-800"
                      >
                        <AlertCircle className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                        <span>{errors.name}</span>
                      </p>
                    )}
                  </div>

                  {/* Email Address */}
                  <div>
                    <label
                      htmlFor="contact-email"
                      className="block text-xs font-semibold text-[#2B2118]"
                    >
                      Professional Email *
                    </label>
                    <input
                      id="contact-email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      value={formData.email}
                      onChange={handleChange}
                      aria-invalid={Boolean(errors.email)}
                      aria-describedby={errors.email ? 'contact-email-error' : undefined}
                      placeholder="name@organization.com"
                      className={`mt-1.5 block w-full rounded-md border px-3.5 py-2.5 text-sm text-[#2B2118] bg-[#F5EFE6]/60 placeholder:text-[#5C4E40]/60 focus:bg-[#FBF8F3] focus-visible:outline-2 focus-visible:outline-offset-0 focus-visible:outline-[#8A6A3B] ${
                        errors.email ? 'border-red-700' : 'border-[#E8DCC8]'
                      }`}
                    />
                    {errors.email && (
                      <p
                        id="contact-email-error"
                        role="alert"
                        className="mt-1.5 flex items-center gap-1 text-xs text-red-800"
                      >
                        <AlertCircle className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                        <span>{errors.email}</span>
                      </p>
                    )}
                  </div>

                  {/* Phone Number */}
                  <div>
                    <label
                      htmlFor="contact-phone"
                      className="block text-xs font-semibold text-[#2B2118]"
                    >
                      Telephone Number *
                    </label>
                    <input
                      id="contact-phone"
                      name="phone"
                      type="tel"
                      autoComplete="tel"
                      value={formData.phone}
                      onChange={handleChange}
                      aria-invalid={Boolean(errors.phone)}
                      aria-describedby={errors.phone ? 'contact-phone-error' : undefined}
                      placeholder="+251 11 XXX XXXX"
                      className={`mt-1.5 block w-full rounded-md border px-3.5 py-2.5 text-sm text-[#2B2118] bg-[#F5EFE6]/60 placeholder:text-[#5C4E40]/60 focus:bg-[#FBF8F3] focus-visible:outline-2 focus-visible:outline-offset-0 focus-visible:outline-[#8A6A3B] ${
                        errors.phone ? 'border-red-700' : 'border-[#E8DCC8]'
                      }`}
                    />
                    {errors.phone && (
                      <p
                        id="contact-phone-error"
                        role="alert"
                        className="mt-1.5 flex items-center gap-1 text-xs text-red-800"
                      >
                        <AlertCircle className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                        <span>{errors.phone}</span>
                      </p>
                    )}
                  </div>

                  {/* Company / Organization */}
                  <div>
                    <label
                      htmlFor="contact-company"
                      className="block text-xs font-semibold text-[#2B2118]"
                    >
                      Organization / Company Name *
                    </label>
                    <input
                      id="contact-company"
                      name="company"
                      type="text"
                      autoComplete="organization"
                      value={formData.company}
                      onChange={handleChange}
                      aria-invalid={Boolean(errors.company)}
                      aria-describedby={errors.company ? 'contact-company-error' : undefined}
                      placeholder="Company, NGO, or Bank Name"
                      className={`mt-1.5 block w-full rounded-md border px-3.5 py-2.5 text-sm text-[#2B2118] bg-[#F5EFE6]/60 placeholder:text-[#5C4E40]/60 focus:bg-[#FBF8F3] focus-visible:outline-2 focus-visible:outline-offset-0 focus-visible:outline-[#8A6A3B] ${
                        errors.company ? 'border-red-700' : 'border-[#E8DCC8]'
                      }`}
                    />
                    {errors.company && (
                      <p
                        id="contact-company-error"
                        role="alert"
                        className="mt-1.5 flex items-center gap-1 text-xs text-red-800"
                      >
                        <AlertCircle className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                        <span>{errors.company}</span>
                      </p>
                    )}
                  </div>
                </div>

                {/* Service Needed */}
                <div className="mt-5">
                  <label
                    htmlFor="contact-service"
                    className="block text-xs font-semibold text-[#2B2118]"
                  >
                    Service Needed *
                  </label>
                  <select
                    id="contact-service"
                    name="serviceNeeded"
                    value={formData.serviceNeeded}
                    onChange={handleChange}
                    aria-invalid={Boolean(errors.serviceNeeded)}
                    aria-describedby={errors.serviceNeeded ? 'contact-service-error' : undefined}
                    className={`mt-1.5 block w-full cursor-pointer rounded-md border px-3.5 py-2.5 text-sm text-[#2B2118] bg-[#F5EFE6]/60 focus:bg-[#FBF8F3] focus-visible:outline-2 focus-visible:outline-offset-0 focus-visible:outline-[#8A6A3B] ${
                      errors.serviceNeeded ? 'border-red-700' : 'border-[#E8DCC8]'
                    }`}
                  >
                    <option value="">Select a primary service...</option>
                    {SERVICES.map((s) => (
                      <option key={s.id} value={s.title}>
                        {s.title}
                      </option>
                    ))}
                    <option value="Combined Audit & Tax Engagement">
                      Combined Audit &amp; Tax Engagement
                    </option>
                  </select>
                  {errors.serviceNeeded && (
                    <p
                      id="contact-service-error"
                      role="alert"
                      className="mt-1.5 flex items-center gap-1 text-xs text-red-800"
                    >
                      <AlertCircle className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                      <span>{errors.serviceNeeded}</span>
                    </p>
                  )}
                </div>

                {/* Message */}
                <div className="mt-5">
                  <label
                    htmlFor="contact-message"
                    className="block text-xs font-semibold text-[#2B2118]"
                  >
                    Engagement Details &amp; Fiscal Year Timeline *
                  </label>
                  <textarea
                    id="contact-message"
                    name="message"
                    rows={4}
                    value={formData.message}
                    onChange={handleChange}
                    aria-invalid={Boolean(errors.message)}
                    aria-describedby={errors.message ? 'contact-message-error' : undefined}
                    placeholder="Please share your fiscal year-end, sector, and any target reporting deadlines..."
                    className={`mt-1.5 block w-full rounded-md border px-3.5 py-2.5 text-sm text-[#2B2118] bg-[#F5EFE6]/60 placeholder:text-[#5C4E40]/60 focus:bg-[#FBF8F3] focus-visible:outline-2 focus-visible:outline-offset-0 focus-visible:outline-[#8A6A3B] ${
                      errors.message ? 'border-red-700' : 'border-[#E8DCC8]'
                    }`}
                  />
                  {errors.message && (
                    <p
                      id="contact-message-error"
                      role="alert"
                      className="mt-1.5 flex items-center gap-1 text-xs text-red-800"
                    >
                      <AlertCircle className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                      <span>{errors.message}</span>
                    </p>
                  )}
                </div>

                <div className="mt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <p className="text-xs text-[#5C4E40]">
                    Protected by professional non-disclosure standards.
                  </p>
                  <button
                    type="submit"
                    className="inline-flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap shrink-0 rounded-md bg-[#8A6A3B] px-6 py-3 text-sm font-medium text-white shadow-xs hover:bg-[#6F5430] transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2B2118]"
                  >
                    <Send className="h-4 w-4" aria-hidden="true" />
                    <span>Submit Consultation Request</span>
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Right Column: Office Address, Phone, Email, Hours & Map Placeholder */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            <div className="rounded-lg border border-[#E8DCC8] bg-[#FBF8F3] p-6 sm:p-8 shadow-xs">
              <h3 className="font-serif text-xl font-semibold text-[#2B2118]">
                Office &amp; Direct Contact
              </h3>
              <p className="mt-1 text-xs text-[#5C4E40]">
                Replace bracketed placeholders below with final verified office details.
              </p>

              <dl className="mt-6 space-y-5 text-sm">
                <div className="flex items-start gap-3.5">
                  <MapPin className="h-5 w-5 text-[#8A6A3B] shrink-0 mt-0.5" aria-hidden="true" />
                  <div>
                    <dt className="font-semibold text-[#2B2118]">Office Address</dt>
                    <dd className="mt-1 text-[#5C4E40] leading-relaxed">
                      {FIRM_INFO.addressPlaceholder}
                    </dd>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <Phone className="h-5 w-5 text-[#8A6A3B] shrink-0 mt-0.5" aria-hidden="true" />
                  <div>
                    <dt className="font-semibold text-[#2B2118]">Telephone</dt>
                    <dd className="mt-1 text-[#5C4E40] tabular-nums">
                      <div>{FIRM_INFO.phonePlaceholder}</div>
                      <div className="mt-0.5">{FIRM_INFO.secondaryPhonePlaceholder}</div>
                    </dd>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <Mail className="h-5 w-5 text-[#8A6A3B] shrink-0 mt-0.5" aria-hidden="true" />
                  <div>
                    <dt className="font-semibold text-[#2B2118]">Electronic Mail</dt>
                    <dd className="mt-1 text-[#5C4E40] break-all">
                      {FIRM_INFO.emailPlaceholder}
                    </dd>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <Clock className="h-5 w-5 text-[#8A6A3B] shrink-0 mt-0.5" aria-hidden="true" />
                  <div>
                    <dt className="font-semibold text-[#2B2118]">Office Hours</dt>
                    <dd className="mt-1 text-[#5C4E40] leading-relaxed">
                      {FIRM_INFO.hoursPlaceholder}
                    </dd>
                  </div>
                </div>
              </dl>
            </div>

            {/* Clean Architectural Map Placeholder (Single Elevation) */}
            <div
              role="region"
              aria-label="Office Location Map Placeholder"
              className="relative overflow-hidden rounded-lg border border-[#E8DCC8] bg-[#FBF8F3] p-6 sm:p-8 shadow-xs flex flex-col items-center justify-center text-center min-h-[200px]"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-md border border-[#E8DCC8] bg-[#F5EFE6] text-[#6F5430]">
                <MapPin className="h-5 w-5" aria-hidden="true" />
              </div>
              <p className="mt-3.5 font-serif text-base font-semibold text-[#2B2118]">
                {FIRM_INFO.name} — Practice Chambers
              </p>
              <p className="mt-1.5 text-xs text-[#5C4E40] max-w-xs leading-relaxed">
                {FIRM_INFO.mapCoordinatesPlaceholder}
              </p>
              <p className="mt-3 text-xs text-[#2F4A3A] font-medium">
                In-person consultations available by prior appointment
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
