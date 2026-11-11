import { renderLatexHtml } from './latex-to-omml';

export function markdownToHtml(markdown: string, direction: 'rtl' | 'ltr' = 'ltr'): string {
  if (!markdown) return '';

  const lines = markdown.split('\n');
  const htmlParts: string[] = [];
  let inCodeBlock = false;
  let codeBlockLang = '';
  let codeBlockContent: string[] = [];

  let inTable = false;
  let tableRows: string[][] = [];
  let tableAlignments: string[] = [];

  let inBlockquote = false;
  let blockquoteContent: string[] = [];

  let inList = false;
  let listType: 'ul' | 'ol' = 'ul';

  const flushList = () => {
    if (inList) {
      htmlParts.push(`</${listType}>`);
      inList = false;
    }
  };

  const flushBlockquote = () => {
    if (inBlockquote) {
      const quoteText = blockquoteContent.join('<br/>');
      htmlParts.push(`<blockquote class="border-l-4 border-indigo-500 pl-4 py-1.5 my-3 italic bg-indigo-50/50 dark:bg-indigo-950/30 rounded-r text-slate-700 dark:text-slate-300 ${direction === 'rtl' ? 'text-right' : 'text-left'}" dir="${direction}">${parseInlineMarkdown(quoteText)}</blockquote>`);
      blockquoteContent = [];
      inBlockquote = false;
    }
  };

  const flushTable = () => {
    if (inTable && tableRows.length > 0) {
      let tableHtml = `<div class="overflow-x-auto my-4" dir="${direction}"><table class="editor-table border-collapse w-full border border-slate-300 dark:border-slate-700 text-sm ${direction === 'rtl' ? 'text-right' : 'text-left'}">`;
      
      // Header row
      const headers = tableRows[0];
      tableHtml += '<thead><tr class="bg-slate-100 dark:bg-slate-800">';
      headers.forEach((h, idx) => {
        const align = tableAlignments[idx] || 'left';
        tableHtml += `<th class="border border-slate-300 dark:border-slate-700 px-3 py-2 font-semibold text-${align}">${parseInlineMarkdown(h)}</th>`;
      });
      tableHtml += '</tr></thead>';

      // Body rows
      tableHtml += '<tbody>';
      for (let r = 1; r < tableRows.length; r++) {
        const row = tableRows[r];
        const zebra = r % 2 === 0 ? 'bg-slate-50/50 dark:bg-slate-900/50' : 'bg-white dark:bg-slate-950';
        tableHtml += `<tr class="${zebra}">`;
        row.forEach((cell, idx) => {
          const align = tableAlignments[idx] || 'left';
          tableHtml += `<td class="border border-slate-300 dark:border-slate-700 px-3 py-2 text-${align}">${parseInlineMarkdown(cell)}</td>`;
        });
        tableHtml += '</tr>';
      }
      tableHtml += '</tbody></table></div>';
      htmlParts.push(tableHtml);

      tableRows = [];
      tableAlignments = [];
      inTable = false;
    }
  };

  // Helper to check table row
  const isTableRow = (line: string) => {
    const trimmed = line.trim();
    return trimmed.startsWith('|') && trimmed.endsWith('|') && trimmed.includes('|');
  };

  const isTableSeparator = (line: string) => {
    const trimmed = line.trim();
    if (!trimmed.startsWith('|') || !trimmed.endsWith('|')) return false;
    const inner = trimmed.slice(1, -1);
    return /^(\s*:?-+:?\s*\|)*\s*:?-+:?\s*$/.test(inner);
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    // 1. Code block handling
    if (trimmed.startsWith('```')) {
      flushList();
      flushBlockquote();
      flushTable();

      if (!inCodeBlock) {
        inCodeBlock = true;
        codeBlockLang = trimmed.slice(3).trim() || 'code';
        codeBlockContent = [];
      } else {
        inCodeBlock = false;
        const codeText = escapeHtml(codeBlockContent.join('\n'));
        htmlParts.push(
          `<div class="my-4 rounded-lg border border-slate-800 bg-slate-950 text-slate-100 overflow-hidden shadow-sm" dir="ltr">
            <div class="flex items-center justify-between px-4 py-1.5 bg-slate-900/90 border-b border-slate-800 text-xs font-mono text-slate-400">
              <span class="font-medium">${codeBlockLang}</span>
              <span>Code Block</span>
            </div>
            <pre class="editor-code-block p-4 overflow-x-auto text-xs sm:text-sm font-mono leading-relaxed"><code class="language-${codeBlockLang}">${codeText}</code></pre>
          </div>`
        );
      }
      continue;
    }

    if (inCodeBlock) {
      codeBlockContent.push(line);
      continue;
    }

    // 2. Display math $$...$$ on multiple or single line
    if (trimmed.startsWith('$$') && trimmed.endsWith('$$') && trimmed.length > 2) {
      flushList();
      flushBlockquote();
      flushTable();
      const mathFormula = trimmed.slice(2, -2).trim();
      const renderedMath = renderLatexHtml(mathFormula, true);
      htmlParts.push(
        `<div class="katex-display my-4 p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-md text-center overflow-x-auto" data-latex="${escapeHtml(mathFormula)}">${renderedMath}</div>`
      );
      continue;
    }

    // Display math block multiline
    if (trimmed === '$$' || trimmed === '\\[') {
      flushList();
      flushBlockquote();
      flushTable();
      let mathLines: string[] = [];
      i++;
      while (i < lines.length && lines[i].trim() !== '$$' && lines[i].trim() !== '\\]') {
        mathLines.push(lines[i]);
        i++;
      }
      const mathFormula = mathLines.join(' ').trim();
      const renderedMath = renderLatexHtml(mathFormula, true);
      htmlParts.push(
        `<div class="katex-display my-4 p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-md text-center overflow-x-auto" data-latex="${escapeHtml(mathFormula)}">${renderedMath}</div>`
      );
      continue;
    }

    // 3. Table handling
    if (isTableRow(line)) {
      flushList();
      flushBlockquote();

      if (isTableSeparator(line)) {
        // Table separator row, parse alignments
        const cols = line.trim().slice(1, -1).split('|');
        tableAlignments = cols.map(c => {
          const t = c.trim();
          if (t.startsWith(':') && t.endsWith(':')) return 'center';
          if (t.endsWith(':')) return 'right';
          return 'left';
        });
      } else {
        inTable = true;
        const cells = line.trim().slice(1, -1).split('|').map(c => c.trim());
        tableRows.push(cells);
      }
      continue;
    } else {
      flushTable();
    }

    // 4. Blockquotes
    if (trimmed.startsWith('>')) {
      flushList();
      inBlockquote = true;
      blockquoteContent.push(trimmed.replace(/^>\s?/, ''));
      continue;
    } else {
      flushBlockquote();
    }

    // 5. Empty lines
    if (!trimmed) {
      flushList();
      continue;
    }

    // 6. Horizontal Rule
    if (/^(---+|\*\*\*+|___+)$/.test(trimmed)) {
      flushList();
      htmlParts.push('<hr class="my-6 border-slate-200 dark:border-slate-800" />');
      continue;
    }

    // 7. Headings
    if (trimmed.startsWith('#')) {
      flushList();
      const hTag = trimmed.startsWith('#### ') ? 'h4' : trimmed.startsWith('### ') ? 'h3' : trimmed.startsWith('## ') ? 'h2' : 'h1';
      const hContent = trimmed.replace(/^#+\s+/, '');
      const hClasses = trimmed.startsWith('#### ') ? "text-base font-semibold mt-4 mb-2 text-slate-800 dark:text-slate-100" : trimmed.startsWith('### ') ? "text-lg font-bold mt-5 mb-2 text-slate-900 dark:text-slate-50" : trimmed.startsWith('## ') ? "text-xl font-bold mt-6 mb-3 text-slate-900 dark:text-slate-50 pb-1 border-b border-slate-200 dark:border-slate-800" : "text-2xl sm:text-3xl font-extrabold mt-6 mb-4 text-slate-900 dark:text-slate-50 tracking-tight";
      htmlParts.push(`<${hTag} class="${hClasses} ${direction === 'rtl' ? 'text-right' : 'text-left'}" dir="${direction}">${parseInlineMarkdown(hContent)}</${hTag}>`);
      continue;
    }

    // 8. Lists (Task lists, unordered, ordered)
    // Task list: - [ ] or - [x]
    const taskMatch = line.match(/^(\s*)[-*]\s+\[([ xX])\]\s+(.*)$/);
    if (taskMatch) {
      if (!inList || listType !== 'ul') {
        flushList();
        inList = true;
        listType = 'ul';
        htmlParts.push(`<ul class="my-3 space-y-1.5 list-none pl-1 ${direction === 'rtl' ? 'text-right' : 'text-left'}" dir="${direction}">`);
      }
      const checked = taskMatch[2].toLowerCase() === 'x';
      const text = taskMatch[3];
      htmlParts.push(
        `<li class="flex items-center space-x-2 ${direction === 'rtl' ? 'flex-row-reverse space-x-reverse' : ''}">
          <input type="checkbox" ${checked ? 'checked' : ''} disabled class="h-4 w-4 rounded text-red-600 border-slate-300" />
          <span class="${checked ? 'line-through text-slate-400' : ''}">${parseInlineMarkdown(text)}</span>
        </li>`
      );
      continue;
    }

    // Unordered list: - or *
    const ulMatch = line.match(/^(\s*)[-*]\s+(.*)$/);
    if (ulMatch) {
      if (!inList || listType !== 'ul') {
        flushList();
        inList = true;
        listType = 'ul';
        htmlParts.push(`<ul class="my-3 space-y-1.5 ${direction === 'rtl' ? 'list-disc pr-6' : 'list-disc pl-6'} text-slate-700 dark:text-slate-300 ${direction === 'rtl' ? 'text-right' : 'text-left'}" dir="${direction}">`);
      }
      htmlParts.push(`<li>${parseInlineMarkdown(ulMatch[2])}</li>`);
      continue;
    }

    // Ordered list: 1.
    const olMatch = line.match(/^(\s*)\d+\.\s+(.*)$/);
    if (olMatch) {
      if (!inList || listType !== 'ol') {
        flushList();
        inList = true;
        listType = 'ol';
        htmlParts.push(`<ol class="my-3 space-y-1.5 ${direction === 'rtl' ? 'list-decimal pr-6' : 'list-decimal pl-6'} text-slate-700 dark:text-slate-300 ${direction === 'rtl' ? 'text-right' : 'text-left'}" dir="${direction}">`);
      }
      htmlParts.push(`<li>${parseInlineMarkdown(olMatch[2])}</li>`);
      continue;
    }

    // 8.5 Existing HTML block or aligned paragraph: <p style="...">, <div style="...">, <img ...>
    if (/^<(p|div|img|figure|table|blockquote|h1|h2|h3|h4|h5|h6)\b/i.test(trimmed)) {
      flushList();
      htmlParts.push(parseInlineMarkdown(line));
      continue;
    }

    // Standard Paragraph
    flushList();
    htmlParts.push(`<p class="my-3 leading-relaxed text-slate-700 dark:text-slate-300 ${direction === 'rtl' ? 'text-right' : 'text-left'}" dir="${direction}">${parseInlineMarkdown(line)}</p>`);
  }

  flushList();
  flushBlockquote();
  flushTable();

  return htmlParts.join('\n');
}

/**
 * Parses inline markdown: images, inline math ($...$), bold, italic, code, links, strikethrough
 */
export function parseInlineMarkdown(text: string): string {
  if (!text) return '';

  let out = text;

  // 0. Image markdown: ![alt](src)
  out = out.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, (match, alt, src) => {
    const cleanAlt = escapeHtml(alt || 'Image');
    return `<img src="${src}" alt="${cleanAlt}" class="max-w-full h-auto rounded-lg border border-slate-200 dark:border-slate-800 shadow-md my-3 inline-block align-middle" />`;
  });

  // 1. Inline LaTeX math: $...$ or \(...\)
  out = out.replace(/\$([^\$\n]+)\$/g, (match, formula) => {
    try {
      const rendered = renderLatexHtml(formula.trim(), false);
      return `<span class="katex-inline inline-block px-1 py-0.5 bg-slate-100 dark:bg-slate-800 rounded font-serif" data-latex="${escapeHtml(formula.trim())}">${rendered}</span>`;
    } catch {
      return match;
    }
  });

  out = out.replace(/\\\(([^\(\)\n]+)\\\)/g, (match, formula) => {
    try {
      const rendered = renderLatexHtml(formula.trim(), false);
      return `<span class="katex-inline inline-block px-1 py-0.5 bg-slate-100 dark:bg-slate-800 rounded font-serif" data-latex="${escapeHtml(formula.trim())}">${rendered}</span>`;
    } catch {
      return match;
    }
  });

  // 2. Inline code: `...`
  out = out.replace(/`([^`]+)`/g, '<code class="px-1.5 py-0.5 text-xs font-mono bg-slate-100 dark:bg-slate-800 text-red-600 dark:text-red-400 rounded border border-slate-200 dark:border-slate-700">$1</code>');

  // 3. Bold: **text** or __text__
  out = out.replace(/\*\*([^*]+)\*\*/g, '<strong class="font-bold text-slate-900 dark:text-slate-100">$1</strong>');
  out = out.replace(/__([^_]+)__/g, '<strong class="font-bold text-slate-900 dark:text-slate-100">$1</strong>');

  // 4. Italic: *text* or _text_
  out = out.replace(/\*([^*]+)\*/g, '<em class="italic">$1</em>');
  out = out.replace(/_([^_]+)_/g, '<em class="italic">$1</em>');

  // 5. Strikethrough: ~~text~~
  out = out.replace(/~~([^~]+)~~/g, '<del class="line-through text-slate-400">$1</del>');

  // 6. Links: [label](url)
  out = out.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-blue-600 dark:text-blue-400 hover:underline font-medium">$1</a>');

  return out;
}

function escapeHtml(unsafe: string): string {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Built-in Preset Markdown Templates
 */
export interface MarkdownPreset {
  id: string;
  titleEn: string;
  titleAr: string;
  markdown: string;
}

export const SAMPLE_MARKDOWN_PRESETS: MarkdownPreset[] = [
  {
    id: 'quantum',
    titleEn: 'Quantum Entanglement & Superposition Report',
    titleAr: 'ورقة بحثية: التشابك والتراكب الكمي',
    markdown: `# ورقة بحثية: دراسة التراكب والتشابك الكمي

> **ملخص البحث:** يهدف هذا المستند إلى تحليل ظاهرة التشابك الكمي (Quantum Entanglement) وحساب متجهات الحالات الحسابية بأسلوب أكاديمي احترافي.

---

## 1. المقدمة والخلفية النظرية

تُعد الميكانيكا الكمية إحدى أهم الثورات العلمية في الفيزياء الحديثة. تعتمد صيغة حالة الكيوبت (Qubit) العامة على حالة التراكب:

$$\\psi = \\alpha |0\\rangle + \\beta |1\\rangle$$

حيث تحقق الأعداد المركبة $\\alpha$ و $\\beta$ الشروط التالية:

$$|\\alpha|^2 + |\\beta|^2 = 1$$

---

## 2. مصفوفة الكثافة وحالة بيل (Bell State)

تتميز حالات بيل المشابكة بصيغتها الرياضية المعيارية:

$$|\\Phi^+\\rangle = \\frac{1}{\\sqrt{2}} \\left( |00\\rangle + |11\\rangle \\right)$$

### جدول المقارنة للحالات الكمية:

| نوع الحالة | الصيغة الرياضية | درجة التشابك | التطبيق العملي |
| :--- | :---: | :---: | ---: |
| Qubit Single | $\\alpha|0\\rangle + \\beta|1\\rangle$ | $0.0$ | التخزين الحسابي |
| Bell State | $\\frac{1}{\\sqrt{2}}(|00\\rangle + |11\\rangle)$ | $1.0$ | التشفير الكمي |
| GHZ State | $\\frac{1}{\\sqrt{2}}(|000\\rangle + |111\\rangle)$ | $1.0$ | الاتصالات الجماعية |

---

## 3. خوارزمية المحاكاة البرمجية (Python)

\`\`\`python
import numpy as np

def generate_bell_state():
    # Bell state creation matrix
    qubit_00 = np.array([1, 0, 0, 0])
    qubit_11 = np.array([0, 0, 0, 1])
    bell_phi_plus = (qubit_00 + qubit_11) / np.sqrt(2)
    return bell_phi_plus

print("Bell State Vector:", generate_bell_state())
\`\`\`

- [x] إعداد صيغة المعادلات الرياضيات OMML
- [x] التحقق من الجداول وتنسيق العناوين
- [ ] المراجعة النهائية والتصدير لملف Word
`,
  },
  {
    id: 'saudi_vat',
    titleEn: 'Saudi VAT & Financial Compliance Report',
    titleAr: 'تقرير الإقرار الضريبي للضريبة المضافة (ZATCA)',
    markdown: `# تقرير الإقرار الضريبي وضريبة القيمة المضافة (ZATCA)

**اسم الشركة:** شركة مداد التقنية للحلول الرقمية  
**الرقم الضريبي (VAT ID):** \`310123456700003\`  
**الفصل الضريبي:** الربع الأول 2026  

---

## 1. ملخص الإقرارات والمبيعات

يوضح الجدول التالي تفاصيل المبيعات الخاضعة للنسبة الأساسية (15%) والمبيعات المعفاة والصافية:

| بند الإقرار | المبلغ الخاضع (SAR) | ضريبة القيمة المضافة 15% | الصافي الاجمالي |
| :--- | :---: | :---: | ---: |
| المبيعات الخاضعة للنسبة الأساسية (15%) | 120,000.00 | 18,000.00 | 138,000.00 |
| المشتريات الخاضعة للنسبة الأساسية (15%) | 40,000.00 | 6,000.00 | 46,000.00 |
| **صافي الضريبة المستحقة للدفع** | **80,000.00** | **12,000.00** | **92,000.00** |

---

## 2. المعادلة الحسابية للضريبة الصافية

$$\\text{Net VAT Payable} = \\sum \\text{Output VAT} - \\sum \\text{Input VAT}$$

$$\\text{Net VAT} = 18,000.00 - 6,000.00 = 12,000.00 \\text{ SAR}$$

> [!NOTE]
> يجب سداد الإقرار الضريبي قبل نهاية الشهر التالي للفصل الضريبي لضمان الامتثال لتعليمات هيئة الزكاة والضريبة والجمارك.
`,
  },
  {
    id: 'neural_network',
    titleEn: 'Neural Network Architecture & AI Specification',
    titleAr: 'مواصفات شبكة التعلم العميق والذكاء الاصطناعي',
    markdown: `# مواصفات شبكة التعلم العميق Transformer Model Architecture

## 1. بنية النموذج والمكونات

تعتمد البنية على آلية الانتباه الذاتي المترابط (Multi-Head Self-Attention):

$$\\text{Attention}(Q, K, V) = \\text{softmax}\\left(\\frac{QK^T}{\\sqrt{d_k}}\\right)V$$

---

## 2. معلمات الطبقات والتأخير

| الطبقة (Layer) | الأبعاد (Dimensions) | زمن المعالجة (ms) |
| :--- | :---: | ---: |
| Embedding Layer | $512 \\times 768$ | 1.2 ms |
| Multi-Head Attention | $8 \\text{ heads}, d_k=64$ | 4.5 ms |
| Feed Forward Layer | $2048 \\text{ hidden units}$ | 3.1 ms |

---

## 3. كود تنفيذ دالة الخسارة (Loss Function)

\`\`\`python
import torch
import torch.nn as nn

class CrossEntropyLossWithSmoothing(nn.Module):
    def __init__(self, label_smoothing=0.1):
        super().__init__()
        self.confidence = 1.0 - label_smoothing

    def forward(self, x, target):
        logprobs = torch.log_softmax(x, dim=-1)
        nll_loss = -logprobs.gather(dim=-1, index=target.unsqueeze(-1)).squeeze(-1)
        return nll_loss.mean()
\`\`\`
`,
  },
];

