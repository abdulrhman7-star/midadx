import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'تسجيل الدخول | Sign In — midadd',
  description: 'سجل الدخول إلى حسابك في منصة مداد (midadd) لإدارة المستندات المحفوظة ورصيد التصدير.',
  alternates: {
    canonical: 'https://midadd.com/login',
  },
};

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return children;
}
