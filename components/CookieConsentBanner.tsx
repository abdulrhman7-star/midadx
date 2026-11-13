'use client';

import React, { useSyncExternalStore } from 'react';
import Link from 'next/link';
import { useLanguage } from './LanguageContext';
import { Cookie, X } from 'lucide-react';

const CONSENT_STORAGE_KEY = 'midadd_cookie_consent_v1';
const CONSENT_EVENT = 'midadd-cookie-consent-change';

function subscribeConsent(callback: () => void) {
  window.addEventListener('storage', callback);
  window.addEventListener(CONSENT_EVENT, callback);
  return () => {
    window.removeEventListener('storage', callback);
    window.removeEventListener(CONSENT_EVENT, callback);
  };
}

function getClientConsentSnapshot(): boolean {
  try {
    return !localStorage.getItem(CONSENT_STORAGE_KEY);
  } catch {
    return false;
  }
}

function getServerConsentSnapshot(): boolean {
  return false;
}

export function CookieConsentBanner() {
  const { language } = useLanguage();
  const isAr = language === 'ar';
  const isVisible = useSyncExternalStore(
    subscribeConsent,
    getClientConsentSnapshot,
    getServerConsentSnapshot
  );

  const handleChoice = (choice: 'accepted' | 'essential') => {
    try {
      localStorage.setItem(CONSENT_STORAGE_KEY, choice);
      window.dispatchEvent(new Event(CONSENT_EVENT));
    } catch {
      // Ignore storage write errors
    }
  };

  if (!isVisible) return null;

  return (
    <div
      role="region"
      aria-label={isAr ? 'إشعار ملفات تعريف الارتباط' : 'Cookie consent notice'}
      className="no-print fixed bottom-0 inset-x-0 z-40 px-3 pb-2.5 sm:px-6 sm:pb-4 pointer-events-none"
    >
      <div className="max-w-4xl mx-auto pointer-events-auto rounded-2xl border border-slate-200 dark:border-slate-700 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md shadow-xl px-3.5 py-2.5 sm:px-5 sm:py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-4">
        <div className="flex items-start sm:items-center gap-2.5 min-w-0">
          <Cookie className="h-4 w-4 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5 sm:mt-0" />
          <p className="text-[11px] sm:text-xs text-slate-600 dark:text-slate-300 leading-snug">
            {isAr ? (
              <>
                نستخدم ملفات تعريف الارتباط لتحسين تجربتك وتخصيص الإعلانات عبر Google AdSense.{' '}
                <Link
                  href="/privacy-policy"
                  className="font-bold text-indigo-600 dark:text-indigo-400 hover:underline whitespace-nowrap"
                >
                  سياسة الخصوصية
                </Link>
              </>
            ) : (
              <>
                We use cookies to improve your experience and serve relevant ads via Google AdSense.{' '}
                <Link
                  href="/privacy-policy"
                  className="font-bold text-indigo-600 dark:text-indigo-400 hover:underline whitespace-nowrap"
                >
                  Privacy Policy
                </Link>
              </>
            )}
          </p>
        </div>

        <div className="flex items-center justify-end gap-2 shrink-0">
          <button
            type="button"
            onClick={() => handleChoice('essential')}
            className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-[11px] sm:text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            {isAr ? 'الضرورية فقط' : 'Essential Only'}
          </button>
          <button
            type="button"
            onClick={() => handleChoice('accepted')}
            className="px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-[11px] sm:text-xs font-bold transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            {isAr ? 'موافق' : 'Accept All'}
          </button>
          <button
            type="button"
            onClick={() => handleChoice('essential')}
            aria-label={isAr ? 'إغلاق إشعار ملفات تعريف الارتباط' : 'Dismiss cookie notice'}
            className="p-1 rounded-md text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
