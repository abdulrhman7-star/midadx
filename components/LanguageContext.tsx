'use client';

import React, { createContext, useContext, useEffect, useSyncExternalStore, useCallback } from 'react';
import { translations, Translations, LANGUAGE_LIST } from '@/lib/translations';
import { SupportedLanguage, LanguageInfo } from '@/types';

interface LanguageContextType {
  language: SupportedLanguage;
  direction: 'ltr' | 'rtl';
  t: Translations;
  currentLanguageInfo: LanguageInfo;
  availableLanguages: LanguageInfo[];
  setLanguage: (lang: SupportedLanguage) => void;
  toggleLanguage: () => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const langListeners = new Set<() => void>();

function notifyLangListeners() {
  langListeners.forEach(cb => cb());
}

function subscribeLanguage(callback: () => void) {
  langListeners.add(callback);
  const onStorage = (e: StorageEvent) => {
    if (e.key === 'midadd_lang' || e.key === 'massivemark_lang') {
      callback();
    }
  };
  if (typeof window !== 'undefined') {
    window.addEventListener('storage', onStorage);
  }
  return () => {
    langListeners.delete(callback);
    if (typeof window !== 'undefined') {
      window.removeEventListener('storage', onStorage);
    }
  };
}

function getLangSnapshot(): SupportedLanguage {
  if (typeof window === 'undefined') return 'ar';
  try {
    const saved = (localStorage.getItem('midadd_lang') || localStorage.getItem('massivemark_lang')) as SupportedLanguage;
    if (['ar', 'en', 'fr', 'es', 'tr', 'de', 'zh'].includes(saved)) {
      return saved;
    }
  } catch {}
  return 'ar';
}

function getLangServerSnapshot(): SupportedLanguage {
  return 'ar';
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const language = useSyncExternalStore(subscribeLanguage, getLangSnapshot, getLangServerSnapshot);

  // Apply Google Translate Cookie and DOM Direction
  const applyGoogleTranslate = useCallback((targetLang: SupportedLanguage) => {
    if (typeof window === 'undefined') return;

    const domain = window.location.hostname;
    // Set googtrans cookie for automated full-page translation across all routes
    if (targetLang === 'ar') {
      document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
      document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.${domain}`;
    } else {
      document.cookie = `googtrans=/ar/${targetLang}; path=/;`;
      document.cookie = `googtrans=/ar/${targetLang}; path=/; domain=.${domain}`;
    }

    // Dynamically inject Google Translate script if non-Arabic/non-default language
    if (!document.getElementById('google-translate-script')) {
      const script = document.createElement('script');
      script.id = 'google-translate-script';
      script.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
      script.async = true;
      document.body.appendChild(script);

      (window as any).googleTranslateElementInit = () => {
        if ((window as any).google && (window as any).google.translate) {
          new (window as any).google.translate.TranslateElement(
            {
              pageLanguage: 'ar',
              includedLanguages: 'ar,en,fr,es,tr,de,zh,it,ru,ja,ko',
              autoDisplay: false,
            },
            'google_translate_element'
          );
        }
      };
    }
  }, []);

  const setLanguage = useCallback((lang: SupportedLanguage) => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('midadd_lang', lang);
        localStorage.setItem('massivemark_lang', lang);
      } catch {}

      const dir = lang === 'ar' ? 'rtl' : 'ltr';
      document.documentElement.dir = dir;
      document.documentElement.lang = lang;

      applyGoogleTranslate(lang);
    }
    notifyLangListeners();
  }, [applyGoogleTranslate]);

  const toggleLanguage = useCallback(() => {
    const currentIndex = LANGUAGE_LIST.findIndex(l => l.code === language);
    const nextIndex = (currentIndex + 1) % LANGUAGE_LIST.length;
    setLanguage(LANGUAGE_LIST[nextIndex].code);
  }, [language, setLanguage]);

  const currentLanguageInfo = LANGUAGE_LIST.find(l => l.code === language) || LANGUAGE_LIST[0];
  const direction = currentLanguageInfo.dir;
  const t = translations[language] || translations.ar;

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.dir = direction;
      document.documentElement.lang = language;
      applyGoogleTranslate(language);
    }
  }, [direction, language, applyGoogleTranslate]);

  return (
    <LanguageContext.Provider
      value={{
        language,
        direction,
        t,
        currentLanguageInfo,
        availableLanguages: LANGUAGE_LIST,
        setLanguage,
        toggleLanguage,
      }}
    >
      {/* Hidden container for Google Translate element */}
      <div id="google_translate_element" className="hidden" aria-hidden="true" />
      <div dir={direction} className={language === 'ar' ? 'font-sans' : ''}>
        {children}
      </div>
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
