import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'تواصل معنا | Contact Us — midadd',
  description:
    'تواصل مع فريق الدعم الفني والاستفسارات في منصة مداد (midadd). نحن هنا لمساعدتك في استفسارات التصدير والدفع والشراكات الأكاديمية.',
  alternates: {
    canonical: 'https://midadd.com/contact',
  },
  openGraph: {
    title: 'تواصل معنا | midadd Support',
    description:
      'تواصل مع فريق الدعم الفني لمنصة مداد للإجابة عن استفسارات التنسيق والدعم الفني.',
    url: 'https://midadd.com/contact',
  },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children;
}
