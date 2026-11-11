'use client';

import React from 'react';
import Link from 'next/link';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { useLanguage } from '@/components/LanguageContext';
import { useSession, useSavedDocsList, logoutAccount } from '@/lib/guest-session';
import { useTheme } from '@/lib/theme';
import {
  Sparkles,
  ShieldCheck,
  FileText,
  Cpu,
  Globe2,
  Users,
  CheckCircle2,
  ArrowLeft,
  Mail,
  Lock,
} from 'lucide-react';

export default function AboutPage() {
  const { language } = useLanguage();
  const session = useSession();
  const savedDocs = useSavedDocsList();
  const [isDark, toggleTheme] = useTheme();
  const isAr = language === 'ar';

  return (
    <div className="min-h-screen flex flex-col bg-slate-100/70 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      <Header
        session={session}
        savedDocsCount={savedDocs.length}
        onOpenSavedDocs={() => {}}
        onOpenAuthModal={() => {}}
        onLogout={logoutAccount}
        isDark={isDark}
        onToggleTheme={toggleTheme}
      />

      <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full space-y-10">
        {/* Page Header */}
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 text-xs font-bold mb-4">
            <Sparkles className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" />
            <span>{isAr ? 'عن المنصة والرؤية' : 'About midadd & Mission'}</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-4">
            {isAr
              ? 'عن منصة مداد — تحويل نصوص الذكاء الاصطناعي إلى مستندات وورد وPDF احترافية'
              : 'About midadd — Professional AI Markdown to Word & PDF Platform'}
          </h1>

          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed">
            {isAr
              ? 'منصة مداد هي أداة متخصصة للمصممين، الباحثين، الأكاديميين والطلاب، تمكنهم من تحويل المخرجات النصية لنماذج الذكاء الاصطناعي (ChatGPT, Claude, Gemini) إلى مستندات Microsoft Word (.docx) وPDF منسقة بدقة فائقة مع الحفاظ على المعادلات الرياضية والرموز العربية والجداول.'
              : 'midadd is an advanced document engine built for researchers, academics, students, and professionals to convert raw AI Markdown outputs from ChatGPT, Claude, and Gemini into fully formatted Microsoft Word (.docx) and PDF documents.'}
          </p>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-3">
            <div className="h-10 w-10 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold">
              <Globe2 className="h-5 w-5" />
            </div>
            <h2 className="font-extrabold text-base text-slate-900 dark:text-white">
              {isAr ? 'دعم كامل للغة العربية (RTL)' : 'Native Arabic & RTL First'}
            </h2>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              {isAr
                ? 'تم تطوير مداد خصيصاً لحل مشاكل اتجاه النص العربي وحذافة القوائم والتعداد الرقمي في ملفات Microsoft Word المترجمة من الإنجليزية.'
                : 'Engineered explicitly to solve right-to-left text alignment, numbered lists, and typography formatting in Arabic academic papers.'}
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-3">
            <div className="h-10 w-10 rounded-2xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center font-bold">
              <Cpu className="h-5 w-5" />
            </div>
            <h2 className="font-extrabold text-base text-slate-900 dark:text-white">
              {isAr ? 'تحويل معادلات LaTeX تلقائياً' : 'LaTeX to Native OMML Math'}
            </h2>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              {isAr
                ? 'يحول النظام معادلات LaTeX والرموز الرياضية المعقدة إلى معادلات Word الأصلية (OMML) القابلة للتعديل دون تحويلها لصور مشوهة.'
                : 'Automatically renders inline and display LaTeX equations directly into editable native Word OMML math elements.'}
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-3">
            <div className="h-10 w-10 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
              <Lock className="h-5 w-5" />
            </div>
            <h2 className="font-extrabold text-base text-slate-900 dark:text-white">
              {isAr ? 'خصوصية تامة وشفرة طرفية' : '100% Client-Side Privacy'}
            </h2>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              {isAr
                ? 'تتم معالجة وتنسيق وتوليد ملفات Word وPDF بالكامل داخل متصفح جهازك دون تخزين نصوصك أو أبحاثك على خوادم خارجية.'
                : 'Document rendering and file generation happen entirely within your local browser runtime to guarantee data privacy.'}
            </p>
          </div>
        </div>

        {/* Detailed Description Content */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-10 shadow-sm space-y-8">
          <section className="space-y-3">
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <FileText className="h-5 w-5 text-indigo-600" />
              <span>{isAr ? 'رؤية المنصة والهدف' : 'Platform Vision & Objectives'}</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              {isAr
                ? 'تأسست منصة مداد لتوفير تجربة تحرير وتصدير مستندات سلسة وعالية الجودة. يواجه العديد من المستخدمين صعوبة عند نسخ النصوص المنشأة بواسطة نماذج الذكاء الاصطناعي ولصقها في برامج التحرير التقليدية مثل Word أو Google Docs، حيث تتخرب الجداول وتفقد المعادلات الرياضية نسقها وتلتف الاتجاهات العربية بطريقة غير متناسقة.'
                : 'midadd was built to bridge the gap between modern generative AI text models and professional office productivity suites. When users copy markdown text from AI chatbots into traditional word processors, formatting often breaks.'}
            </p>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              {isAr
                ? 'يقدم محرر مداد الحل المباشر عبر تحويل هياكل Markdown تلقائياً إلى مستندات Word معتمدة تتضمن الجداول الملونة، الرؤوس والأذيال، الاتجاه الصحيح للنص، وخيارات الطباعة بجودة العرض النهائي.'
                : 'Our custom rendering pipeline preserves table styling, code blocks, document margins, and math notation so you can export publish-ready reports in seconds.'}
            </p>
          </section>

          <section className="space-y-3 pt-4 border-t border-slate-200 dark:border-slate-800">
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-emerald-600" />
              <span>{isAr ? 'الشفافية وسياسة الاستخدام العادل' : 'Transparency & Operational Integrity'}</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              {isAr
                ? 'نحن نلتزم بتقديم خدمة شفافة تماماً. يتمتع المستخدمون برصيد مجاني دوري لاستخدام المحرر، بالإضافة إلى إمكانية ترقية الحساب لشحن رصيد دائم دون تجديدات تلقائية مخفية. كما نضمن الامتثال التام لسياسات الناشرين وإعلانات Google AdSense ونوفر شروط استخدام وسياسة خصوصية واضحة.'
                : 'We operate with full commercial and technical transparency. Free tiers are provided to help users evaluate midadd, with optional top-up options. We adhere strictly to Google Publisher Policies.'}
            </p>
          </section>

          {/* Contact Banner */}
          <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="font-extrabold text-sm text-slate-900 dark:text-white mb-1">
                {isAr ? 'هل لديك أي استفسار أو اقتراح؟' : 'Have Questions or Feedback?'}
              </h3>
              <p className="text-xs text-slate-500">
                {isAr ? 'فريق الدعم الفني جاهز للإجابة على جميع الاستفسارات.' : 'Our support team is available to assist you promptly.'}
              </p>
            </div>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-600/30 transition shrink-0"
            >
              <Mail className="h-4 w-4" />
              <span>{isAr ? 'تواصل معنا الآن' : 'Contact Support'}</span>
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
