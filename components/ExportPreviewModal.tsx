'use client';

import React, { useEffect, useMemo, useState } from 'react';
import {
  X,
  Eye,
  FileDown,
  Printer,
  FileText,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';
import { useLanguage } from './LanguageContext';
import { DocxExportOptions, renderDocxExportPreview } from '@/lib/docx-export';

export type PreviewTargetFormat = 'docx' | 'pdf';

interface ExportPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  markdown: string;
  documentTitle: string;
  exportOptions: DocxExportOptions;
  onExportDocx: () => void;
  onExportPdf: () => void;
  isExporting?: boolean;
}

export const ExportPreviewModal: React.FC<ExportPreviewModalProps> = ({
  isOpen,
  onClose,
  markdown,
  documentTitle,
  exportOptions,
  onExportDocx,
  onExportPdf,
  isExporting = false,
}) => {
  const { language } = useLanguage();
  const isAr = language === 'ar';
  const [targetFormat, setTargetFormat] = useState<PreviewTargetFormat>('docx');

  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen, onClose]);

  // Lock background scroll while modal is open
  useEffect(() => {
    if (!isOpen || typeof document === 'undefined') return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, [isOpen]);

  // Shared parser/renderer directly from lib/docx-export.ts so preview matches DOCX output
  const preview = useMemo(() => {
    return renderDocxExportPreview(markdown, {
      ...exportOptions,
      headerText: exportOptions.headerText || documentTitle,
    });
  }, [markdown, exportOptions, documentTitle]);

  if (!isOpen) return null;

  const { pageConfig, html, stats } = preview;
  const isLandscape = pageConfig.orientation === 'landscape';

  const desktopMarginPx = Math.round(pageConfig.marginMm * 1.4);
  const paperPaddingStyle: React.CSSProperties = {
    padding: `clamp(16px, 4.5vw, ${desktopMarginPx}px)`,
    fontFamily:
      pageConfig.fontFamily === 'Cairo'
        ? 'Cairo, Segoe UI, sans-serif'
        : pageConfig.fontFamily === 'Amiri'
        ? 'Amiri, Traditional Arabic, serif'
        : pageConfig.fontFamily === 'Traditional Arabic'
        ? 'Traditional Arabic, Amiri, serif'
        : pageConfig.fontFamily,
    fontSize: `${pageConfig.fontSizePt}pt`,
    lineHeight: pageConfig.lineSpacingRatio,
  };

  const marginLabel =
    pageConfig.margins === 'narrow'
      ? isAr
        ? 'ضيقة'
        : 'Narrow'
      : pageConfig.margins === 'wide'
      ? isAr
        ? 'واسعة'
        : 'Wide'
      : isAr
      ? 'عادية'
      : 'Normal';

  const orientationLabel = isLandscape
    ? isAr
      ? 'أفقي'
      : 'Landscape'
    : isAr
    ? 'عمودي'
    : 'Portrait';

  const formatTargetTitle =
    targetFormat === 'docx'
      ? isAr
        ? 'صيغة المخرجات المستهدفة: Microsoft Word (.docx)'
        : 'Target Output Format: Microsoft Word (.docx)'
      : isAr
      ? 'صيغة المخرجات المستهدفة: PDF جاهز للطباعة (.pdf)'
      : 'Target Output Format: Print-Ready PDF (.pdf)';

  return (
    <div
      className="no-print fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-5 bg-slate-950/70 backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
      aria-labelledby="export-preview-title"
      data-testid="export-preview-modal"
      onClick={e => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="w-full max-w-5xl max-h-[92vh] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="px-4 sm:px-6 py-3.5 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="h-9 w-9 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200/80 dark:border-indigo-800/70 flex items-center justify-center shrink-0">
              <Eye className="h-4.5 w-4.5" />
            </div>
            <div className="min-w-0">
              <h2
                id="export-preview-title"
                className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white truncate"
              >
                {isAr ? 'معاينة التصدير النهائي (PDF / DOCX)' : 'Export Preview (PDF / DOCX)'}
              </h2>
              <p
                className="text-xs font-medium text-slate-600 dark:text-slate-400 truncate"
                data-testid="preview-target-format-label"
              >
                {formatTargetTitle}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {/* Target Format Switcher (DOCX / PDF) */}
            <div
              className="inline-flex items-center rounded-lg bg-slate-100 dark:bg-slate-800 p-0.5 border border-slate-200 dark:border-slate-700"
              role="group"
              aria-label={isAr ? 'اختر صيغة المخرجات' : 'Select output format'}
            >
              <button
                type="button"
                onClick={() => setTargetFormat('docx')}
                data-testid="preview-format-docx"
                className={`px-2.5 py-1.5 rounded-md text-xs font-bold whitespace-nowrap shrink-0 transition cursor-pointer ${
                  targetFormat === 'docx'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                DOCX
              </button>
              <button
                type="button"
                onClick={() => setTargetFormat('pdf')}
                data-testid="preview-format-pdf"
                className={`px-2.5 py-1.5 rounded-md text-xs font-bold whitespace-nowrap shrink-0 transition cursor-pointer ${
                  targetFormat === 'pdf'
                    ? 'bg-slate-900 dark:bg-slate-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                PDF
              </button>
            </div>

            <button
              type="button"
              onClick={onClose}
              aria-label={isAr ? 'إغلاق المعاينة' : 'Close preview'}
              data-testid="close-preview-icon"
              className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
            >
              <X className="h-4.5 w-4.5" />
            </button>
          </div>
        </div>

        {/* Shared Engine Parity & Page Specs Strip */}
        <div className="px-4 sm:px-6 py-2 bg-slate-50 dark:bg-slate-950/70 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2 text-[11px] sm:text-xs text-slate-600 dark:text-slate-400 shrink-0">
          <div className="flex items-center gap-1.5 font-semibold text-emerald-700 dark:text-emerald-400">
            <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
            <span>
              {isAr
                ? 'مطابقة مباشرة لمحرك تصدير DOCX (العناوين، الألوان، المحاذاة، الجداول، الأكواد، والهوامش)'
                : 'Synced directly with DOCX export engine (headings, colors, alignment, tables, code & margins)'}
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-2 font-mono text-[11px]">
            <span>{pageConfig.paperSize.toUpperCase()}</span>
            <span>•</span>
            <span>{orientationLabel}</span>
            <span>•</span>
            <span>
              {isAr ? `هوامش: ${marginLabel}` : `Margins: ${marginLabel}`}
            </span>
            <span>•</span>
            <span>
              {pageConfig.fontFamily} {pageConfig.fontSizePt}pt
            </span>
          </div>
        </div>

        {/* Scrollable Paper Preview Stage */}
        <div
          className="flex-1 overflow-y-auto bg-slate-200/80 dark:bg-slate-950 p-3 sm:p-6 md:p-8 flex justify-center"
          data-testid="preview-scroll-container"
        >
          <div
            dir={pageConfig.direction}
            style={paperPaddingStyle}
            data-testid="preview-paper-sheet"
            className={`relative w-full ${
              isLandscape ? 'max-w-[1040px]' : 'max-w-[794px]'
            } min-h-[520px] h-fit bg-white text-slate-900 border border-slate-300 shadow-lg rounded-xs`}
          >
            {/* Simulated Running Header */}
            <div className="pb-2.5 mb-5 border-b border-slate-200 flex items-center justify-between text-[11px] text-slate-400 select-none">
              <span className="font-semibold truncate max-w-[320px]">
                {pageConfig.headerText || documentTitle || 'Untitled Document'}
              </span>
              <span className="font-mono uppercase">
                {targetFormat} • {pageConfig.paperSize}
              </span>
            </div>

            {/* Watermark Overlay */}
            {pageConfig.watermark && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden z-0">
                <span className="text-5xl sm:text-6xl font-black text-slate-200/60 uppercase tracking-widest rotate-[-32deg]">
                  {pageConfig.watermark}
                </span>
              </div>
            )}

            {/* Shared AST Preview Content */}
            <div className="relative z-10">
              {stats.blockCount === 0 || !html.trim() ? (
                <div className="py-20 text-center space-y-2 text-slate-400">
                  <FileText className="h-10 w-10 mx-auto text-slate-300" />
                  <p className="text-sm font-semibold text-slate-500">
                    {isAr
                      ? 'المستند فارغ حالياً — اكتب نصاً أو أدرج قالباً في المحرر لمعاينة شكل الملف المصدّر.'
                      : 'Document is currently empty — start typing or insert a template to preview the exported output.'}
                  </p>
                </div>
              ) : (
                <div
                  data-testid="preview-rendered-content"
                  className="prose-preview break-words"
                  dangerouslySetInnerHTML={{ __html: html }}
                />
              )}
            </div>
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="px-4 sm:px-6 py-3 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-wrap items-center justify-between gap-2.5 shrink-0">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
            <Sparkles className="h-3.5 w-3.5 text-indigo-500 shrink-0" />
            <span>
              {isAr
                ? `العناصر المكتشفة: ${stats.blockCount} كتلة`
                : `Detected blocks: ${stats.blockCount}`}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2 ms-auto">
            <button
              type="button"
              onClick={onExportPdf}
              className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-semibold border whitespace-nowrap shrink-0 transition cursor-pointer ${
                targetFormat === 'pdf'
                  ? 'bg-slate-900 dark:bg-slate-700 text-white border-slate-900 dark:border-slate-600 shadow-sm'
                  : 'border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <Printer className="h-4 w-4 shrink-0" />
              <span>{isAr ? 'تصدير / طباعة PDF' : 'Export / Print PDF'}</span>
            </button>

            <button
              type="button"
              onClick={onExportDocx}
              disabled={isExporting}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-bold shadow-sm whitespace-nowrap shrink-0 disabled:opacity-60 transition cursor-pointer"
            >
              <FileDown className="h-4 w-4 shrink-0" />
              <span>{isAr ? 'تنزيل Word (.docx)' : 'Download Word (.docx)'}</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              data-testid="close-preview-modal"
              className="px-3.5 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs sm:text-sm font-semibold whitespace-nowrap shrink-0 transition cursor-pointer"
            >
              {isAr ? 'إغلاق' : 'Close'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
