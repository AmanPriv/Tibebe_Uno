import test from 'node:test';
import assert from 'node:assert/strict';
import {
  validateConsultationForm,
  formatInquiryReference,
  shouldShowBackToTop,
} from './validation';
import { FIRM_INFO, SERVICES, CORE_VALUES, PROCESS_STEPS, INDUSTRIES, TEAM_MEMBERS, FAQ_ITEMS } from '../data/firmData';

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
