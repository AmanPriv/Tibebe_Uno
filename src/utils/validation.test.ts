import test from 'node:test';
import assert from 'node:assert/strict';
import {
  validateConsultationForm,
  formatInquiryReference,
  shouldShowBackToTop,
  calculateCardTilt,
  buildInquiryDispatchLinks,
  computeScrollytellingStageState,
} from './validation';
import { FIRM_INFO, SERVICES, CORE_VALUES, PROCESS_STEPS, INDUSTRIES, TEAM_MEMBERS, FAQ_ITEMS } from '../data/firmData';

test('computeScrollytellingStageState transitions smoothly across all 6 3D narrative chapters', () => {
  const heroState = computeScrollytellingStageState(0);
  assert.equal(heroState.stage, 'hero');
  assert.equal(heroState.monolithDeconstruct, 0);
  assert.equal(heroState.monolithExit, 0);
  assert.deepEqual(heroState.cameraPos, [0, 0.2, 6.2]);

  const servicesState = computeScrollytellingStageState(0.18);
  assert.equal(servicesState.stage, 'services');
  assert.equal(servicesState.monolithDeconstruct, 1);

  const aboutState = computeScrollytellingStageState(0.35);
  assert.equal(aboutState.stage, 'about');
  assert.equal(aboutState.monolithExit, 1);
  assert.ok(aboutState.pillarsRise > 0.8);

  const processState = computeScrollytellingStageState(0.47);
  assert.equal(processState.stage, 'process');
  assert.ok(processState.railProgress > 0.4);

  const horizonState = computeScrollytellingStageState(1.0);
  assert.equal(horizonState.stage, 'faq-contact');
  assert.equal(horizonState.horizonCalm, 1);
});

test('buildInquiryDispatchLinks constructs complete email, webmail, and WhatsApp dispatch URLs', () => {
  const sampleInput = {
    name: 'Ato Dawit Alemu',
    email: 'dawit.alemu@abyssiniacorp.et',
    phone: '+251 911 223 344',
    company: 'Abyssinia Trading PLC',
    serviceNeeded: 'Statutory & External Audit',
    message: 'We require an external statutory audit for fiscal year ending July 7, 2026.',
  };
  const refCode = formatInquiryReference(sampleInput.company, sampleInput.serviceNeeded);
  const links = buildInquiryDispatchLinks(sampleInput, refCode, FIRM_INFO.emailPlaceholder, '251911516027');

  assert.ok(links.subject.includes(refCode));
  assert.ok(links.subject.includes('Abyssinia Trading PLC'));
  assert.ok(links.plainTextBody.includes('Ato Dawit Alemu'));
  assert.ok(links.plainTextBody.includes('dawit.alemu@abyssiniacorp.et'));
  assert.ok(links.plainTextBody.includes('+251 911 223 344'));
  assert.ok(links.mailtoHref.startsWith('mailto:Tibebe@Tibebemengistu.com?subject='));
  assert.ok(links.gmailComposeHref.startsWith('https://mail.google.com/mail/?view=cm&fs=1&to='));
  assert.ok(links.whatsappHref.startsWith('https://wa.me/251911516027?text='));
});

test('calculateCardTilt returns zero tilt at center and respects max degree bounds', () => {
  const center = calculateCardTilt(0.5, 0.5, 6.5);
  assert.equal(center.rotateX, 0);
  assert.equal(center.rotateY, 0);
  assert.equal(center.glowX, 50);
  assert.equal(center.glowY, 50);

  const topLeft = calculateCardTilt(0, 0, 6.5);
  assert.equal(topLeft.rotateX, 6.5);
  assert.equal(topLeft.rotateY, -6.5);

  const bottomRight = calculateCardTilt(1, 1, 6.5);
  assert.equal(bottomRight.rotateX, -6.5);
  assert.equal(bottomRight.rotateY, 6.5);

  // Clamps out-of-range coordinates and enforces <= 8 deg cap
  const extreme = calculateCardTilt(2, -1, 12);
  assert.equal(extreme.rotateX, 8);
  assert.equal(extreme.rotateY, 8);
});

test('shouldShowBackToTop returns false within hero section and true after scrolling past hero', () => {
  assert.equal(shouldShowBackToTop(0, 620), false);
  assert.equal(shouldShowBackToTop(620, 620), false);
  assert.equal(shouldShowBackToTop(621, 620), true);
  assert.equal(shouldShowBackToTop(700, 0), true);
});

test('validateConsultationForm rejects empty fields with clear messages', () => {
  const result = validateConsultationForm({
    name: '',
    email: '',
    phone: '',
    company: '',
    serviceNeeded: '',
    message: '',
  });

  assert.equal(result.isValid, false);
  assert.ok(result.errors.name);
  assert.ok(result.errors.email);
  assert.ok(result.errors.phone);
  assert.ok(result.errors.company);
  assert.ok(result.errors.serviceNeeded);
  assert.ok(result.errors.message);
});

test('validateConsultationForm rejects malformed email, short phone, and short message', () => {
  const result = validateConsultationForm({
    name: 'Abebe Kebede',
    email: 'invalid-email',
    phone: '123',
    company: 'Horizon Bank',
    serviceNeeded: 'Statutory Audit',
    message: 'Too short',
  });

  assert.equal(result.isValid, false);
  assert.equal(result.errors.name, undefined);
  assert.ok(result.errors.email);
  assert.ok(result.errors.phone);
  assert.ok(result.errors.message);
});

test('validateConsultationForm accepts valid consultation inquiry', () => {
  const result = validateConsultationForm({
    name: 'Selamawit Tadesse',
    email: 's.tadesse@horizonngo.org',
    phone: '+251 11 554 3210',
    company: 'Horizon Relief Organization',
    serviceNeeded: 'Statutory Audit',
    message: 'We require an annual statutory and donor grant audit for FY 2026.',
  });

  assert.equal(result.isValid, true);
  assert.deepEqual(result.errors, {});
});

test('formatInquiryReference generates deterministic readable reference code', () => {
  const ref = formatInquiryReference('Horizon Bank SC', 'Statutory Audit');
  assert.equal(ref, 'TMC-2026-STA-HORI');
});

test('firmData satisfies all structural requirements and updated credentials', () => {
  assert.equal(FIRM_INFO.name, 'Tibebe Mengistu');
  assert.ok(!FIRM_INFO.name.includes('& Co.'));
  assert.ok(!TEAM_MEMBERS[0].bioPlaceholder.includes('& Co.'));
  assert.equal(SERVICES.length, 9);
  assert.ok(SERVICES.some((s) => s.title === 'Company Liquidation'));
  assert.equal(CORE_VALUES.length, 4);
  assert.equal(PROCESS_STEPS.length, 4);
  assert.equal(INDUSTRIES.length, 8);
  assert.equal(TEAM_MEMBERS.length, 1);
  assert.equal(TEAM_MEMBERS[0].namePlaceholder, 'Tibebe Mengistu, BA, FCCA');
  assert.equal(TEAM_MEMBERS[0].titlePlaceholder, 'Owner & Principal');
  assert.equal(FIRM_INFO.yearEstablishedPlaceholder, 'May 2011');
  assert.equal(FIRM_INFO.clientCountPlaceholder, 'Countless');
  assert.ok(FIRM_INFO.addressPlaceholder.includes('Bole, Abyssinia Plaza, 6th Floor'));
  assert.equal(FIRM_INFO.phonePlaceholder, '+251 911 516 027');
  assert.equal(FIRM_INFO.emailPlaceholder, 'Tibebe@Tibebemengistu.com');
  assert.equal(FIRM_INFO.hoursPlaceholder, 'Monday – Friday: 8:30 AM – 5:30 PM');
  assert.equal(FIRM_INFO.mapUrl, 'https://maps.app.goo.gl/TmEpxF8mNhRVDahY7');
  assert.equal(FAQ_ITEMS.length, 6);
});
