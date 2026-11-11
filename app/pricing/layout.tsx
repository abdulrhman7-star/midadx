import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'خطط الأسعار والأرصدة | Pricing — midadd',
  description:
    'استكشف خطط الأسعار والأرصدة الاقتصادية في منصة مداد (midadd). اشحن رصيدك لمرة واحدة دون أي التزامات شهرية لتنسيق مستندات Word وPDF.',
  alternates: {
    canonical: 'https://midadd.com/pricing',
  },
  openGraph: {
    title: 'خطط الأسعار | midadd',
    description: 'أسعار مرنة واقتصادية دون اشتراكات معقدة لتنسيق وتصدير نصوص الذكاء الاصطناعي.',
    url: 'https://midadd.com/pricing',
  },
};

export default function PricingLayout({ children }: { children: React.ReactNode }) {
  return children;
}
