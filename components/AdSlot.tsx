'use client';

import React, { useEffect, useRef } from 'react';
import { useLanguage } from './LanguageContext';

declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

interface AdSlotProps {
  slotId?: string;
  format?: 'auto' | 'horizontal' | 'rectangle';
  className?: string;
}

const ADSENSE_CLIENT_ID =
  process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID || 'ca-pub-7623404336729587';

export function AdSlot({
  slotId = '0000000000',
  format = 'auto',
  className = '',
}: AdSlotProps) {
  const { language } = useLanguage();
  const isAr = language === 'ar';
  const pushedRef = useRef(false);

  useEffect(() => {
    if (pushedRef.current) return;
    pushedRef.current = true;
    try {
      if (typeof window !== 'undefined' && Array.isArray(window.adsbygoogle)) {
        window.adsbygoogle.push({});
      }
    } catch {
      // AdSense script may be pending approval or blocked by ad blockers
    }
  }, []);

  const minHeightClass =
    format === 'rectangle' ? 'min-h-[250px]' : 'min-h-[96px] sm:min-h-[110px]';

  return (
    <aside
      aria-label={isAr ? 'مساحة إعلانية' : 'Advertisement'}
      className={`no-print w-full my-6 ${className}`}
    >
      <div className="w-full rounded-xl border border-slate-200/80 dark:border-slate-800/80 bg-slate-50/80 dark:bg-slate-900/50 px-4 py-3 text-center">
        <div className="text-[11px] font-medium text-slate-400 dark:text-slate-500 mb-2 select-none">
          {isAr ? 'إعلان مدعوم' : 'Advertisement'}
        </div>
        <div className={`w-full overflow-hidden flex items-center justify-center ${minHeightClass}`}>
          <ins
            className="adsbygoogle w-full"
            style={{ display: 'block', minHeight: format === 'rectangle' ? '250px' : '90px' }}
            data-ad-client={ADSENSE_CLIENT_ID}
            data-ad-slot={slotId}
            data-ad-format={format}
            data-full-width-responsive="true"
          />
        </div>
      </div>
    </aside>
  );
}
