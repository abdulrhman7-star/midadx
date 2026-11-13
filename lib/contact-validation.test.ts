import test from 'node:test';
import assert from 'node:assert/strict';
import { validateContactForm } from './contact-validation';

test('validateContactForm rejects empty and short fields', () => {
  const result = validateContactForm(
    {
      name: 'أ',
      email: 'invalid-email',
      subject: '',
      message: 'مرحبا',
      category: 'support',
    },
    true
  );

  assert.equal(result.valid, false);
  assert.ok(result.errors.name);
  assert.ok(result.errors.email);
  assert.ok(result.errors.message);
});

test('validateContactForm accepts valid input in Arabic and English', () => {
  const result = validateContactForm(
    {
      name: 'أحمد العلي',
      email: 'ahmed@example.com',
      subject: 'استفسار عن تصدير LaTeX',
      message: 'أحتاج مساعدة في تنسيق معادلة رياضية داخل ملف وورد.',
      category: 'support',
    },
    true
  );

  assert.equal(result.valid, true);
  assert.deepEqual(result.errors, {});
});
