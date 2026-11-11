import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'إنشاء حساب مجاني | Sign Up — midadd',
  description: 'أنشئ حساباً مجانياً في منصة مداد (midadd) واحصل على أرصدة لتنسيق وتصدير مستندات الذكاء الاصطناعي.',
  alternates: {
    canonical: 'https://midadd.com/signup',
  },
};

export default function SignupLayout({ children }: { children: React.ReactNode }) {
  return children;
}
