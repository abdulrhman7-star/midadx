import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'سياسة الخصوصية وملفات تعريف الارتباط | Privacy Policy',
  description:
    'سياسة الخصوصية القانونية لمنصة مداد (midadd): توضيح شامل لملفات تعريف الارتباط (Cookies)، إعلانات Google AdSense، آلية تعطيل الإعلانات المخصصة، وحماية بيانات المستخدمين.',
  keywords: [
    'سياسة الخصوصية',
    'ملفات تعريف الارتباط',
    'Google AdSense Privacy',
    'Cookies Policy midadd',
  ],
  alternates: {
    canonical: 'https://midadd.com/privacy-policy',
  },
  openGraph: {
    title: 'سياسة الخصوصية | مداد midadd',
    description:
      'سياسة الخصوصية وملفات تعريف الارتباط وإعلانات الطرف الثالث في منصة مداد.',
    url: 'https://midadd.com/privacy-policy',
  },
};

export default function PrivacyPolicyRouteLayout({ children }: { children: React.ReactNode }) {
  return children;
}
