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
  ExternalLink,
  Copy,
  Check,
  Download,
  MessageSquare,
  Inbox,
  Trash2,
} from 'lucide-react';
import { FIRM_INFO, SERVICES } from '../data/firmData';
import {
  ConsultationFormInput,
  ConsultationFormErrors,
  validateConsultationForm,
  formatInquiryReference,
  buildInquiryDispatchLinks,
  InquiryDispatchLinks,
} from '../utils/validation';
import { ScrollReveal3D } from './ScrollReveal3D';
import { Tilt3DCard } from './Tilt3DCard';

interface ContactSectionProps {
  selectedService: string;
}

type DeliveryChannel = 'email_relay' | 'email_client' | 'whatsapp';
type RelayStatus = 'idle' | 'sending' | 'delivered' | 'direct_fallback';

interface StoredInquiryRecord {
  referenceCode: string;
  submittedAt: string;
  data: ConsultationFormInput;
  dispatchLinks: InquiryDispatchLinks;
}

const STORAGE_KEY = 'tmc_consultation_inquiries_v1';

export const ContactSection: React.FC<ContactSectionProps> = ({ selectedService }) => {
  const [formData, setFormData] = useState<ConsultationFormInput>({
    name: '',
    email: '',
    phone: '',
    company: '',
    serviceNeeded: selectedService || '',
    message: '',
  });

  const [deliveryChannel, setDeliveryChannel] = useState<DeliveryChannel>('email_relay');
  const [errors, setErrors] = useState<ConsultationFormErrors>({});
  const [relayStatus, setRelayStatus] = useState<RelayStatus>('idle');
  const [relayNote, setRelayNote] = useState<string>('');
  const [copiedState, setCopiedState] = useState<boolean>(false);
  const [savedInquiries, setSavedInquiries] = useState<StoredInquiryRecord[]>([]);
  const [showSavedLog, setShowSavedLog] = useState<boolean>(false);

  const [submittedRecord, setSubmittedRecord] = useState<StoredInquiryRecord | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as StoredInquiryRecord[];
        if (Array.isArray(parsed)) {
          setSavedInquiries(parsed);
        }
      }
    } catch {
      // Ignore storage access restrictions
    }
  }, []);

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

  const triggerProgrammaticAnchor = (href: string, newTab: boolean = false) => {
    const anchor = document.createElement('a');
    anchor.href = href;
    if (newTab) {
      anchor.target = '_blank';
      anchor.rel = 'noopener noreferrer';
    }
    anchor.style.display = 'none';
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
  };

  const handleCopyInquiry = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedState(true);
      window.setTimeout(() => setCopiedState(false), 2500);
    } catch {
      setCopiedState(false);
    }
  };

  const handleDownloadInquiryTxt = (record: StoredInquiryRecord) => {
    const blob = new Blob([record.dispatchLinks.plainTextBody], {
      type: 'text/plain;charset=utf-8',
    });
    const url = URL.createObjectURL(blob);
    triggerProgrammaticAnchor(url, false);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${record.referenceCode}-Consultation-Inquiry.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  const handleClearSavedInquiries = () => {
    setSavedInquiries([]);
    setShowSavedLog(false);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Ignore
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const validation = validateConsultationForm(formData);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    const referenceCode = formatInquiryReference(formData.company, formData.serviceNeeded);
    const dispatchLinks = buildInquiryDispatchLinks(
      formData,
      referenceCode,
      FIRM_INFO.emailPlaceholder,
      '251911516027'
    );

    const record: StoredInquiryRecord = {
      referenceCode,
      submittedAt: new Date().toLocaleString('en-US', {
        dateStyle: 'medium',
        timeStyle: 'short',
      }),
      data: { ...formData },
      dispatchLinks,
    };

    // Save locally on this device so no submission is ever lost
    const updatedList = [record, ...savedInquiries].slice(0, 20);
    setSavedInquiries(updatedList);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedList));
    } catch {
      // Ignore storage quota errors
    }

    setSubmittedRecord(record);
    setErrors({});
    setRelayStatus('sending');
    setRelayNote(`Dispatching inquiry to ${FIRM_INFO.emailPlaceholder}...`);

    // If the user explicitly chose direct Email Client or WhatsApp, launch it right away
    if (deliveryChannel === 'email_client') {
      triggerProgrammaticAnchor(dispatchLinks.mailtoHref, false);
    } else if (deliveryChannel === 'whatsapp') {
      triggerProgrammaticAnchor(dispatchLinks.whatsappHref, true);
    }

    // Always attempt automated background email relay to Tibebe@Tibebemengistu.com
    const customEndpoint = (import.meta.env.VITE_FORM_ENDPOINT as string | undefined)?.trim();
    const endpoint =
      customEndpoint || `https://formsubmit.co/ajax/${FIRM_INFO.emailPlaceholder}`;

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          _subject: dispatchLinks.subject,
          _replyto: formData.email.trim(),
          _template: 'table',
          _captcha: 'false',
          Inquiry_Reference: referenceCode,
          Full_Name: formData.name.trim(),
          Professional_Email: formData.email.trim(),
          Telephone_Number: formData.phone.trim(),
          Organization_Name: formData.company.trim(),
          Service_Needed: formData.serviceNeeded.trim(),
          Engagement_Details: formData.message.trim(),
        }),
      });

      const resultJson = (await response.json().catch(() => null)) as {
        success?: string | boolean;
        message?: string;
      } | null;

      if (
        response.ok &&
        resultJson &&
        (resultJson.success === 'true' || resultJson.success === true)
      ) {
        setRelayStatus('delivered');
        setRelayNote(
          `Your consultation request has been dispatched directly to ${FIRM_INFO.emailPlaceholder}. You may also use the direct buttons below to send an immediate copy via your email client or WhatsApp.`
        );
      } else {
        setRelayStatus('direct_fallback');
        setRelayNote(
          `Your inquiry has been formatted with reference ${referenceCode}. Select "Send via Email App", "Open in Gmail Web", or "Send via WhatsApp" below to transmit directly to ${FIRM_INFO.emailPlaceholder}.`
        );
      }
    } catch {
      setRelayStatus('direct_fallback');
      setRelayNote(
        `Your inquiry has been formatted with reference ${referenceCode}. Select "Send via Email App", "Open in Gmail Web", or "Send via WhatsApp" below to transmit directly to ${FIRM_INFO.emailPlaceholder}.`
      );
    }
  };

  const handleReset = () => {
    setSubmittedRecord(null);
    setRelayStatus('idle');
    setRelayNote('');
    setCopiedState(false);
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
      className="section-veil-alabaster border-b border-[#1F1B18]/[0.08] pt-12 pb-16 sm:pt-14 sm:pb-20"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <ScrollReveal3D className="max-w-3xl">
          <p className="text-[11px] sm:text-xs font-semibold uppercase tracking-[0.12em] text-[#1D3B2F]">
            Engage With Us · Confidential Consultation
          </p>
          <h2
            id="contact-heading"
            className="mt-2.5 font-serif text-2xl sm:text-4xl font-semibold tracking-tight text-[#1F1B18] leading-[1.18] text-balance"
          >
            Request a Professional Consultation
          </h2>
          <p className="mt-4 text-base text-[#5E5650] leading-[1.65] max-w-[65ch]">
            Discuss your upcoming external audit, donor grant attestation, tax advisory, due diligence audit, or company liquidation requirement directly with our Owner &amp; Principal. All inquiries are routed directly to <strong className="font-medium text-[#1F1B18]">{FIRM_INFO.emailPlaceholder}</strong> and treated with strict confidentiality.
          </p>
        </ScrollReveal3D>

        <div className="mt-12 grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-start">
          {/* Left Column: Consultation Form or Confirmation & Direct Dispatch State */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            <div className="surface-card-ivory rounded-lg p-6 sm:p-8">
              {submittedRecord ? (
                <div role="status" aria-live="polite" className="py-1">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-[#2F4A3A]/10 text-[#2F4A3A]">
                      <CheckCircle2 className="h-6 w-6" aria-hidden="true" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-[#2F4A3A]">
                        Ref: {submittedRecord.referenceCode}
                      </p>
                      <h3 className="font-serif text-2xl font-semibold text-[#2B2118]">
                        Consultation Inquiry Ready &amp; Logged
                      </h3>
                    </div>
                  </div>

                  <p className="mt-3 text-sm sm:text-base text-[#5C4E40] leading-relaxed">
                    Thank you, <strong className="font-medium text-[#2B2118]">{submittedRecord.data.name}</strong>. Your inquiry on behalf of <strong className="font-medium text-[#2B2118]">{submittedRecord.data.company}</strong> is addressed to <strong className="font-medium text-[#2B2118]">{FIRM_INFO.principalName}</strong> ({FIRM_INFO.emailPlaceholder}).
                  </p>

                  {/* Automated Email Relay Status Banner */}
                  <div
                    className={`mt-4 rounded-md border px-4 py-3 text-xs leading-relaxed ${
                      relayStatus === 'delivered'
                        ? 'border-[#2F4A3A]/30 bg-[#2F4A3A]/8 text-[#2F4A3A]'
                        : 'border-[#8A6A3B]/35 bg-[#F5EFE6] text-[#3B2F24]'
                    }`}
                  >
                    <p className="font-semibold">
                      {relayStatus === 'sending'
                        ? 'Sending automated email notification...'
                        : relayStatus === 'delivered'
                        ? `Email Relay Confirmed → ${FIRM_INFO.emailPlaceholder}`
                        : `Direct Delivery Channels Ready → ${FIRM_INFO.emailPlaceholder}`}
                    </p>
                    <p className="mt-0.5 text-[#5C4E40]">{relayNote}</p>
                  </div>

                  {/* Direct 1-Click Delivery Channels (Guaranteed Receipt on Any Device) */}
                  <div className="mt-5 rounded-md border border-[#E8DCC8] bg-[#F5EFE6]/65 p-4">
                    <p className="text-xs font-semibold text-[#2B2118]">
                      Send or Forward Directly to Principal Chambers:
                    </p>
                    <p className="mt-0.5 text-[11px] text-[#5C4E40]">
                      Click any channel below to open your pre-filled inquiry addressed directly to {FIRM_INFO.emailPlaceholder} or {FIRM_INFO.phonePlaceholder}:
                    </p>

                    <div className="mt-3 grid grid-cols-1 gap-2.5 sm:grid-cols-3">
                      <a
                        href={submittedRecord.dispatchLinks.mailtoHref}
                        className="btn-3d-primary inline-flex items-center justify-center gap-2 rounded-md bg-[#8A6A3B] px-3.5 py-2.5 text-xs font-medium text-white hover:bg-[#6F5430] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2B2118]"
                      >
                        <Mail className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                        <span>Send via Email App</span>
                      </a>

                      <a
                        href={submittedRecord.dispatchLinks.gmailComposeHref}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-3d-secondary inline-flex items-center justify-center gap-2 rounded-md border border-[#8A6A3B]/45 bg-[#FBF8F3] px-3.5 py-2.5 text-xs font-medium text-[#2B2118] hover:bg-[#E8DCC8]/60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3B2F24]"
                      >
                        <ExternalLink className="h-3.5 w-3.5 shrink-0 text-[#6F5430]" aria-hidden="true" />
                        <span>Open in Gmail Web</span>
                      </a>

                      <a
                        href={submittedRecord.dispatchLinks.whatsappHref}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-3d-secondary inline-flex items-center justify-center gap-2 rounded-md border border-[#2F4A3A]/40 bg-[#FBF8F3] px-3.5 py-2.5 text-xs font-medium text-[#2F4A3A] hover:bg-[#2F4A3A]/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2F4A3A]"
                      >
                        <MessageSquare className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                        <span>Send via WhatsApp</span>
                      </a>
                    </div>
                  </div>

                  {/* Summary of Submitted Fields */}
                  <dl className="mt-5 border-y border-[#E8DCC8] py-4 text-xs sm:text-sm space-y-2.5">
                    <div className="flex flex-wrap justify-between gap-2">
                      <dt className="text-[#5C4E40]">Inquiry Reference:</dt>
                      <dd className="font-mono font-semibold text-[#2B2118] tabular-nums">
                        {submittedRecord.referenceCode}
                      </dd>
                    </div>
                    <div className="flex flex-wrap justify-between gap-2">
                      <dt className="text-[#5C4E40]">Organization:</dt>
                      <dd className="font-medium text-[#2B2118]">
                        {submittedRecord.data.company}
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
                    <div className="pt-1">
                      <dt className="text-[#5C4E40]">Engagement Details:</dt>
                      <dd className="mt-1 rounded bg-[#F5EFE6] p-2.5 text-xs text-[#2B2118] whitespace-pre-wrap">
                        {submittedRecord.data.message}
                      </dd>
                    </div>
                  </dl>

                  {/* Copy, Download & Reset Actions */}
                  <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
                    <div className="flex flex-wrap items-center gap-2.5">
                      <button
                        type="button"
                        onClick={() =>
                          handleCopyInquiry(submittedRecord.dispatchLinks.plainTextBody)
                        }
                        className="inline-flex items-center gap-1.5 cursor-pointer rounded-md border border-[#E8DCC8] bg-[#F5EFE6] px-3 py-2 text-xs font-medium text-[#2B2118] hover:border-[#8A6A3B] transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3B2F24]"
                      >
                        {copiedState ? (
                          <>
                            <Check className="h-3.5 w-3.5 text-[#2F4A3A]" aria-hidden="true" />
                            <span>Copied to Clipboard</span>
                          </>
                        ) : (
                          <>
                            <Copy className="h-3.5 w-3.5 text-[#6F5430]" aria-hidden="true" />
                            <span>Copy Inquiry Text</span>
                          </>
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDownloadInquiryTxt(submittedRecord)}
                        className="inline-flex items-center gap-1.5 cursor-pointer rounded-md border border-[#E8DCC8] bg-[#F5EFE6] px-3 py-2 text-xs font-medium text-[#2B2118] hover:border-[#8A6A3B] transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3B2F24]"
                      >
                        <Download className="h-3.5 w-3.5 text-[#6F5430]" aria-hidden="true" />
                        <span>Download .TXT Copy</span>
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={handleReset}
                      className="inline-flex items-center gap-1.5 cursor-pointer rounded-md border border-[#8A6A3B]/50 bg-[#FBF8F3] px-3.5 py-2 text-xs font-medium text-[#2B2118] hover:bg-[#E8DCC8]/50 transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3B2F24]"
                    >
                      <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
                      <span>Submit Another Inquiry</span>
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} noValidate aria-label="Request a Consultation Form">
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <div>
                      <h3 className="font-serif text-xl font-semibold text-[#2B2118]">
                        Engagement Inquiry Form
                      </h3>
                      <p className="mt-1 text-xs text-[#5C4E40]">
                        All fields marked with an asterisk (*) are required.
                      </p>
                    </div>
                    <span className="text-[11px] font-medium text-[#2F4A3A]">
                      Recipient: {FIRM_INFO.emailPlaceholder}
                    </span>
                  </div>

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

                  {/* Delivery Channel Selection */}
                  <fieldset className="mt-5 pt-4 border-t border-[#E8DCC8]/80">
                    <legend className="text-xs font-semibold text-[#2B2118]">
                      Preferred Dispatch Method
                    </legend>
                    <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-3">
                      <label
                        className={`flex items-center gap-2 rounded-md border px-3 py-2 text-xs cursor-pointer transition-colors ${
                          deliveryChannel === 'email_relay'
                            ? 'border-[#8A6A3B] bg-[#F5EFE6] font-medium text-[#2B2118]'
                            : 'border-[#E8DCC8] bg-[#FBF8F3] text-[#5C4E40] hover:border-[#8A6A3B]/50'
                        }`}
                      >
                        <input
                          type="radio"
                          name="deliveryChannel"
                          value="email_relay"
                          checked={deliveryChannel === 'email_relay'}
                          onChange={() => setDeliveryChannel('email_relay')}
                          className="accent-[#8A6A3B]"
                        />
                        <span>Direct Email Relay</span>
                      </label>

                      <label
                        className={`flex items-center gap-2 rounded-md border px-3 py-2 text-xs cursor-pointer transition-colors ${
                          deliveryChannel === 'email_client'
                            ? 'border-[#8A6A3B] bg-[#F5EFE6] font-medium text-[#2B2118]'
                            : 'border-[#E8DCC8] bg-[#FBF8F3] text-[#5C4E40] hover:border-[#8A6A3B]/50'
                        }`}
                      >
                        <input
                          type="radio"
                          name="deliveryChannel"
                          value="email_client"
                          checked={deliveryChannel === 'email_client'}
                          onChange={() => setDeliveryChannel('email_client')}
                          className="accent-[#8A6A3B]"
                        />
                        <span>Open Email App</span>
                      </label>

                      <label
                        className={`flex items-center gap-2 rounded-md border px-3 py-2 text-xs cursor-pointer transition-colors ${
                          deliveryChannel === 'whatsapp'
                            ? 'border-[#8A6A3B] bg-[#F5EFE6] font-medium text-[#2B2118]'
                            : 'border-[#E8DCC8] bg-[#FBF8F3] text-[#5C4E40] hover:border-[#8A6A3B]/50'
                        }`}
                      >
                        <input
                          type="radio"
                          name="deliveryChannel"
                          value="whatsapp"
                          checked={deliveryChannel === 'whatsapp'}
                          onChange={() => setDeliveryChannel('whatsapp')}
                          className="accent-[#8A6A3B]"
                        />
                        <span>WhatsApp (+251 911...)</span>
                      </label>
                    </div>
                  </fieldset>

                  <div className="mt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <p className="text-xs text-[#5E5650]">
                      Protected by professional non-disclosure standards.
                    </p>
                    <button
                      type="submit"
                      className="btn-executive-primary inline-flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap shrink-0 rounded-md px-6 py-3 text-sm font-medium focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1F1B18]"
                    >
                      <Send className="h-4 w-4" aria-hidden="true" />
                      <span>Submit Consultation Request</span>
                    </button>
                  </div>
                </form>
              )}
            </div>

            {/* Saved Inquiries Log on This Device */}
            {savedInquiries.length > 0 && (
              <div className="rounded-lg border border-[#1F1B18]/[0.08] bg-[#FCFBF9] px-5 py-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => setShowSavedLog((prev) => !prev)}
                    aria-expanded={showSavedLog}
                    className="inline-flex items-center gap-2 cursor-pointer text-xs font-semibold text-[#3B2F24] hover:text-[#2B2118] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3B2F24]"
                  >
                    <Inbox className="h-4 w-4 text-[#8A6A3B]" aria-hidden="true" />
                    <span>
                      Submitted Inquiries Log on This Device ({savedInquiries.length})
                    </span>
                  </button>

                  {showSavedLog && (
                    <button
                      type="button"
                      onClick={handleClearSavedInquiries}
                      className="inline-flex items-center gap-1 cursor-pointer text-[11px] font-medium text-[#5C4E40] hover:text-red-800"
                    >
                      <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                      <span>Clear Log</span>
                    </button>
                  )}
                </div>

                {showSavedLog && (
                  <div className="mt-4 divide-y divide-[#E8DCC8] border-t border-[#E8DCC8] pt-3 space-y-3">
                    {savedInquiries.map((item, idx) => (
                      <div key={`${item.referenceCode}-${idx}`} className={idx > 0 ? 'pt-3' : ''}>
                        <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                          <span className="font-mono font-semibold text-[#2B2118]">
                            {item.referenceCode} · {item.data.company}
                          </span>
                          <span className="text-[11px] text-[#5C4E40]">{item.submittedAt}</span>
                        </div>
                        <p className="mt-0.5 text-xs text-[#5C4E40]">
                          {item.data.name} ({item.data.email} · {item.data.phone}) —{' '}
                          <strong className="font-medium text-[#2B2118]">
                            {item.data.serviceNeeded}
                          </strong>
                        </p>
                        <div className="mt-2 flex flex-wrap items-center gap-3 text-[11px] font-medium">
                          <a
                            href={item.dispatchLinks.mailtoHref}
                            className="text-[#6F5430] hover:text-[#2B2118] underline underline-offset-4"
                          >
                            Send via Email App
                          </a>
                          <a
                            href={item.dispatchLinks.gmailComposeHref}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[#6F5430] hover:text-[#2B2118] underline underline-offset-4"
                          >
                            Open in Gmail
                          </a>
                          <a
                            href={item.dispatchLinks.whatsappHref}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[#2F4A3A] hover:text-[#2B2118] underline underline-offset-4"
                          >
                            Send via WhatsApp
                          </a>
                          <button
                            type="button"
                            onClick={() => handleDownloadInquiryTxt(item)}
                            className="cursor-pointer text-[#5C4E40] hover:text-[#2B2118] underline underline-offset-4"
                          >
                            Download .TXT
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right Column: Office Address, Phone, Email, Hours & Map Placeholder */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            <Tilt3DCard className="surface-card-ivory rounded-lg p-6 sm:p-8">
              <h3 className="font-serif text-xl font-semibold text-[#1F1B18]">
                Office &amp; Direct Contact
              </h3>
              <p className="mt-1 text-xs text-[#5E5650]">
                Direct chambers contact information and consultation hours.
              </p>

              <dl className="mt-6 space-y-5 text-sm">
                <div className="flex items-start gap-3.5">
                  <MapPin className="h-5 w-5 text-[#9E7B4F] shrink-0 mt-0.5" aria-hidden="true" />
                  <div>
                    <dt className="font-semibold text-[#1F1B18]">Office Address</dt>
                    <dd className="mt-1 text-[#5E5650] leading-relaxed">
                      <a
                        href={FIRM_INFO.mapUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="cursor-pointer hover:text-[#1F1B18] hover:underline underline-offset-4 transition-colors duration-150"
                      >
                        {FIRM_INFO.addressPlaceholder}
                      </a>
                    </dd>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <Phone className="h-5 w-5 text-[#9E7B4F] shrink-0 mt-0.5" aria-hidden="true" />
                  <div>
                    <dt className="font-semibold text-[#1F1B18]">Telephone</dt>
                    <dd className="mt-1 text-[#5E5650] tabular-nums">
                      <a
                        href="tel:+251911516027"
                        className="cursor-pointer hover:text-[#1F1B18] hover:underline underline-offset-4 transition-colors duration-150"
                      >
                        {FIRM_INFO.phonePlaceholder}
                      </a>
                    </dd>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <Mail className="h-5 w-5 text-[#9E7B4F] shrink-0 mt-0.5" aria-hidden="true" />
                  <div>
                    <dt className="font-semibold text-[#1F1B18]">Electronic Mail</dt>
                    <dd className="mt-1 text-[#5E5650] break-all">
                      <a
                        href={`mailto:${FIRM_INFO.emailPlaceholder}`}
                        className="cursor-pointer hover:text-[#1F1B18] hover:underline underline-offset-4 transition-colors duration-150"
                      >
                        {FIRM_INFO.emailPlaceholder}
                      </a>
                    </dd>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <Clock className="h-5 w-5 text-[#9E7B4F] shrink-0 mt-0.5" aria-hidden="true" />
                  <div>
                    <dt className="font-semibold text-[#1F1B18]">Office Hours</dt>
                    <dd className="mt-1 text-[#5E5650] leading-relaxed">
                      {FIRM_INFO.hoursPlaceholder}
                    </dd>
                  </div>
                </div>
              </dl>
            </Tilt3DCard>

            {/* Interactive Office Location Map & Google Maps Link */}
            <div
              role="region"
              aria-label="Office Location Map"
              className="surface-card-ivory overflow-hidden rounded-lg"
            >
              <div className="relative h-56 w-full bg-[#F2EFE9]">
                <iframe
                  title={`${FIRM_INFO.name} Office Location — Bole, Abyssinia Plaza`}
                  src={FIRM_INFO.mapEmbedUrl}
                  className="h-full w-full border-0"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
              <div className="border-t border-[#1F1B18]/[0.08] p-5 sm:px-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  <p className="font-serif text-sm font-semibold text-[#1F1B18]">
                    {FIRM_INFO.name} — Practice Chambers
                  </p>
                  <p className="mt-0.5 text-xs text-[#5E5650]">
                    {FIRM_INFO.mapCoordinatesPlaceholder}
                  </p>
                </div>
                <a
                  href={FIRM_INFO.mapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 cursor-pointer whitespace-nowrap shrink-0 text-xs font-semibold text-[#9E7B4F] hover:text-[#1F1B18] hover:underline underline-offset-4 transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1F1B18]"
                >
                  <span>Open in Google Maps</span>
                  <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
