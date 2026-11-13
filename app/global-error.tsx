'use client';

import { useEffect } from 'react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    const isChunkError =
      error?.name === 'ChunkLoadError' ||
      error?.message?.includes('ChunkLoadError') ||
      error?.message?.includes('Loading chunk');

    if (isChunkError && typeof window !== 'undefined') {
      try {
        const lastReload = Number(sessionStorage.getItem('midadd_chunk_reload_at') || '0');
        const now = Date.now();
        if (now - lastReload > 10000) {
          sessionStorage.setItem('midadd_chunk_reload_at', String(now));
          window.location.reload();
        }
      } catch {
        window.location.reload();
      }
    }
  }, [error]);

  return (
    <html lang="ar" dir="rtl">
      <body className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-900 p-6">
        <div className="max-w-md w-full rounded-2xl bg-white border border-slate-200 p-6 text-center shadow-lg space-y-4">
          <h2 className="text-lg font-bold">حدث خطأ مؤقت في تحميل الملفات</h2>
          <p className="text-sm text-slate-600">
            يرجى تحديث الصفحة لإعادة تحميل أحدث نسخة من المنصة.
          </p>
          <div className="flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-sm font-bold cursor-pointer"
            >
              تحديث الصفحة
            </button>
            <button
              type="button"
              onClick={() => reset()}
              className="px-4 py-2 rounded-xl border border-slate-200 text-sm font-semibold cursor-pointer"
            >
              إعادة المحاولة
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}
