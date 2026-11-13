'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useLanguage } from './LanguageContext';
import { AdSlot } from './AdSlot';
import { GUIDE_ARTICLES } from '@/lib/guides-data';
import {
  BookOpen,
  ChevronDown,
  FileText,
  Sigma,
  Globe2,
  ShieldCheck,
  ArrowLeft,
  ArrowRight,
  Table2,
  Code2,
} from 'lucide-react';

interface FaqItem {
  qAr: string;
  qEn: string;
  aAr: string;
  aEn: string;
}

const FAQ_ITEMS: FaqItem[] = [
  {
    qAr: 'كيف أحوّل نصاً من ChatGPT أو Claude إلى ملف Word دون تشوه الجداول؟',
    qEn: 'How do I convert ChatGPT or Claude text to Word without breaking tables?',
    aAr: 'اضغط على زر النسخ (Copy) أسفل رد الذكاء الاصطناعي لنسخ صيغة Markdown الخام، ثم افتح نافذة الإدراج عبر Ctrl+K في محرر مداد، واختر تحميل وورد (DOCX). سيحول المحرك جميع الجداول والحدود والألوان والاتجاه العربي تلقائياً.',
    aEn: 'Use the raw Copy button under the AI response, paste into midadd via Ctrl+K, and click Download DOCX. Our engine converts Markdown tables into genuine bordered Word tables automatically.',
  },
  {
    qAr: 'هل يتم تحويل المعادلات الرياضية LaTeX إلى صور أم معادلات قابلة للتعديل؟',
    qEn: 'Are LaTeX equations exported as images or editable Word math?',
    aAr: 'تحوّل منصة مداد معادلات LaTeX (مثل الكسور والتكاملات والمصفوفات) إلى كائنات معادلات Word الأصلية بصيغة OMML، مما يتيح لك تعديل الرموز والأرقام لاحقاً داخل Microsoft Word بوضوح طباعي عالٍ.',
    aEn: 'midadd converts LaTeX expressions into native Office Math Markup Language (OMML) nodes so every fraction, integral, and matrix remains directly editable inside Microsoft Word.',
  },
  {
    qAr: 'هل تحفظ منصة مداد نصوصي أو أبحاثي على خوادمها؟',
    qEn: 'Does midadd store my documents on external servers?',
    aAr: 'لا. تعمل خوارزميات تحليل Markdown وتوليد مستندات DOCX ومعاينة الطباعة PDF داخل متصفح جهازك محلياً (Client-Side) لحماية سرية أبحاثك ومستنداتك الإدارية، ولا تُرفع مسوداتك إلا إذا سجلت الدخول واخترت المزامنة السحابية.',
    aEn: 'No. Markdown parsing, DOCX generation, and print rendering execute locally inside your browser runtime to preserve confidentiality unless you explicitly sign in and save to cloud sync.',
  },
  {
    qAr: 'هل يدعم المحرر اللغة العربية (RTL) والنصوص المختلطة مع الإنجليزية؟',
    qEn: 'Does the editor support Arabic RTL and mixed English/Arabic documents?',
    aAr: 'نعم، يدعم محرر مداد الاتجاه المنطقي من اليمين إلى اليسار (RTL) على مستوى الفقرات والقوائم المرقمة وأعمدة الجداول، مع الحفاظ على دقة عرض المصطلحات الإنجليزية والأكواد البرمجية وسط الجمل العربية.',
    aEn: 'Yes. midadd sets logical RTL paragraph direction, bidirectional table flow, and proper list numbering while keeping inline English terms and code blocks intact.',
  },
  {
    qAr: 'هل يمكنني نقل المحتوى المنسق مباشرة إلى مستندات Google Docs؟',
    qEn: 'Can I copy formatted output directly into Google Docs?',
    aAr: 'نعم، يوفر الشريط العلوي زر "نسخ لـ Google Docs" الذي ينسخ البنية الغنية مع تخطيط الجداول والعناوين والروابط بشكل متوافق تماماً عند اللصق في Google Docs.',
    aEn: 'Yes, click Copy for Google Docs in the top toolbar to copy rich HTML with inline table borders and clean heading hierarchy ready for pasting into Google Docs.',
  },
];

export function HomeEditorialSection() {
  const { language } = useLanguage();
  const isAr = language === 'ar';
  const [openFaqIdx, setOpenFaqIdx] = useState<number | null>(0);

  const steps = [
    {
      num: '01',
      titleAr: 'نسخ مخرجات الذكاء الاصطناعي',
      titleEn: 'Copy Raw AI Markdown',
      descAr: 'انسخ النص من ChatGPT أو Claude أو Gemini أو ابدأ بالكتابة مباشرة في ورقة A4 التفاعلية أو افتح ملف .docx موجوداً.',
      descEn: 'Copy Markdown output from ChatGPT, Claude, or Gemini, type directly on the A4 canvas, or drop an existing .docx file.',
    },
    {
      num: '02',
      titleAr: 'التحرير والتنسيق الاحترافي',
      titleEn: 'Edit & Style Precisely',
      descAr: 'عدّل الخطوط، الهوامش، اتجاه النص العربي RTL، المعادلات، الجداول، والصور باستخدام شريط أدوات Word المألوف.',
      descEn: 'Adjust fonts, page margins, RTL/LTR direction, formulas, tables, and images using the familiar Word Ribbon.',
    },
    {
      num: '03',
      titleAr: 'المعالجة الآمنة داخل المتصفح',
      titleEn: 'Client-Side Rendering',
      descAr: 'تُبنى بنية المستند ومعادلات OMML محلياً داخل متصفحك بسرعة فائقة دون إرسال محتواك لخوادم طرف ثالث.',
      descEn: 'Document layout and native OMML math nodes are compiled directly inside your browser for speed and data privacy.',
    },
    {
      num: '04',
      titleAr: 'تصدير فوري لـ Word وPDF',
      titleEn: 'Export DOCX, PDF & Docs',
      descAr: 'حمّل ملف Microsoft Word (.docx) متوافقاً، أو اطبع نسخة PDF عالية الدقة، أو انسخ مباشرة إلى Google Docs.',
      descEn: 'Download a genuine .docx file, print a crisp PDF, or copy with preserved table borders into Google Docs.',
    },
  ];

  const capabilities = [
    {
      icon: Globe2,
      titleAr: 'دعم أصيل للغة العربية واتجاه RTL',
      titleEn: 'Native Arabic RTL & Bidi Typography',
      descAr: 'ضبط تلقائي لاتجاه الفقرات، الترقيم العربي والإنجليزي، وترتيب أعمدة الجداول بحيث لا تنعكس علامات الترقيم عند الدمج بين اللغتين.',
      descEn: 'Logical RTL paragraph tagging and bidirectional table column ordering prevent flipped parentheses and broken mixed-language lists.',
    },
    {
      icon: Sigma,
      titleAr: 'معادلات LaTeX إلى OMML قابلة للتعديل',
      titleEn: 'Editable LaTeX to Native OMML Math',
      descAr: 'تحويل فوري للمعادلات السطرية والمستقلة والكسور والمصفوفات إلى معادلات Word أصلية يمكن تعديلها لاحقاً داخل Microsoft Office.',
      descEn: 'Converts inline and block LaTeX syntax into native Microsoft Office equations rather than blurry rasterized screenshots.',
    },
    {
      icon: Table2,
      titleAr: 'جداول منسقة وقوالب أكاديمية وتجارية',
      titleEn: 'Structured Tables & 22 Ready Templates',
      descAr: 'مكتبة تضم أكثر من 22 قالباً جاهزاً للأبحاث الجامعية، التقارير الضريبية والمالية، خطط العمل، والسير الذاتية الثنائية اللغة.',
      descEn: 'Includes 22 structured templates spanning academic manuscripts, financial reports, technical specifications, and bilingual resumes.',
    },
    {
      icon: Code2,
      titleAr: 'كتل برمجية واضحة ونسخ لـ Google Docs',
      titleEn: 'Code Highlighting & Google Docs Sync',
      descAr: 'تنسيق الكتل البرمجية بخطوط أحادية العرض وهياكل واضحة، مع أداة نسخ مخصصة تحافظ على حدود الجداول داخل Google Docs.',
      descEn: 'Renders crisp monospace code blocks and provides a one-click Google Docs clipboard formatter that retains borders and headings.',
    },
  ];

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQ_ITEMS.map(item => ({
      '@type': 'Question',
      name: item.qAr,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.aAr,
      },
    })),
  };

  return (
    <section
      aria-label={isAr ? 'دليل منصة مداد ومميزاتها' : 'About midadd & Capabilities'}
      className="no-print w-full max-w-6xl mx-auto mt-12 space-y-14 px-1"
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      {/* Clean non-intrusive AdSense placement below editor workspace */}
      <AdSlot slotId="home-below-editor-01" format="horizontal" />

      {/* Section 1: How midadd Works */}
      <div className="space-y-6">
        <div className="max-w-2xl space-y-2">
          <p className="text-xs font-bold text-indigo-600 dark:text-indigo-400">
            {isAr ? 'كيف تعمل المنصة' : 'How It Works'}
          </p>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight text-balance">
            {isAr
              ? 'من مسودة الذكاء الاصطناعي إلى مستند Word متكامل في 4 خطوات'
              : 'From Raw AI Draft to Publish-Ready Word Document in 4 Steps'}
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            {isAr
              ? 'صُممت منصة مداد لتختصر ساعات التنسيق اليدوي وتمنحك ملفات دقيقة وجاهزة للطباعة أو التسليم الأكاديمي.'
              : 'midadd eliminates manual reformatting so students, researchers, and teams can produce print-ready files in seconds.'}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {steps.map(step => (
            <div
              key={step.num}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 space-y-2.5"
            >
              <div className="text-xs font-mono font-bold text-indigo-600 dark:text-indigo-400 tabular-nums">
                {step.num}
              </div>
              <h3 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white">
                {isAr ? step.titleAr : step.titleEn}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                {isAr ? step.descAr : step.descEn}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Section 2: Capabilities & Use Cases */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-10 space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
          <div className="max-w-2xl space-y-2">
            <p className="text-xs font-bold text-indigo-600 dark:text-indigo-400">
              {isAr ? 'القدرات التقنية وحالات الاستخدام' : 'Core Capabilities & Use Cases'}
            </p>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white text-balance">
              {isAr
                ? 'أداة متكاملة للأبحاث الجامعية، التقارير الإدارية، والمستندات ثنائية اللغة'
                : 'Built for Academic Manuscripts, Executive Reports & Bilingual Publishing'}
            </h2>
          </div>
          <Link
            href="/templates"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-bold text-slate-800 dark:text-slate-200 whitespace-nowrap shrink-0 transition"
          >
            <FileText className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
            <span>{isAr ? 'استعرض 22 قالباً جاهزاً' : 'Browse 22 Templates'}</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {capabilities.map((cap, idx) => {
            const Icon = cap.icon;
            return (
              <div key={idx} className="flex items-start gap-4">
                <div className="h-10 w-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
                  <Icon className="h-5 w-5" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white">
                    {isAr ? cap.titleAr : cap.titleEn}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    {isAr ? cap.descAr : cap.descEn}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-600 dark:text-slate-400">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span>
              {isAr
                ? 'خصوصية كاملة: تتم معالجة المستندات محلياً داخل متصفحك دون تخزين نصوصك.'
                : 'Client-side privacy: document conversion happens directly inside your browser.'}
            </span>
          </div>
          <Link href="/about" className="font-bold text-indigo-600 dark:text-indigo-400 hover:underline">
            {isAr ? 'اقرأ المزيد عن منصة مداد' : 'Learn more about midadd'}
          </Link>
        </div>
      </div>

      {/* Section 3: Featured Guides Preview */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
          <div className="space-y-1">
            <p className="text-xs font-bold text-indigo-600 dark:text-indigo-400">
              {isAr ? 'مكتبة الأدلة الإرشادية' : 'Editorial Guides'}
            </p>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
              {isAr
                ? 'شروحات متخصصة لتنسيق أبحاثك ومستنداتك باحترافية'
                : 'Technical Guides for Better Document Formatting'}
            </h2>
          </div>
          <Link
            href="/guides"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-indigo-600 dark:text-indigo-400 hover:underline whitespace-nowrap shrink-0"
          >
            <BookOpen className="h-4 w-4" />
            <span>{isAr ? 'جميع الأدلة الإرشادية' : 'View All Guides'}</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {GUIDE_ARTICLES.map(article => (
            <article
              key={article.slug}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 flex flex-col justify-between space-y-4 hover:border-indigo-300 dark:hover:border-indigo-700 transition-colors"
            >
              <div className="space-y-2.5">
                <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-2">
                  <span className="font-semibold text-indigo-600 dark:text-indigo-400">
                    {isAr ? article.categoryAr : article.categoryEn}
                  </span>
                  <span aria-hidden="true">·</span>
                  <span className="tabular-nums">
                    {isAr ? `${article.readingMinutes} دقائق` : `${article.readingMinutes} min read`}
                  </span>
                </div>
                <h3 className="text-base font-extrabold text-slate-900 dark:text-white leading-snug">
                  <Link
                    href={`/guides/${article.slug}`}
                    className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                  >
                    {isAr ? article.titleAr : article.titleEn}
                  </Link>
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  {isAr ? article.excerptAr : article.excerptEn}
                </p>
              </div>
              <Link
                href={`/guides/${article.slug}`}
                className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
              >
                <span>{isAr ? 'قراءة الدليل الكامل' : 'Read Full Guide'}</span>
                {isAr ? <ArrowLeft className="h-3.5 w-3.5" /> : <ArrowRight className="h-3.5 w-3.5" />}
              </Link>
            </article>
          ))}
        </div>
      </div>

      <AdSlot slotId="home-mid-faq-01" format="horizontal" />

      {/* Section 4: FAQ */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-10 space-y-6">
        <div className="space-y-1.5">
          <p className="text-xs font-bold text-indigo-600 dark:text-indigo-400">
            {isAr ? 'الأسئلة الشائعة' : 'Frequently Asked Questions'}
          </p>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
            {isAr
              ? 'إجابات سريعة حول التحويل، المعادلات، والخصوصية'
              : 'Common Questions About Formatting, Math & Privacy'}
          </h2>
        </div>

        <div className="divide-y divide-slate-200 dark:divide-slate-800">
          {FAQ_ITEMS.map((item, idx) => {
            const isOpen = openFaqIdx === idx;
            return (
              <div key={idx} className="py-4 first:pt-1 last:pb-1">
                <button
                  type="button"
                  onClick={() => setOpenFaqIdx(isOpen ? null : idx)}
                  aria-expanded={isOpen}
                  className="w-full flex items-center justify-between gap-4 text-start font-bold text-sm sm:text-base text-slate-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer"
                >
                  <span>{isAr ? item.qAr : item.qEn}</span>
                  <ChevronDown
                    className={`h-4 w-4 text-slate-400 shrink-0 transition-transform ${
                      isOpen ? 'rotate-180 text-indigo-600' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <p className="mt-2.5 text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed max-w-[75ch]">
                    {isAr ? item.aAr : item.aEn}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
