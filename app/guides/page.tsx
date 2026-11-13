'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { AdSlot } from '@/components/AdSlot';
import { useLanguage } from '@/components/LanguageContext';
import { useSession, useSavedDocsList, logoutAccount } from '@/lib/guest-session';
import { useTheme } from '@/lib/theme';
import { GUIDE_ARTICLES, filterGuidesByCategory, GuideArticle } from '@/lib/guides-data';
import { BookOpen, Search, ArrowLeft, ArrowRight } from 'lucide-react';

type CategoryFilter = 'all' | GuideArticle['categoryId'];

export default function GuidesPage() {
  const { language } = useLanguage();
  const session = useSession();
  const savedDocs = useSavedDocsList();
  const [isDark, toggleTheme] = useTheme();
  const isAr = language === 'ar';

  const [selectedCategory, setSelectedCategory] = useState<CategoryFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredArticles = useMemo(
    () => filterGuidesByCategory(selectedCategory, searchQuery),
    [selectedCategory, searchQuery]
  );

  const categories: { id: CategoryFilter; labelAr: string; labelEn: string }[] = [
    { id: 'all', labelAr: 'جميع الأدلة', labelEn: 'All Guides' },
    { id: 'formatting', labelAr: 'إنتاجية المستندات', labelEn: 'Document Workflows' },
    { id: 'math', labelAr: 'المعادلات والبحث العلمي', labelEn: 'Academic & Math' },
    { id: 'arabic-rtl', labelAr: 'دعم العربية والـ RTL', labelEn: 'Arabic & RTL' },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-100/70 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      <Header
        session={session}
        savedDocsCount={savedDocs.length}
        onLogout={logoutAccount}
        isDark={isDark}
        onToggleTheme={toggleTheme}
      />

      <main className="flex-1 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full space-y-8">
        {/* Hero Header */}
        <header className="max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 text-indigo-600 dark:text-indigo-400 text-xs font-bold">
            <BookOpen className="h-4 w-4" />
            <span>{isAr ? 'مكتبة المعرفة والأدلة التقنية' : 'Knowledge Base & Technical Guides'}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white text-balance">
            {isAr
              ? 'الأدلة الإرشادية لإتقان تنسيق مستندات الذكاء الاصطناعي'
              : 'Practical Guides for AI Document Formatting & Publishing'}
          </h1>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed">
            {isAr
              ? 'شروحات متعمقة مكتوبة بعناية للباحثين والكتاب والطلاب حول تحويل مخرجات Markdown إلى ملفات Word وPDF متماسكة، وتجنب أخطاء المعادلات والاتجاه العربي.'
              : 'In-depth guides for researchers, students, and technical writers on exporting AI Markdown to clean DOCX and PDF files with accurate math and RTL typography.'}
          </p>
        </header>

        {/* Filter & Search Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
          <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-200/70 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
            {categories.map(cat => {
              const active = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                    active
                      ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {isAr ? cat.labelAr : cat.labelEn}
                </button>
              );
            })}
          </div>

          <div className="relative w-full md:w-72">
            <Search className="h-4 w-4 text-slate-400 absolute top-1/2 -translate-y-1/2 start-3 pointer-events-none" />
            <input
              type="search"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder={isAr ? 'ابحث في الأدلة...' : 'Search guides...'}
              aria-label={isAr ? 'ابحث في الأدلة الإرشادية' : 'Search guides'}
              className="w-full ps-9 pe-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        {/* Articles Grid */}
        {filteredArticles.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-10 text-center space-y-3">
            <p className="text-sm font-bold text-slate-700 dark:text-slate-300">
              {isAr ? 'لم يتم العثور على مقالات مطابقة لبحثك.' : 'No matching articles found.'}
            </p>
            <button
              type="button"
              onClick={() => {
                setSelectedCategory('all');
                setSearchQuery('');
              }}
              className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold cursor-pointer"
            >
              {isAr ? 'عرض جميع الأدلة' : 'Reset Filters'}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {filteredArticles.map(article => (
              <article
                key={article.slug}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 flex flex-col justify-between space-y-4 hover:border-indigo-300 dark:hover:border-indigo-700 transition-colors"
              >
                <div className="space-y-3">
                  {/* Unboxed quiet metadata */}
                  <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                    <span className="font-semibold text-indigo-600 dark:text-indigo-400">
                      {isAr ? article.categoryAr : article.categoryEn}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span className="tabular-nums">
                      {isAr ? `${article.readingMinutes} دقائق قراءة` : `${article.readingMinutes} min read`}
                    </span>
                  </div>

                  <h2 className="text-lg font-extrabold text-slate-900 dark:text-white leading-snug">
                    <Link
                      href={`/guides/${article.slug}`}
                      className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                    >
                      {isAr ? article.titleAr : article.titleEn}
                    </Link>
                  </h2>

                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    {isAr ? article.excerptAr : article.excerptEn}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                  <span className="text-slate-500 dark:text-slate-400 truncate max-w-[170px]">
                    {isAr ? article.authorAr : article.authorEn}
                  </span>
                  <Link
                    href={`/guides/${article.slug}`}
                    className="inline-flex items-center gap-1 font-bold text-indigo-600 dark:text-indigo-400 hover:underline whitespace-nowrap shrink-0"
                  >
                    <span>{isAr ? 'اقرأ الدليل' : 'Read Guide'}</span>
                    {isAr ? <ArrowLeft className="h-3.5 w-3.5" /> : <ArrowRight className="h-3.5 w-3.5" />}
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}

        <AdSlot slotId="guides-index-01" format="horizontal" />

        {/* Summary CTA to Editor */}
        <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h2 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white">
              {isAr
                ? `جرّب هذه القواعد الآن في محرر مداد (${GUIDE_ARTICLES.length} أدلة جاهزة)`
                : 'Try These Workflows Inside the midadd Editor'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
              {isAr
                ? 'الصق نص Markdown أو معادلات LaTeX في الصفحة الرئيسية وحمّل مستندك بصيغة Word أو PDF فوراً.'
                : 'Paste Markdown or LaTeX formulas on the home editor and export a formatted DOCX or PDF instantly.'}
            </p>
          </div>
          <Link
            href="/"
            className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-bold whitespace-nowrap shrink-0 transition"
          >
            {isAr ? 'افتح المحرر الذكي' : 'Open Editor'}
          </Link>
        </section>
      </main>

      <Footer />
    </div>
  );
}
