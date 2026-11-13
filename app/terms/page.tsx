'use client';

import React from 'react';
import Link from 'next/link';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { AdSlot } from '@/components/AdSlot';
import { useLanguage } from '@/components/LanguageContext';
import { useSession, useSavedDocsList, logoutAccount } from '@/lib/guest-session';
import { useTheme } from '@/lib/theme';
import { Scale } from 'lucide-react';

export default function TermsOfServicePage() {
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

      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        <article className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-10 shadow-sm space-y-8">
          <header className="border-b border-slate-200 dark:border-slate-800 pb-6">
            <div className="inline-flex items-center gap-2 text-indigo-600 dark:text-indigo-400 text-xs font-bold mb-2">
              <Scale className="h-4 w-4" />
              <span>{isAr ? 'اتفاقية وشروط الاستخدام' : 'Legal Terms of Service'}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              {isAr ? 'اتفاقية الاستخدام وشروط الخدمة' : 'Terms of Service Agreement'}
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
              {isAr ? 'آخر تحديث: نوفمبر 2026 · منصة مداد (midadd.com)' : 'Last updated: November 2026 · midadd'}
            </p>
          </header>

          <div className="space-y-6 text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
            <section className="space-y-2">
              <h2 className="font-bold text-base sm:text-lg text-slate-900 dark:text-white">
                {isAr ? '1. الموافقة على شروط الاستخدام' : '1. Acceptance of Terms'}
              </h2>
              <p>
                {isAr
                  ? 'باستخدامك لموقع ومنصة مداد (midadd) أو أي من أدوات المحرر والقوالب والأدلة الإرشادية المتاحة عليه، فإنك تقر بموافقتك الكاملة على هذه الاتفاقية والالتزام بكافة بنودها، بالإضافة إلى الالتزام بسياسة الخصوصية المعتمدة للموقع.'
                  : 'By accessing or using midadd, including its document editor, templates, and guides, you agree to be bound by these Terms of Service and our Privacy Policy.'}
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="font-bold text-base sm:text-lg text-slate-900 dark:text-white">
                {isAr ? '2. الملكية الفكرية لمنصة مداد ومحتوى المستخدمين' : '2. Intellectual Property Rights'}
              </h2>
              <p>
                {isAr
                  ? 'جميع حقوق الملكية الفكرية الخاصة بتصميم موقع مداد، واجهاته، علامته التجارية، الشفرة البرمجية، القوالب المنسقة، والمقالات التعليمية هي ملك حصري لمنصة مداد، ولا يجوز نسخها أو إعادة نشرها تجارياً دون إذن كتابي مسبق.'
                  : 'All intellectual property rights in the midadd website design, brand identity, software code, built-in templates, and editorial guides belong exclusively to midadd and may not be republished without permission.'}
              </p>
              <p>
                {isAr
                  ? 'في المقابل، تحتفظ أنت بصفتك المستخدم بالملكية الفكرية الكاملة والحصرية لكافة النصوص والأبحاث والتقارير والملفات التي تقوم بكتابتها أو تنسيقها أو تصديرها عبر محرر مداد، ولا تدعي المنصة أي حقوق ملكية على مستنداتك الخاصة.'
                  : 'You retain full, exclusive copyright and ownership of all documents, papers, and content you author, format, or export using the midadd editor.'}
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="font-bold text-base sm:text-lg text-slate-900 dark:text-white">
                {isAr ? '3. الاستخدام المقبول ونظام الأرصدة' : '3. Acceptable Use & Credit System'}
              </h2>
              <p>
                {isAr
                  ? 'يُمنح المستخدمون رصيداً مجانياً لتجربة التصدير بصيغة Word وPDF، وتبقى الأرصدة المشتراة صالحة دون تاريخ انتهاء. يُحظر تماماً استخدام الموقع في نشر محتوى مخالف للقانون أو محاولة تعطيل البنية التحتية للموقع أو التلاعب بأنظمة التشغيل والرصيد.'
                  : 'Users receive complimentary credits to test DOCX and PDF exports, and purchased credits do not expire. Unlawful content, automated scraping, or attempts to disrupt platform infrastructure are strictly prohibited.'}
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="font-bold text-base sm:text-lg text-slate-900 dark:text-white">
                {isAr ? '4. الإعلانات والروابط الخارجية' : '4. Advertising & Third-Party Links'}
              </h2>
              <p>
                {isAr
                  ? 'قد يعرض الموقع إعلانات من طرف ثالث عبر Google AdSense لدعم استمرارية الأدوات المجانية. منصة مداد غير مسؤولة عن محتوى المواقع الخارجية التي قد يتم الانتقال إليها عبر روابط إعلانية أو مراجع إرشادية، ويخضع تعاملك معها لشروطها الخاصة.'
                  : 'midadd may display third-party advertisements through Google AdSense to support free tools. We are not responsible for external websites linked from ads or reference guides.'}
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="font-bold text-base sm:text-lg text-slate-900 dark:text-white">
                {isAr ? '5. إخلاء المسؤولية وحدودها' : '5. Disclaimer & Limitation of Liability'}
              </h2>
              <p>
                {isAr
                  ? 'تُقدَّم خدمات المحرر والأدلة الإرشادية "كما هي" دون أي ضمانات صريحة أو ضمنية. رغم حرصنا الدائم على أقصى دقة في تحويل المعادلات والجداول، يتحمل المستخدم مسؤولية مراجعة المستندات المصدرة قبل تسليمها رسمياً أو نشرها.'
                  : 'All editor tools and guides are provided "as is" without warranties of any kind. Users remain responsible for reviewing exported documents prior to official submission or publication.'}
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="font-bold text-base sm:text-lg text-slate-900 dark:text-white">
                {isAr ? '6. تعديل الشروط والتواصل' : '6. Amendments & Contact'}
              </h2>
              <p>
                {isAr
                  ? 'نحتفظ بالحق في تحديث بنود هذه الاتفاقية عند الحاجة لضمان الامتثال القانوني وتحسين الخدمة. لأي استفسارات تتعلق بشروط الاستخدام، تفضل بزيارة صفحة '
                  : 'We reserve the right to update these terms as required for legal compliance or platform updates. Questions may be sent via our '}
                <Link href="/contact" className="text-indigo-600 dark:text-indigo-400 font-bold hover:underline">
                  {isAr ? 'اتصل بنا' : 'Contact page'}
                </Link>
                .
              </p>
            </section>
          </div>
        </article>

        <AdSlot slotId="terms-bottom-01" format="horizontal" />
      </main>

      <Footer />
    </div>
  );
}
