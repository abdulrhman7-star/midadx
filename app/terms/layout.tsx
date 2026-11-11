import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'شروط وأحكام الاستخدام | Terms of Service — midadd',
  description:
    'شروط وأحكام استخدام منصة مداد (midadd) لتنسيق وتصدير المستندات والأبحاث. تفاصيل الملكية الفكرية ونظام الأرصدة وإخلاء المسؤولية.',
  alternates: {
    canonical: 'https://midadd.com/terms',
  },
  openGraph: {
    title: 'شروط وأحكام الاستخدام | مداد',
    description:
      'الشروط والأحكام القانونية لاستخدام منصة مداد لتنسيق نصوص الذكاء الاصطناعي.',
    url: 'https://midadd.com/terms',
  },
};

export default function TermsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
