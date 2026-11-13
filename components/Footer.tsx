'use client';

import React from 'react';
import Link from 'next/link';
import { useLanguage } from './LanguageContext';
import { ShieldCheck } from 'lucide-react';

export function Footer() {
  const { language } = useLanguage();
  const isAr = language === 'ar';
  const currentYear = new Date().getFullYear();

  return (
    <footer className="no-print border-t border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm transition-colors mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 mb-8">
          {/* Brand Info */}
          <div className="sm:col-span-2 md:col-span-1">
            <Link href="/" className="inline-flex items-center gap-2.5 mb-3 group text-slate-900 dark:text-white">
              <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform shrink-0">
                <span className="text-lg">✒️</span>
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-base tracking-tight">
                  {isAr ? 'مداد' : 'midadd'} <span className="text-indigo-600 dark:text-indigo-400 font-mono text-xs">DOCS</span>
                </span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                  {isAr ? 'منصة تنسيق المستندات والذكاء الاصطناعي' : 'AI Document Formatting Platform'}
                </span>
              </div>
            </Link>
            <p className="text-xs leading-relaxed text-slate-500 dark:text-slate-400 max-w-xs">
              {isAr
                ? 'حوّل نصوص الذكاء الاصطناعي إلى مستندات Word وPDF احترافية مع الحفاظ على المعادلات الرياضية والجداول واتجاه اللغة العربية.'
                : 'Convert AI-generated Markdown into professionally formatted Word (DOCX) and PDF documents with preserved LaTeX math equations and tables.'}
            </p>
          </div>

          {/* Product Links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white mb-3">
              {isAr ? 'المنصة والأدوات' : 'Platform'}
            </h4>
            <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
              <li>
                <Link href="/" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  {isAr ? 'الرئيسية — المحرر الذكي' : 'Home — Smart Editor'}
                </Link>
              </li>
              <li>
                <Link href="/templates" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors flex items-center gap-1.5">
                  <span>{isAr ? 'القوالب الجاهزة' : 'Ready Templates'}</span>
                  <span className="text-[11px] text-indigo-600 dark:text-indigo-400 font-semibold">· 22</span>
                </Link>
              </li>
              <li>
                <Link href="/guides" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  {isAr ? 'الأدلة الإرشادية والمدونة' : 'Guides & Blog'}
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  {isAr ? 'خطط الأسعار' : 'Pricing Plans'}
                </Link>
              </li>
            </ul>
          </div>

          {/* Account Links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white mb-3">
              {isAr ? 'الحساب والدعم' : 'Account & Support'}
            </h4>
            <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
              <li>
                <Link href="/login" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  {isAr ? 'تسجيل الدخول' : 'Sign In'}
                </Link>
              </li>
              <li>
                <Link href="/signup" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  {isAr ? 'إنشاء حساب جديد' : 'Create Free Account'}
                </Link>
              </li>
              <li>
                <Link href="/profile" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  {isAr ? 'الملف الشخصي والمستندات' : 'Profile & Documents'}
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  {isAr ? 'اتصل بنا' : 'Contact Us'}
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal Links (Required for Google AdSense Review) */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white mb-3">
              {isAr ? 'الصفحات القانونية' : 'Legal & Info'}
            </h4>
            <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
              <li>
                <Link href="/about" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  {isAr ? 'من نحن' : 'About Us'}
                </Link>
              </li>
              <li>
                <Link href="/privacy-policy" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  {isAr ? 'سياسة الخصوصية' : 'Privacy Policy'}
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  {isAr ? 'اتفاقية الاستخدام' : 'Terms of Service'}
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors inline-flex items-center gap-1">
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
                  <span>{isAr ? 'الدعم والاستفسارات' : 'Support Center'}</span>
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-6 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 dark:text-slate-400 text-center sm:text-start">
          <div>
            © {currentYear}{' '}
            <span className="font-bold text-slate-700 dark:text-slate-200">
              {isAr ? 'مداد (midadd)' : 'midadd'}
            </span>{' '}
            —{' '}
            {isAr
              ? 'جميع الحقوق محفوظة. منصة تحويل نصوص الذكاء الاصطناعي إلى Word وPDF.'
              : 'All rights reserved. AI Markdown to Word and PDF document platform.'}
          </div>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link href="/about" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
              {isAr ? 'من نحن' : 'About'}
            </Link>
            <Link href="/privacy-policy" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
              {isAr ? 'سياسة الخصوصية' : 'Privacy'}
            </Link>
            <Link href="/terms" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
              {isAr ? 'اتفاقية الاستخدام' : 'Terms'}
            </Link>
            <Link href="/contact" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
              {isAr ? 'اتصل بنا' : 'Contact'}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
