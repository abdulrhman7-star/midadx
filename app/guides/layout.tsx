import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'الأدلة الإرشادية والمدونة | Guides & Blog',
  description:
    'مقالات وأدلة عملية من منصة مداد (midadd) حول تحويل نصوص ChatGPT وClaude إلى Word، تحويل معادلات LaTeX إلى OMML، وضبط المستندات العربية RTL.',
  keywords: [
    'دليل تحويل Markdown إلى Word',
    'تحويل معادلات LaTeX للعربية',
    'تنسيق أبحاث Word بالعربي',
    'مداد مدونة وأدلة',
  ],
  alternates: {
    canonical: 'https://midadd.com/guides',
  },
  openGraph: {
    title: 'الأدلة الإرشادية والمدونة | مداد midadd',
    description:
      'أدلة تقنية متخصصة في تنسيق مستندات الذكاء الاصطناعي، المعادلات الرياضية، واللغة العربية.',
    url: 'https://midadd.com/guides',
  },
};

export default function GuidesLayout({ children }: { children: React.ReactNode }) {
  return children;
}
