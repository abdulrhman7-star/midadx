export interface ContactFormInput {
  name: string;
  email: string;
  subject: string;
  message: string;
  category: string;
}

export interface ContactValidationResult {
  valid: boolean;
  errors: Partial<Record<keyof ContactFormInput, string>>;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function validateContactForm(
  input: ContactFormInput,
  isAr = true
): ContactValidationResult {
  const errors: Partial<Record<keyof ContactFormInput, string>> = {};
  const trimmedName = input.name.trim();
  const trimmedEmail = input.email.trim();
  const trimmedMessage = input.message.trim();

  if (trimmedName.length < 2) {
    errors.name = isAr
      ? 'يرجى إدخال الاسم الكامل (حرفان على الأقل).'
      : 'Please enter your full name (at least 2 characters).';
  }

  if (!trimmedEmail || !EMAIL_REGEX.test(trimmedEmail)) {
    errors.email = isAr
      ? 'يرجى إدخال بريد إلكتروني صحيح ليتمكن فريقنا من الرد عليك.'
      : 'Please enter a valid email address so we can reply.';
  }

  if (trimmedMessage.length < 15) {
    errors.message = isAr
      ? 'يرجى كتابة تفاصيل الرسالة بوضوح (15 حرفاً على الأقل).'
      : 'Please provide clear details in your message (at least 15 characters).';
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}
