import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'عن المنصة | About Us — midadd',
  description:
    'تعرّف على منصة مداد (midadd) ورسالتها في تحويل نصوص الذكاء الاصطناعي والأبحاث إلى مستندات Word وPDF احترافية مع دعم كامل للغة العربية والمعادلات الرياضية.',
  alternates: {
    canonical: 'https://midadd.com/about',
  },
  openGraph: {
    title: 'عن منصة مداد | About midadd',
    description:
      'منصة مداد لتحويل نصوص الذكاء الاصطناعي والرياضيات إلى مستندات وورد وPDF منسقة بأسلوب أكاديمي احترافي.',
    url: 'https://midadd.com/about',
  },
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return children;
}
