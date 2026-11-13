'use client';

import React from 'react';
import Link from 'next/link';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { AdSlot } from '@/components/AdSlot';
import { useLanguage } from '@/components/LanguageContext';
import { useSession, useSavedDocsList, logoutAccount } from '@/lib/guest-session';
import { useTheme } from '@/lib/theme';
import { GuideArticle, GUIDE_ARTICLES } from '@/lib/guides-data';
import { ArrowRight, ArrowLeft, BookOpen, CheckCircle2 } from 'lucide-react';

export function GuideArticleView({ article }: { article: GuideArticle }) {
  const { language } = useLanguage();
  const session = useSession();
  const savedDocs = useSavedDocsList();
  const [isDark, toggleTheme] = useTheme();
  const isAr = language === 'ar';

  const related = GUIDE_ARTICLES.filter(g => g.slug !== article.slug);

  return (
    <div className="min-h-screen flex flex-col bg-slate-100/70 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      <Header
        session={session}
        savedDocsCount={savedDocs.length}
        onLogout={logoutAccount}
        isDark={isDark}
        onToggleTheme={toggleTheme}
      />

      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full space-y-8">
        <nav aria-label="Breadcrumb" className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-2">
          <Link href="/" className="hover:text-indigo-600 dark:hover:text-indigo-400">
            {isAr ? 'الرئيسية' : 'Home'}
          </Link>
          <span aria-hidden="true">/</span>
          <Link href="/guides" className="hover:text-indigo-600 dark:hover:text-indigo-400">
            {isAr ? 'الأدلة الإرشادية' : 'Guides'}
          </Link>
          <span aria-hidden="true">/</span>
          <span className="text-slate-700 dark:text-slate-200 font-semibold truncate">
            {isAr ? article.categoryAr : article.categoryEn}
          </span>
        </nav>

        <article className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-10 shadow-sm space-y-8">
          <header className="space-y-4 border-b border-slate-200 dark:border-slate-800 pb-6">
            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
              <span className="font-bold text-indigo-600 dark:text-indigo-400">
                {isAr ? article.categoryAr : article.categoryEn}
              </span>
              <span aria-hidden="true">·</span>
              <span className="tabular-nums">{article.publishedAt}</span>
              <span aria-hidden="true">·</span>
              <span className="tabular-nums">
                {isAr ? `${article.readingMinutes} دقائق قراءة` : `${article.readingMinutes} min read`}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 dark:text-white leading-tight text-balance">
              {isAr ? article.titleAr : article.titleEn}
            </h1>

            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed max-w-[70ch]">
              {isAr ? article.excerptAr : article.excerptEn}
            </p>

            <div className="text-xs font-medium text-slate-500 dark:text-slate-400">
              {isAr ? `بقلم: ${article.authorAr}` : `By ${article.authorEn}`}
            </div>
          </header>

          {/* Table of Contents */}
          <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2">
            <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
              <span>{isAr ? 'محتويات الدليل' : 'In This Guide'}</span>
            </div>
            <ul className="space-y-1.5 text-xs sm:text-sm">
              {article.sections.map(sec => (
                <li key={sec.id}>
                  <a
                    href={`#${sec.id}`}
                    className="text-indigo-600 dark:text-indigo-400 hover:underline font-medium"
                  >
                    {isAr ? sec.headingAr : sec.headingEn}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Article Body Sections */}
          <div className="space-y-8">
            {article.sections.map((section, idx) => (
              <React.Fragment key={section.id}>
                <section id={section.id} className="space-y-3 scroll-mt-24">
                  <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white">
                    {isAr ? section.headingAr : section.headingEn}
                  </h2>

                  {(isAr ? section.paragraphsAr : section.paragraphsEn).map((para, pIdx) => (
                    <p
                      key={pIdx}
                      className="text-sm sm:text-[15px] text-slate-700 dark:text-slate-300 leading-relaxed max-w-[72ch]"
                    >
                      {para}
                    </p>
                  ))}

                  {((isAr ? section.bulletsAr : section.bulletsEn) ?? []).length > 0 && (
                    <ul className="space-y-2 pt-1">
                      {((isAr ? section.bulletsAr : section.bulletsEn) ?? []).map((bullet, bIdx) => (
                        <li
                          key={bIdx}
                          className="flex items-start gap-2.5 text-sm text-slate-700 dark:text-slate-300 leading-relaxed"
                        >
                          <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-1" />
                          <span>{bullet}</span>
                        </li>
                      ))}
                    </ul>
                  )}

                  {section.codeExample && (
                    <pre
                      dir="ltr"
                      className="editor-code-block text-xs sm:text-sm overflow-x-auto text-left"
                    >
                      <code>{section.codeExample}</code>
                    </pre>
                  )}
                </section>

                {/* Non-intrusive mid-article AdSlot after the first section */}
                {idx === 0 && <AdSlot slotId={`article-mid-${article.slug}`} format="horizontal" />}
              </React.Fragment>
            ))}
          </div>

          {/* Bottom CTA */}
          <div className="pt-6 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <Link
              href="/guides"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400"
            >
              {isAr ? <ArrowRight className="h-4 w-4" /> : <ArrowLeft className="h-4 w-4" />}
              <span>{isAr ? 'العودة إلى جميع الأدلة' : 'Back to All Guides'}</span>
            </Link>

            <Link
              href="/"
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-bold whitespace-nowrap shrink-0 transition"
            >
              {isAr ? 'تطبيق الشرح في محرر مداد' : 'Open midadd Editor'}
            </Link>
          </div>
        </article>

        {/* Related Guides */}
        <section className="space-y-4">
          <h2 className="text-lg font-extrabold text-slate-900 dark:text-white">
            {isAr ? 'أدلة إرشادية ذات صلة' : 'Related Guides'}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {related.map(item => (
              <Link
                key={item.slug}
                href={`/guides/${item.slug}`}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 hover:border-indigo-300 dark:hover:border-indigo-700 transition-colors space-y-2"
              >
                <div className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold">
                  {isAr ? item.categoryAr : item.categoryEn} ·{' '}
                  {isAr ? `${item.readingMinutes} دقائق قراءة` : `${item.readingMinutes} min read`}
                </div>
                <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white leading-snug">
                  {isAr ? item.titleAr : item.titleEn}
                </h3>
              </Link>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
