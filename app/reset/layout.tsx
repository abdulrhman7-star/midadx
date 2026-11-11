import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'استعادة كلمة المرور | Reset Password — midadd',
  description: 'استعادة كلمة المرور لحسابك في منصة مداد (midadd).',
  alternates: {
    canonical: 'https://midadd.com/reset',
  },
};

export default function ResetLayout({ children }: { children: React.ReactNode }) {
  return children;
}
