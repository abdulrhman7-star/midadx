import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'الملف الشخصي والمستندات | Profile — midadd',
  description: 'إدارة حسابك ورصيد الأرصدة والمستندات المحفوظة في منصة مداد (midadd).',
  alternates: {
    canonical: 'https://midadd.com/profile',
  },
};

export default function ProfileLayout({ children }: { children: React.ReactNode }) {
  return children;
}
