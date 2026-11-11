import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'القوالب الجاهزة للمستندات والأبحاث | Templates — midadd',
  description:
    'مكتبة القوالب الأكاديمية والتقنية الجاهزة في منصة مداد (midadd). قوالب بحوث، تقارير ضريبية، وسير ذاتية منسقة وجاهزة للتعديل والتصدير.',
  alternates: {
    canonical: 'https://midadd.com/templates',
  },
  openGraph: {
    title: 'القوالب الجاهزة | midadd Templates',
    description: 'قوالب مستندات وأبحاث منسقة وجاهزة للتصدير المباشر لملفات Word وPDF.',
    url: 'https://midadd.com/templates',
  },
};

export default function TemplatesLayout({ children }: { children: React.ReactNode }) {
  return children;
}
