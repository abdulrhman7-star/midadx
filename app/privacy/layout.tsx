import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'سياسة الخصوصية وأمان المستندات | Privacy Policy — midadd',
  description:
    'سياسة الخصوصية وحماية البيانات في منصة مداد (midadd). نوضح هنا كيفية المعالجة المحلية (Client-Side)، وسياسة ملفات تعريف الارتباط وإعلانات Google AdSense.',
  alternates: {
    canonical: 'https://midadd.com/privacy',
  },
  openGraph: {
    title: 'سياسة الخصوصية وأمان المستندات | مداد',
    description:
      'تعرف على سياسة الخصوصية وحماية المستندات وإعلانات AdSense في منصة مداد.',
    url: 'https://midadd.com/privacy',
  },
};

export default function PrivacyLayout({ children }: { children: React.ReactNode }) {
  return children;
}
