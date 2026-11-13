import type { Metadata, Viewport } from 'next';
import Script from 'next/script';
import './globals.css';
import 'katex/dist/katex.min.css';
import { AppProviders } from '@/components/AppProviders';

const ADSENSE_CLIENT_ID =
  process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID || 'ca-pub-7623404336729587';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#020617' },
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL('https://midadd.com'),
  title: {
    default: 'مداد | midadd — محول نصوص الذكاء الاصطناعي إلى Word وPDF باحترافية',
    template: '%s | مداد midadd',
  },
  description:
    'منصة مداد لتحويل نصوص Markdown من ChatGPT وClaude وGemini إلى مستندات Microsoft Word (.docx) وPDF وGoogle Docs مع الحفاظ التام على اللغة العربية RTL والمعادلات الرياضية LaTeX والجداول.',
  keywords: [
    'مداد',
    'midadd',
    'تحويل Markdown إلى Word',
    'تحويل نص ChatGPT إلى وورد',
    'محول نصوص الذكاء الاصطناعي',
    'معادلات LaTeX إلى Word',
    'OMML',
    'تنسيق المستندات العربية RTL',
    'AI Markdown to DOCX',
    'Markdown to PDF Arabic',
  ],
  authors: [{ name: 'midadd Team', url: 'https://midadd.com' }],
  creator: 'midadd',
  publisher: 'midadd',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: 'https://midadd.com',
  },
  openGraph: {
    title: 'مداد | midadd — محول نصوص الذكاء الاصطناعي إلى Word وPDF',
    description:
      'حوّل نصوص الذكاء الاصطناعي ومعادلات LaTeX إلى مستندات Word وPDF منسقة بأسلوب أكاديمي عربي متكامل ومباشر داخل المتصفح.',
    url: 'https://midadd.com',
    siteName: 'مداد | midadd',
    locale: 'ar_SA',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'مداد | midadd — AI Markdown to Word & PDF',
    description:
      'حوّل نصوص ChatGPT وClaude وGemini إلى مستندات Word وPDF احترافية مع دعم كامل للعربية والمعادلات.',
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'midadd',
  },
  icons: {
    apple: '/apple-touch-icon.png',
  },
  other: {
    'google-adsense-account': ADSENSE_CLIENT_ID,
  },
};

const webApplicationSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'مداد | midadd',
  url: 'https://midadd.com',
  applicationCategory: 'ProductivityApplication',
  operatingSystem: 'All',
  inLanguage: ['ar', 'en'],
  description:
    'أداة متقدمة لتحويل نصوص الذكاء الاصطناعي Markdown ومعادلات LaTeX إلى مستندات Word (.docx) وPDF بدعم كامل للغة العربية RTL.',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className="min-h-screen bg-slate-50 text-slate-900 antialiased dark:bg-slate-950 dark:text-slate-100 transition-colors selection:bg-indigo-500/20 selection:text-indigo-600"
      >
        {/* ================================================================
            Google AdSense Verification & Auto Ads Script Slot
            يمكنك استبدال معرف الناشر عبر NEXT_PUBLIC_ADSENSE_CLIENT_ID أو هنا مباشرة
            ================================================================ */}
        <Script
          id="google-adsense-init"
          strategy="beforeInteractive"
          async
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT_ID}`}
          crossOrigin="anonymous"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(webApplicationSchema) }}
        />
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
