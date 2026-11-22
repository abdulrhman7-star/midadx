'use client';

import React from 'react';
import Link from 'next/link';
import { useLanguage } from './LanguageContext';
import { ArrowLeft, ArrowRight, FileCheck2, Globe2, Sigma, Sparkles } from 'lucide-react';

interface HomeHeroSectionProps {
  onStartNow: () => void;
}

export function HomeHeroSection({ onStartNow }: HomeHeroSectionProps) {
  const { language, direction } = useLanguage();
  const isAr = language === 'ar';
  const isRtl = direction === 'rtl';

  const highlights = [
    {
      icon: FileCheck2,
      titleAr: 'تصدير فوري إلى Word وPDF',
      titleEn: 'Instant Word & PDF Export',
      metaAr: 'تنسيق جاهز للطباعة بدون تشوه',
      metaEn: 'Print-ready DOCX & PDF output',
    },
    {
      icon: Globe2,
      titleAr: 'دعم أصيل للعربية واتجاه RTL',
      titleEn: 'Native Arabic RTL Support',
      metaAr: 'فقرات وجداول متناسقة ثنائية اللغة',
      metaEn: 'Accurate bidirectional tables & prose',
    },
    {
      icon: Sigma,
      titleAr: 'معادلات LaTeX إلى OMML',
      titleEn: 'Editable LaTeX to OMML Math',
      metaAr: 'معادلات رياضية قابلة للتعديل في Word',
      metaEn: 'Native editable Office Math nodes',
    },
  ];

  return (
    <section
      aria-labelledby="home-hero-heading"
      className="no-print w-full max-w-7xl mx-auto px-3 sm:px-5 lg:px-6 py-4 sm:py-6"
    >
      <div className="relative rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-gradient-to-br from-white via-white to-indigo-50/40 dark:from-slate-900 dark:via-slate-900 dark:to-indigo-950/25 shadow-sm sm:shadow-md p-6 sm:p-8 lg:p-10 transition-colors">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-center">
          {/* Primary Value Proposition & CTA */}
          <div className="lg:col-span-8 space-y-4">
            <div className="inline-flex items-center gap-2 text-xs font-bold text-indigo-600 dark:text-indigo-400">
              <Sparkles className="h-3.5 w-3.5 shrink-0" />
              <span>
                {isAr
                  ? 'محرر ومحوّل مستندات الذكاء الاصطناعي'
                  : 'AI Document Formatting Workspace'}
              </span>
            </div>

            <h1
              id="home-hero-heading"
              className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight text-balance"
            >
              {isAr
                ? 'حوّل نصوص الذكاء الاصطناعي إلى مستندات Word وPDF احترافية في ثوانٍ'
                : 'Turn AI Text into Publish-Ready Word & PDF Documents in Seconds'}
            </h1>

            <p className="max-w-2xl text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
              {isAr
                ? 'صُممت منصة مداد لكتابة وتنسيق مخرجات ChatGPT وClaude ومعادلات LaTeX والجداول بدعم كامل للغة العربية (RTL)، مع تصدير فوري لملفات Word أصلية وPDF مباشرة من متصفحك.'
                : 'midadd formats ChatGPT and Claude drafts, LaTeX equations, and structured tables with full RTL/LTR support, exporting directly to editable Word (.docx) and PDF files in your browser.'}
            </p>

            <div className="pt-1 flex flex-col sm:flex-row sm:items-center gap-3">
              <button
                type="button"
                onClick={onStartNow}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 min-h-[44px] rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm sm:text-base font-bold shadow-sm shadow-indigo-600/20 active:scale-[0.98] transition cursor-pointer whitespace-nowrap shrink-0"
              >
                <span>{isAr ? 'ابدأ الآن' : 'Start Writing Now'}</span>
                {isRtl ? (
                  <ArrowLeft className="h-4 w-4 shrink-0" />
                ) : (
                  <ArrowRight className="h-4 w-4 shrink-0" />
                )}
              </button>

              <Link
                href="/templates"
                className="inline-flex items-center justify-center gap-2 px-5 py-3 min-h-[44px] rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 text-sm font-bold transition whitespace-nowrap shrink-0"
              >
                <span>{isAr ? 'تصفح القوالب الجاهزة' : 'Browse Templates'}</span>
              </Link>
            </div>
          </div>

          {/* Concise Highlight Specs Column */}
          <div className="lg:col-span-4 border-t lg:border-t-0 lg:border-s border-slate-200/80 dark:border-slate-800 pt-5 lg:pt-0 lg:ps-8">
            <ul className="divide-y divide-slate-200/75 dark:divide-slate-800/90">
              {highlights.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <li
                    key={idx}
                    className="flex items-start gap-3 py-3 first:pt-0 last:pb-0"
                  >
                    <div className="h-8 w-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0 mt-0.5">
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white leading-snug">
                        {isAr ? item.titleAr : item.titleEn}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
                        {isAr ? item.metaAr : item.metaEn}
                      </p>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
