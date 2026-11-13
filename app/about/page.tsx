'use client';

import React from 'react';
import Link from 'next/link';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { AdSlot } from '@/components/AdSlot';
import { useLanguage } from '@/components/LanguageContext';
import { useSession, useSavedDocsList, logoutAccount } from '@/lib/guest-session';
import { useTheme } from '@/lib/theme';
import {
  ShieldCheck,
  FileText,
  Cpu,
  Globe2,
  Mail,
  Lock,
  BookOpen,
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
        onLogout={logoutAccount}
        isDark={isDark}
        onToggleTheme={toggleTheme}
      />

      <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full space-y-10">
        {/* Page Header */}
        <header className="text-center max-w-3xl mx-auto space-y-4">
          <div className="text-xs font-bold text-indigo-600 dark:text-indigo-400">
            {isAr ? 'عن منصة مداد · الرسالة والرؤية' : 'About midadd · Mission & Standards'}
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white text-balance">
            {isAr
              ? 'منصة مداد — تحويل نصوص الذكاء الاصطناعي إلى مستندات Word وPDF احترافية'
              : 'About midadd — Professional AI Markdown to Word & PDF Platform'}
          </h1>

          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed">
            {isAr
              ? 'منصة مداد هي بيئة متخصصة للباحثين، الأكاديميين، الطلاب، وصناع المحتوى لتحويل المخرجات النصية لنماذج الذكاء الاصطناعي (ChatGPT وClaude وGemini) إلى مستندات Microsoft Word (.docx) وPDF منسقة بدقة فائقة مع الحفاظ على المعادلات الرياضية والجداول واتجاه اللغة العربية.'
              : 'midadd is a specialized workspace built for researchers, academics, students, and professionals to convert raw AI Markdown outputs from ChatGPT, Claude, and Gemini into formatted Microsoft Word (.docx) and PDF documents.'}
          </p>
        </header>

        {/* Core Pillars */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 space-y-3">
            <div className="h-10 w-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <Globe2 className="h-5 w-5" />
            </div>
            <h2 className="font-extrabold text-base text-slate-900 dark:text-white">
              {isAr ? 'دعم أصيل للغة العربية (RTL)' : 'Native Arabic & RTL First'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              {isAr
                ? 'صُممت مداد لحل مشكلات اتجاه النص العربي ثنائي الاتجاه (Bidi)، ومحاذاة القوائم المرقمة، وترتيب أعمدة الجداول في ملفات Word المنسوخة من محادثات الذكاء الاصطناعي.'
                : 'Engineered explicitly to solve bidirectional Arabic text alignment, numbered lists, and table column ordering in Word documents.'}
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 space-y-3">
            <div className="h-10 w-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <Cpu className="h-5 w-5" />
            </div>
            <h2 className="font-extrabold text-base text-slate-900 dark:text-white">
              {isAr ? 'تحويل معادلات LaTeX إلى OMML' : 'LaTeX to Native OMML Math'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              {isAr
                ? 'يحول المحرك معادلات LaTeX والرموز الهندسية والكسور إلى معادلات Word الأصلية (OMML) القابلة للتعديل المباشر بدلاً من إدراجها كصور جامدة.'
                : 'Automatically converts inline and display LaTeX equations into editable native Word OMML equation elements.'}
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 space-y-3">
            <div className="h-10 w-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <Lock className="h-5 w-5" />
            </div>
            <h2 className="font-extrabold text-base text-slate-900 dark:text-white">
              {isAr ? 'خصوصية تامة ومعالجة محلية' : '100% Client-Side Privacy'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              {isAr
                ? 'تعمل خوارزميات التنسيق وتوليد الملفات داخل متصفح جهازك لحماية خصوصية مسوداتك وأبحاثك الأكاديمية وتقاريرك الإدارية.'
                : 'Document parsing and file export run directly inside your browser runtime to protect confidential drafts and academic manuscripts.'}
            </p>
          </div>
        </section>

        {/* Detailed Narrative */}
        <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-10 shadow-sm space-y-8">
          <div className="space-y-3">
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <FileText className="h-5 w-5 text-indigo-600" />
              <span>{isAr ? 'لماذا أنشأنا منصة مداد؟' : 'Why We Built midadd'}</span>
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              {isAr
                ? 'يعتمد الملايين من الطلاب والباحثين والمديرين يومياً على نماذج الذكاء الاصطناعي لصياغة المسودات الأولية، لكن نقل تلك المخرجات إلى Microsoft Word أو Google Docs يستهلك وقتاً طويلاً في إصلاح العناوين والرموز، وإعادة رسم الجداول، وتصحيح المعادلات الرياضية المنكسرة.'
                : 'Millions of students, researchers, and writers rely on generative AI for initial drafts, yet moving those responses into Microsoft Word or Google Docs wastes hours fixing broken headings, collapsed tables, and garbled equations.'}
            </p>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              {isAr
                ? 'تقدم منصة مداد محرراً متكاملاً بأسلوب برامج معالجة النصوص القياسية، مدعوماً بأكثر من 22 قالباً عربياً وإنجليزياً جاهزاً، وأدلة إرشادية مفصلة تساعد المستخدمين على إتقان كتابة المستندات الأكاديمية والتجارية بأعلى معايير الجودة.'
                : 'midadd solves this bottleneck through a clean Word-style authoring canvas, over 22 domain-ready templates, and in-depth technical guides that help writers publish structured reports in seconds.'}
            </p>
          </div>

          <div className="space-y-3 pt-6 border-t border-slate-200 dark:border-slate-800">
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-emerald-600" />
              <span>{isAr ? 'الشفافية ومعايير الجودة التحريرية' : 'Editorial Transparency & Operational Integrity'}</span>
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              {isAr
                ? 'نلتزم بتقديم تجربة واضحة ومباشرة بدون رسوم مخفية؛ حيث يحصل كل زائر على أرصدة مجانية لتجربة المنصة بالكامل، مع توفير محتوى تعليمي مجاني متجدد عبر قسم الأدلة الإرشادية والالتزام الكامل بسياسات الخصوصية وحقوق الملكية الفكرية.'
                : 'We maintain full transparency with complimentary starter credits, freely accessible educational guides, clear privacy disclosures, and strict respect for user intellectual property.'}
            </p>
          </div>

          {/* Actions Banner */}
          <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="font-extrabold text-sm text-slate-900 dark:text-white mb-1">
                {isAr ? 'استكشف الأدلة الإرشادية أو تواصل مع فريقنا' : 'Explore Our Guides or Contact Support'}
              </h3>
              <p className="text-xs text-slate-500">
                {isAr
                  ? 'فريق مداد متاح للرد على استفساراتكم واقتراحاتكم خلال 24 ساعة.'
                  : 'Our team is ready to help with technical questions or partnership requests within 24 hours.'}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2 shrink-0">
              <Link
                href="/guides"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold text-xs transition"
              >
                <BookOpen className="h-4 w-4" />
                <span>{isAr ? 'الأدلة الإرشادية' : 'Read Guides'}</span>
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-sm transition"
              >
                <Mail className="h-4 w-4" />
                <span>{isAr ? 'اتصل بنا الآن' : 'Contact Us'}</span>
              </Link>
            </div>
          </div>
        </section>

        <AdSlot slotId="about-bottom-01" format="horizontal" />
      </main>

      <Footer />
    </div>
  );
}
