'use client';

import React from 'react';
import Link from 'next/link';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { AdSlot } from '@/components/AdSlot';
import { useLanguage } from '@/components/LanguageContext';
import { useSession, useSavedDocsList, logoutAccount } from '@/lib/guest-session';
import { useTheme } from '@/lib/theme';
import { ShieldCheck, Lock } from 'lucide-react';

export function PrivacyPolicyContent() {
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
            <div className="inline-flex items-center gap-2 text-emerald-700 dark:text-emerald-400 text-xs font-bold mb-2">
              <ShieldCheck className="h-4 w-4" />
              <span>{isAr ? 'وثيقة الشفافية والخصوصية القانونية' : 'Legal Privacy & Cookie Policy'}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              {isAr ? 'سياسة الخصوصية وملفات تعريف الارتباط' : 'Privacy & Cookie Policy'}
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
              {isAr
                ? 'آخر تحديث: نوفمبر 2026 · سارية على منصة مداد (midadd.com)'
                : 'Last updated: November 2026 · Applicable to midadd (midadd.com)'}
            </p>
          </header>

          {/* Core Privacy Pillar */}
          <div className="p-5 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200/80 dark:border-indigo-800/80 space-y-2">
            <h2 className="font-bold text-sm text-indigo-900 dark:text-indigo-200 flex items-center gap-2">
              <Lock className="h-4 w-4" />
              <span>
                {isAr
                  ? 'المبدأ الأساسي: معالجة المستندات محلياً داخل متصفحك (Client-Side)'
                  : 'Core Principle: Client-Side Document Processing'}
              </span>
            </h2>
            <p className="text-xs sm:text-sm leading-relaxed text-indigo-900/90 dark:text-indigo-200">
              {isAr
                ? 'تُبنى منصة مداد (midadd) على مبدأ الخصوصية التامة؛ حيث تتم معالجة نصوص Markdown والمعادلات الرياضية وتوليد ملفات Word (.docx) وPDF داخل متصفح جهازك محلياً دون إرسال مسوداتك الخاصة إلى خوادم تحليل خارجية، إلا عند اختيارك الطوعي لحفظها في حسابك السحابي.'
                : 'midadd processes Markdown text, equations, and DOCX/PDF rendering directly within your browser runtime. Your document drafts are never transmitted to external processing servers unless you explicitly choose to sync them to your account.'}
            </p>
          </div>

          <div className="space-y-6 text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
            <section className="space-y-2">
              <h2 className="font-bold text-base sm:text-lg text-slate-900 dark:text-white">
                {isAr ? '1. البيانات التي نجمعها وكيفية استخدامها' : '1. Information We Collect & How We Use It'}
              </h2>
              <p>
                {isAr
                  ? 'نجمع الحد الأدنى من البيانات اللازمة لتشغيل حسابك وتقديم الخدمة بكفاءة، وتشمل:'
                  : 'We collect only the minimum personal data needed to operate your account and deliver our services:'}
              </p>
              <ul className="list-disc list-inside space-y-1.5 text-slate-600 dark:text-slate-300">
                <li>
                  {isAr
                    ? 'بيانات التسجيل الطوعية: الاسم، وعنوان البريد الإلكتروني عند إنشاء حساب دائم أو استخدام نموذج اتصل بنا.'
                    : 'Voluntary account details: display name and email address when registering or submitting support requests.'}
                </li>
                <li>
                  {isAr
                    ? 'بيانات التشغيل والرصيد: سجل الأرصدة المتاحة، إعدادات اللغة والاتجاه (RTL/LTR)، والمستندات التي تختار حفظها.'
                    : 'Operational state: remaining export credits, language/direction preferences, and documents you choose to save.'}
                </li>
                <li>
                  {isAr
                    ? 'ملفات السجل التقنية القياسية (Log Files): قد يسجل مزود الاستضافة بيانات تقنية غير شخصية مثل نوع المتصفح، ونظام التشغيل، وتاريخ الزيارة لأغراض الحماية والأداء.'
                    : 'Standard server log files: browser type, OS, timestamps, and referral information for security and reliability.'}
                </li>
              </ul>
            </section>

            <section className="space-y-2">
              <h2 className="font-bold text-base sm:text-lg text-slate-900 dark:text-white">
                {isAr ? '2. ملفات تعريف الارتباط (Cookies) والتخزين المحلي' : '2. Cookies & Local Storage Technologies'}
              </h2>
              <p>
                {isAr
                  ? 'يستخدم موقعنا ملفات تعريف الارتباط (Cookies) وتقنية التخزين المحلي (Local Storage) لحفظ تفضيلات الزائر مثل اللغة المختارة، وضع العرض (النهاري أو الليلي)، وحالة موافقتك على إشعار الكوكيز، بالإضافة إلى تيسير حفظ المسودات على جهازك.'
                  : 'Our website uses cookies and browser local storage to remember your language preference, light/dark display mode, cookie consent choice, and local draft backups.'}
              </p>
              <p>
                {isAr
                  ? 'يمكنك التحكم في ملفات تعريف الارتباط أو حذفها في أي وقت عبر إعدادات متصفحك (Chrome, Safari, Firefox, Edge). قد يؤدي تعطيل ملفات تعريف الارتباط الأساسية إلى إعادة ضبط بعض تفضيلات العرض عند تحديث الصفحة.'
                  : 'You can inspect, block, or clear cookies anytime through your browser settings. Disabling essential cookies may reset display preferences across sessions.'}
              </p>
            </section>

            <section className="space-y-2.5">
              <h2 className="font-bold text-base sm:text-lg text-slate-900 dark:text-white">
                {isAr ? '3. إعلانات الطرف الثالث وخدمة Google AdSense' : '3. Third-Party Advertising & Google AdSense'}
              </h2>
              <p>
                {isAr
                  ? 'نستعين بشركات إعلانية من طرف ثالث — وعلى رأسها شبكة Google AdSense — لعرض الإعلانات عند زيارتك لمنصة مداد. بصفتها مورداً خارجياً، تستخدم شركة Google ملفات تعريف الارتباط (بما في ذلك ملف تعريف الارتباط الخاص بالإعلانات) لعرض إعلانات للزوار استناداً إلى زيارتهم لموقعنا أو لمواقع أخرى على شبكة الإنترنت.'
                  : 'We partner with third-party advertising networks, primarily Google AdSense, to display advertisements on midadd. As a third-party vendor, Google uses cookies to serve ads based on a user’s prior visits to our website or other websites across the Internet.'}
              </p>
              <p>
                {isAr
                  ? 'قد يستخدم شركاء الإعلانات في Google تقنيات قياس وتخصيص الإعلانات لعرض إعلانات أكثر ملاءمة لاهتماماتك دون تزويد منصة مداد بإمكانية الوصول إلى ملفات تعريف الارتباط الخاصة بتلك الشركات الإعلانية أو التحكم بها.'
                  : 'Google and its partners may use advertising cookies to deliver relevant ads and measure campaign performance. midadd has no direct control over cookies set by third-party advertising networks.'}
              </p>
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1.5">
                <h3 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">
                  {isAr ? 'كيفية تعطيل الإعلانات المخصصة (Opt-Out):' : 'How to Opt Out of Personalized Advertising:'}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  {isAr ? (
                    <>
                      يحق للمستخدمين في أي وقت إيقاف استخدام الإعلانات المخصصة عبر زيارة صفحة{' '}
                      <a
                        href="https://www.google.com/settings/ads"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-indigo-600 dark:text-indigo-400 font-bold hover:underline"
                      >
                        إعدادات إعلانات Google
                      </a>
                      ، أو إدارة تفضيلات ملفات تعريف الارتباط للإعلانات الخارجية عبر موقع{' '}
                      <a
                        href="https://www.aboutads.info/choices/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-indigo-600 dark:text-indigo-400 font-bold hover:underline"
                      >
                        www.aboutads.info
                      </a>
                      .
                    </>
                  ) : (
                    <>
                      Users may opt out of personalized advertising by visiting{' '}
                      <a
                        href="https://www.google.com/settings/ads"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-indigo-600 dark:text-indigo-400 font-bold hover:underline"
                      >
                        Google Ads Settings
                      </a>{' '}
                      or disabling third-party vendor cookies at{' '}
                      <a
                        href="https://www.aboutads.info/choices/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-indigo-600 dark:text-indigo-400 font-bold hover:underline"
                      >
                        www.aboutads.info/choices
                      </a>
                      .
                    </>
                  )}
                </p>
              </div>
            </section>

            <section className="space-y-2">
              <h2 className="font-bold text-base sm:text-lg text-slate-900 dark:text-white">
                {isAr ? '4. أمان البيانات والمدفوعات وحماية القاصرين' : '4. Data Security, Payments & Children’s Privacy'}
              </h2>
              <p>
                {isAr
                  ? 'نطبق إجراءات تقنية حديثة لحماية بيانات الحساب عبر بروتوكول HTTPS وخدمات مصادقة مشفرة. تتم أي عمليات دفع إلكترونية عبر مزودي دفع مرخصين ومشفرين بالكامل، ولا تحتفظ منصة مداد بأرقام البطاقات البنكية. كما لا يستهدف الموقع جمع بيانات شخصية من الأطفال دون سن 13 عاماً.'
                  : 'We protect account interactions with HTTPS encryption and trusted authentication services. Payment details are handled strictly by certified payment processors. midadd does not knowingly collect personal information from children under 13.'}
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="font-bold text-base sm:text-lg text-slate-900 dark:text-white">
                {isAr ? '5. حقوقك والتواصل بشأن الخصوصية' : '5. Your Rights & Privacy Contact'}
              </h2>
              <p>
                {isAr
                  ? 'لك كامل الحق في طلب الاطلاع على بيانات حسابك أو تعديلها أو حذفها نهائياً في أي وقت. للاستفسارات القانونية أو طلبات حذف البيانات، يرجى مراسلتنا عبر البريد الإلكتروني '
                  : 'You have the right to request access, correction, or deletion of your account data at any time. For privacy inquiries, please email '}
                <a
                  href="mailto:support@midadd.com"
                  className="text-indigo-600 dark:text-indigo-400 font-bold hover:underline"
                >
                  support@midadd.com
                </a>{' '}
                {isAr ? 'أو زيارة صفحة ' : 'or visit our '}
                <Link href="/contact" className="text-indigo-600 dark:text-indigo-400 font-bold hover:underline">
                  {isAr ? 'اتصل بنا' : 'Contact page'}
                </Link>
                .
              </p>
            </section>
          </div>
        </article>

        <AdSlot slotId="privacy-bottom-01" format="horizontal" />
      </main>

      <Footer />
    </div>
  );
}
