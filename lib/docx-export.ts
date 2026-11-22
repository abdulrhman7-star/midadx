import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  Table,
  TableRow,
  TableCell,
  HeadingLevel,
  BorderStyle,
  WidthType,
  ShadingType,
  AlignmentType,
  Math as DocxMath,
  PageOrientation,
  ExternalHyperlink,
  ImageRun,
  PageBreak,
  UnderlineType,
  ParagraphChild,
} from 'docx';
import { parseLatexToDocxMathComponents, renderLatexHtml } from './latex-to-omml';

export type TextAlignment = 'left' | 'center' | 'right' | 'justify';

export interface DocxExportOptions {
  orientation?: 'portrait' | 'landscape';
  paperSize?: 'a4' | 'letter' | 'legal';
  margins?: 'normal' | 'narrow' | 'wide';
  fontFamily?: string;
  fontSize?: number;
  lineSpacing?: string;
  headerText?: string;
  watermark?: string;
  direction?: 'rtl' | 'ltr';
}

export interface InlineStyle {
  bold?: boolean;
  italics?: boolean;
  underline?: boolean;
  strike?: boolean;
  subScript?: boolean;
  superScript?: boolean;
  code?: boolean;
  color?: string; // Normalized 6-char hex without '#'
  highlight?: string; // Normalized 6-char hex without '#'
}

export type InlineSegment =
  | { kind: 'text'; text: string; style: InlineStyle }
  | { kind: 'math'; formula: string; style: InlineStyle }
  | { kind: 'link'; text: string; url: string; style: InlineStyle }
  | { kind: 'image'; alt: string; src: string };

export interface TableCellModel {
  segments: InlineSegment[];
}

export interface TableRowModel {
  isHeader: boolean;
  cells: TableCellModel[];
}

export type ExportBlock =
  | {
      type: 'heading';
      level: 1 | 2 | 3 | 4 | 5 | 6;
      alignment: TextAlignment;
      segments: InlineSegment[];
    }
  | {
      type: 'paragraph';
      alignment: TextAlignment;
      segments: InlineSegment[];
    }
  | {
      type: 'blockquote';
      alignment: TextAlignment;
      calloutType?: 'NOTE' | 'TIP' | 'WARNING' | 'IMPORTANT';
      lines: InlineSegment[][];
    }
  | {
      type: 'bulletListItem';
      level: number;
      alignment: TextAlignment;
      segments: InlineSegment[];
    }
  | {
      type: 'orderedListItem';
      marker: string;
      alignment: TextAlignment;
      segments: InlineSegment[];
    }
  | {
      type: 'taskListItem';
      checked: boolean;
      alignment: TextAlignment;
      segments: InlineSegment[];
    }
  | {
      type: 'codeBlock';
      language: string;
      code: string;
    }
  | {
      type: 'table';
      alignments: TextAlignment[];
      rows: TableRowModel[];
    }
  | {
      type: 'mathBlock';
      formula: string;
    }
  | {
      type: 'imageBlock';
      alt: string;
      src: string;
      alignment: TextAlignment;
    }
  | {
      type: 'horizontalRule';
    }
  | {
      type: 'pageBreak';
    };

export interface ParsedPageConfig {
  orientation: 'portrait' | 'landscape';
  paperSize: 'a4' | 'letter' | 'legal';
  margins: 'normal' | 'narrow' | 'wide';
  marginTwips: number;
  marginMm: number;
  fontFamily: string;
  fontSizePt: number;
  lineSpacingRatio: number;
  lineSpacingTwips: number;
  direction: 'rtl' | 'ltr';
  headerText: string;
  watermark: string;
}

export interface ParsedExportDocument {
  pageConfig: ParsedPageConfig;
  blocks: ExportBlock[];
}

export interface ExportPreviewResult {
  html: string;
  pageConfig: ParsedPageConfig;
  stats: {
    blockCount: number;
    hasMath: boolean;
    hasTables: boolean;
    hasCode: boolean;
    hasImages: boolean;
  };
}

const NAMED_COLORS: Record<string, string> = {
  black: '000000',
  white: 'FFFFFF',
  red: 'DC2626',
  crimson: 'DC143C',
  blue: '2563EB',
  navy: '1E3A8A',
  indigo: '4F46E5',
  purple: '7C3AED',
  violet: '7C3AED',
  green: '16A34A',
  emerald: '059669',
  teal: '0D9488',
  cyan: '0891B2',
  yellow: 'EAB308',
  amber: 'D97706',
  orange: 'EA580C',
  pink: 'DB2777',
  rose: 'E11D48',
  gray: '64748B',
  grey: '64748B',
  slate: '334155',
};

/**
 * Normalizes CSS hex, rgb(), rgba(), and common named colors to 6-char uppercase hex (without '#').
 */
export function normalizeColorHex(rawColor?: string): string | undefined {
  if (!rawColor) return undefined;
  const trimmed = rawColor.trim().toLowerCase();
  if (!trimmed || trimmed === 'transparent' || trimmed === 'inherit' || trimmed === 'initial') {
    return undefined;
  }

  // #RRGGBB
  const hex6 = trimmed.match(/^#([0-9a-f]{6})$/i);
  if (hex6) return hex6[1].toUpperCase();

  // #RGB
  const hex3 = trimmed.match(/^#([0-9a-f]{3})$/i);
  if (hex3) {
    const [r, g, b] = hex3[1].split('');
    return `${r}${r}${g}${g}${b}${b}`.toUpperCase();
  }

  // rgb(r, g, b) or rgba(r, g, b, a)
  const rgbMatch = trimmed.match(
    /^rgba?\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})(?:\s*,\s*([\d.]+))?\s*\)$/i
  );
  if (rgbMatch) {
    if (rgbMatch[4] !== undefined && parseFloat(rgbMatch[4]) === 0) {
      return undefined;
    }
    const clampHex = (n: string) =>
      Math.max(0, Math.min(255, parseInt(n, 10)))
        .toString(16)
        .padStart(2, '0')
        .toUpperCase();
    return `${clampHex(rgbMatch[1])}${clampHex(rgbMatch[2])}${clampHex(rgbMatch[3])}`;
  }

  if (NAMED_COLORS[trimmed]) {
    return NAMED_COLORS[trimmed];
  }

  return undefined;
}

function decodeBasicHtmlEntities(text: string): string {
  return text
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&quot;/gi, '"')
    .replace(/&#0*39;/gi, "'");
}

function escapeHtml(unsafe: string): string {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function extractAttrValue(attrs: string, name: string): string | undefined {
  const dq = attrs.match(new RegExp(`\\b${name}\\s*=\\s*"([^"]*)"`, 'i'));
  if (dq) return dq[1];
  const sq = attrs.match(new RegExp(`\\b${name}\\s*=\\s*'([^']*)'`, 'i'));
  if (sq) return sq[1];
  return undefined;
}

function extractCssStyleProp(styleAttr: string | undefined, prop: string): string | undefined {
  if (!styleAttr) return undefined;
  const match = styleAttr.match(new RegExp(`(?:^|;)\\s*${prop}\\s*:\\s*([^;]+)`, 'i'));
  return match ? match[1].trim() : undefined;
}

function extractBlockAlignment(
  attrs: string | undefined,
  defaultAlignment: TextAlignment
): TextAlignment {
  if (!attrs) return defaultAlignment;
  const styleVal = extractCssStyleProp(extractAttrValue(attrs, 'style'), 'text-align');
  const alignVal = styleVal || extractAttrValue(attrs, 'align') || '';
  const norm = alignVal.trim().toLowerCase();
  if (norm === 'left' || norm === 'center' || norm === 'right' || norm === 'justify') {
    return norm;
  }
  return defaultAlignment;
}

function parseStyleFromSpanOrMark(tag: string, attrs: string, current: InlineStyle): InlineStyle {
  const next: InlineStyle = { ...current };
  const styleAttr = extractAttrValue(attrs, 'style');
  const textColor =
    extractCssStyleProp(styleAttr, 'color') || extractAttrValue(attrs, 'color');
  const bgColor = extractCssStyleProp(styleAttr, 'background-color');
  const fontWeight = extractCssStyleProp(styleAttr, 'font-weight');
  const fontStyle = extractCssStyleProp(styleAttr, 'font-style');
  const textDecoration = extractCssStyleProp(styleAttr, 'text-decoration');

  const normTextColor = normalizeColorHex(textColor);
  if (normTextColor) next.color = normTextColor;

  const normBgColor = normalizeColorHex(bgColor);
  if (normBgColor) {
    next.highlight = normBgColor;
  } else if (tag === 'mark' && !next.highlight) {
    next.highlight = 'FEF08A'; // Classic yellow highlight fallback
  }

  if (fontWeight && (fontWeight === 'bold' || parseInt(fontWeight, 10) >= 600)) {
    next.bold = true;
  }
  if (fontStyle === 'italic') {
    next.italics = true;
  }
  if (textDecoration?.includes('underline')) {
    next.underline = true;
  }
  if (textDecoration?.includes('line-through')) {
    next.strike = true;
  }

  return next;
}

function findMatchingClosingTag(
  source: string,
  startIndex: number,
  tagName: string
): { innerEnd: number; outerEnd: number } | null {
  const tagRegex = new RegExp(`<(\\/)?${tagName}(?:\\s+[^>]*)?>`, 'gi');
  tagRegex.lastIndex = startIndex;
  let depth = 1;
  let tagMatch: RegExpExecArray | null;

  while ((tagMatch = tagRegex.exec(source)) !== null) {
    const fullTag = tagMatch[0];
    const isClosing = Boolean(tagMatch[1]);
    const isSelfClosing = fullTag.endsWith('/>');
    if (isSelfClosing) continue;

    if (isClosing) {
      depth--;
      if (depth === 0) {
        return {
          innerEnd: tagMatch.index,
          outerEnd: tagMatch.index + fullTag.length,
        };
      }
    } else {
      depth++;
    }
  }
  return null;
}

/**
 * Recursively parses inline Markdown & editor HTML formatting into rich InlineSegment tokens.
 * Handles bold, italic, bold+italic, underline, strikethrough, sub/sup, colors, highlights,
 * links, inline code, inline math, and inline images — including nested tags of the same type.
 */
export function parseInlineSegments(
  text: string,
  inherited: InlineStyle = {}
): InlineSegment[] {
  if (!text) return [];

  const segments: InlineSegment[] = [];

  const pushText = (raw: string, style: InlineStyle) => {
    const decoded = decodeBasicHtmlEntities(raw);
    if (!decoded) return;
    segments.push({ kind: 'text', text: decoded, style });
  };

  // Ordered earliest-match scan; HTML formatting tags match opening tag only and locate balanced closing tag.
  const tokenPattern =
    /!\[([^\]]*)\]\(([^)]+)\)|<img\s+([^>]*?)\/?>|\[([^\]]+)\]\(([^)]+)\)|<a\s+([^>]*)>([\s\S]*?)<\/a>|\$([^$\n]+)\$|\\\(([^\n]+?)\\\)|`([^`]+)`|<code(?:\s+[^>]*)?>([\s\S]*?)<\/code>|<(span|mark|font|strong|b|em|i|u|s|del|strike|sub|sup)(\s+[^>]*)?>|\*\*\*([^\n*]+?)\*\*\*|\*\*([^\n*]+?)\*\*|__([^\n_]+?)__|~~([^\n~]+?)~~|\*([^\n*]+?)\*|_([^_\s][^_\n]*?)_/i;

  let remaining = text;
  while (remaining.length > 0) {
    const match = tokenPattern.exec(remaining);
    if (!match) {
      pushText(remaining, inherited);
      break;
    }

    if (match.index > 0) {
      pushText(remaining.slice(0, match.index), inherited);
    }

    const full = match[0];
    let advanceBy = match.index + full.length;

    if (match[1] !== undefined || match[2] !== undefined) {
      // ![alt](src)
      segments.push({
        kind: 'image',
        alt: decodeBasicHtmlEntities(match[1] || 'Image'),
        src: (match[2] || '').trim(),
      });
    } else if (match[3] !== undefined) {
      // <img ...>
      const attrs = match[3];
      const src = extractAttrValue(attrs, 'src') || '';
      const alt = extractAttrValue(attrs, 'alt') || 'Image';
      if (src) {
        segments.push({ kind: 'image', alt: decodeBasicHtmlEntities(alt), src });
      }
    } else if (match[4] !== undefined && match[5] !== undefined) {
      // [label](url)
      segments.push({
        kind: 'link',
        text: decodeBasicHtmlEntities(match[4]),
        url: match[5].trim(),
        style: { ...inherited, color: inherited.color || '2563EB', underline: true },
      });
    } else if (match[6] !== undefined && match[7] !== undefined) {
      // <a href="...">label</a>
      const href = extractAttrValue(match[6], 'href') || '#';
      const innerPlain = decodeBasicHtmlEntities(match[7].replace(/<[^>]+>/g, ''));
      segments.push({
        kind: 'link',
        text: innerPlain || href,
        url: href,
        style: { ...inherited, color: inherited.color || '2563EB', underline: true },
      });
    } else if (match[8] !== undefined || match[9] !== undefined) {
      // $...$ or \(...\)
      const formula = (match[8] ?? match[9] ?? '').trim();
      segments.push({ kind: 'math', formula, style: inherited });
    } else if (match[10] !== undefined || match[11] !== undefined) {
      // `code` or <code>...</code>
      const codeText = decodeBasicHtmlEntities(match[10] ?? match[11] ?? '');
      segments.push({
        kind: 'text',
        text: codeText,
        style: {
          ...inherited,
          code: true,
          color: inherited.color || 'DC2626',
          highlight: inherited.highlight || 'F1F5F9',
        },
      });
    } else if (match[12] !== undefined) {
      // Balanced HTML inline formatting tag
      const tag = match[12].toLowerCase();
      const attrs = match[13] || '';
      const afterOpenIdx = match.index + full.length;
      const closing = findMatchingClosingTag(remaining, afterOpenIdx, tag);

      if (closing) {
        const inner = remaining.slice(afterOpenIdx, closing.innerEnd);
        let nextStyle: InlineStyle = { ...inherited };

        if (tag === 'span' || tag === 'mark' || tag === 'font') {
          nextStyle = parseStyleFromSpanOrMark(tag, attrs, nextStyle);
        } else if (tag === 'strong' || tag === 'b') {
          nextStyle.bold = true;
        } else if (tag === 'em' || tag === 'i') {
          nextStyle.italics = true;
        } else if (tag === 'u') {
          nextStyle.underline = true;
        } else if (tag === 's' || tag === 'del' || tag === 'strike') {
          nextStyle.strike = true;
        } else if (tag === 'sub') {
          nextStyle.subScript = true;
        } else if (tag === 'sup') {
          nextStyle.superScript = true;
        }

        segments.push(...parseInlineSegments(inner, nextStyle));
        advanceBy = closing.outerEnd;
      } else {
        // Unclosed opening tag: skip tag markup and keep scanning remainder safely
        advanceBy = afterOpenIdx;
      }
    } else if (match[14] !== undefined) {
      // ***bold+italic***
      segments.push(...parseInlineSegments(match[14], { ...inherited, bold: true, italics: true }));
    } else if (match[15] !== undefined) {
      // **bold**
      segments.push(...parseInlineSegments(match[15], { ...inherited, bold: true }));
    } else if (match[16] !== undefined) {
      // __bold__
      segments.push(...parseInlineSegments(match[16], { ...inherited, bold: true }));
    } else if (match[17] !== undefined) {
      // ~~strike~~
      segments.push(...parseInlineSegments(match[17], { ...inherited, strike: true }));
    } else if (match[18] !== undefined) {
      // *italic*
      segments.push(...parseInlineSegments(match[18], { ...inherited, italics: true }));
    } else if (match[19] !== undefined) {
      // _italic_
      segments.push(...parseInlineSegments(match[19], { ...inherited, italics: true }));
    } else {
      pushText(full, inherited);
    }

    remaining = remaining.slice(advanceBy);
  }

  return segments;
}

/**
 * Shared parser that converts raw Markdown + editor HTML + formatting options
 * into a single canonical document model used by both DOCX export and Export Preview.
 */
export function parseDocumentForExport(
  markdown: string,
  options?: DocxExportOptions
): ParsedExportDocument {
  const direction: 'rtl' | 'ltr' = options?.direction === 'rtl' ? 'rtl' : 'ltr';
  const defaultAlignment: TextAlignment = direction === 'rtl' ? 'right' : 'left';
  const margins = options?.margins || 'normal';
  const marginTwips = margins === 'narrow' ? 720 : margins === 'wide' ? 2160 : 1440;
  const marginMm = margins === 'narrow' ? 12.7 : margins === 'wide' ? 38.1 : 25.4;
  const lineRatio = parseFloat(options?.lineSpacing || '1.15') || 1.15;

  const pageConfig: ParsedPageConfig = {
    orientation: options?.orientation === 'landscape' ? 'landscape' : 'portrait',
    paperSize:
      options?.paperSize === 'letter'
        ? 'letter'
        : options?.paperSize === 'legal'
        ? 'legal'
        : 'a4',
    margins,
    marginTwips,
    marginMm,
    fontFamily: options?.fontFamily || 'Segoe UI',
    fontSizePt: options?.fontSize || 11,
    lineSpacingRatio: lineRatio,
    lineSpacingTwips: Math.round(lineRatio * 240),
    direction,
    headerText: options?.headerText || '',
    watermark: options?.watermark || '',
  };

  const blocks: ExportBlock[] = [];
  const lines = (markdown || '').split('\n');

  let inCodeBlock = false;
  let codeBlockLines: string[] = [];
  let codeLang = '';

  let inTable = false;
  let tableRowsData: string[][] = [];
  let tableAlignments: TextAlignment[] = [];

  let inBlockquote = false;
  let blockquoteLines: string[] = [];
  let calloutType: 'NOTE' | 'TIP' | 'WARNING' | 'IMPORTANT' | undefined;

  const flushCodeBlock = () => {
    if (inCodeBlock) {
      blocks.push({
        type: 'codeBlock',
        language: codeLang || 'code',
        code: codeBlockLines.join('\n'),
      });
      codeBlockLines = [];
      codeLang = '';
      inCodeBlock = false;
    }
  };

  const flushBlockquote = () => {
    if (inBlockquote) {
      blocks.push({
        type: 'blockquote',
        alignment: defaultAlignment,
        calloutType,
        lines: blockquoteLines.map(l => parseInlineSegments(l)),
      });
      blockquoteLines = [];
      calloutType = undefined;
      inBlockquote = false;
    }
  };

  const flushTable = () => {
    if (inTable && tableRowsData.length > 0) {
      const maxCols = Math.max(...tableRowsData.map(r => r.length));
      const resolvedAlignments: TextAlignment[] = Array.from({ length: maxCols }, (_, idx) => {
        return tableAlignments[idx] || defaultAlignment;
      });

      const rows: TableRowModel[] = tableRowsData.map((rowCells, rowIdx) => ({
        isHeader: rowIdx === 0,
        cells: Array.from({ length: maxCols }, (_, colIdx) => ({
          segments: parseInlineSegments((rowCells[colIdx] || '').trim()),
        })),
      }));

      blocks.push({
        type: 'table',
        alignments: resolvedAlignments,
        rows,
      });

      tableRowsData = [];
      tableAlignments = [];
      inTable = false;
    }
  };

  const isTableRow = (line: string) => {
    const trimmed = line.trim();
    return trimmed.startsWith('|') && trimmed.endsWith('|') && trimmed.length >= 2;
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

    // 1. Code block fence
    if (trimmed.startsWith('```')) {
      flushTable();
      flushBlockquote();
      if (!inCodeBlock) {
        inCodeBlock = true;
        codeLang = trimmed.slice(3).trim();
        codeBlockLines = [];
      } else {
        flushCodeBlock();
      }
      continue;
    }

    if (inCodeBlock) {
      codeBlockLines.push(line);
      continue;
    }

    // 2. Table row
    if (isTableRow(line)) {
      flushBlockquote();
      if (isTableSeparator(line)) {
        const cols = trimmed.slice(1, -1).split('|');
        tableAlignments = cols.map(c => {
          const t = c.trim();
          if (t.startsWith(':') && t.endsWith(':')) return 'center';
          if (t.endsWith(':')) return 'right';
          if (t.startsWith(':')) return 'left';
          return defaultAlignment;
        });
        continue;
      }
      inTable = true;
      const cells = trimmed.slice(1, -1).split('|').map(c => c.trim());
      tableRowsData.push(cells);
      continue;
    } else {
      flushTable();
    }

    // 3. Explicit Page Break (from WordRibbon Insert -> Page Break)
    if (
      /^<div[^>]*page-break-after\s*:\s*always[^>]*>[\s\S]*<\/div>$/i.test(trimmed) ||
      trimmed === '\\pagebreak'
    ) {
      flushBlockquote();
      blocks.push({ type: 'pageBreak' });
      continue;
    }

    // 4. Display Math $$...$$ single line or multiline
    if (trimmed.startsWith('$$') && trimmed.endsWith('$$') && trimmed.length > 4) {
      flushBlockquote();
      blocks.push({ type: 'mathBlock', formula: trimmed.slice(2, -2).trim() });
      continue;
    }

    if (trimmed === '$$' || trimmed === '\\[') {
      flushBlockquote();
      const mathLines: string[] = [];
      i++;
      while (i < lines.length && lines[i].trim() !== '$$' && lines[i].trim() !== '\\]') {
        mathLines.push(lines[i]);
        i++;
      }
      blocks.push({ type: 'mathBlock', formula: mathLines.join(' ').trim() });
      continue;
    }

    // 5. Blockquotes & Callouts
    if (trimmed.startsWith('>')) {
      const quoteContent = trimmed.replace(/^>\s?/, '');
      const calloutMatch = quoteContent.match(/^\[!(NOTE|TIP|WARNING|IMPORTANT)\]$/i);
      if (calloutMatch && !inBlockquote) {
        inBlockquote = true;
        calloutType = calloutMatch[1].toUpperCase() as 'NOTE' | 'TIP' | 'WARNING' | 'IMPORTANT';
        continue;
      }
      inBlockquote = true;
      blockquoteLines.push(quoteContent);
      continue;
    } else {
      flushBlockquote();
    }

    // 6. Empty line
    if (!trimmed) {
      continue;
    }

    // 7. Horizontal rule
    if (/^(---+|\*\*\*+|___+)$/.test(trimmed) || /^<hr\b[^>]*\/?>$/i.test(trimmed)) {
      blocks.push({ type: 'horizontalRule' });
      continue;
    }

    // 8. Standalone Image block ![alt](src) or <img ...>
    const imgMdMatch = trimmed.match(/^!\[([^\]]*)\]\(([^)]+)\)$/);
    if (imgMdMatch) {
      blocks.push({
        type: 'imageBlock',
        alt: decodeBasicHtmlEntities(imgMdMatch[1] || 'Image'),
        src: imgMdMatch[2].trim(),
        alignment: 'center',
      });
      continue;
    }

    const imgHtmlMatch = trimmed.match(/^<img\s+([^>]*?)\/?>$/i);
    if (imgHtmlMatch) {
      const attrs = imgHtmlMatch[1];
      const src = extractAttrValue(attrs, 'src') || '';
      const alt = extractAttrValue(attrs, 'alt') || 'Image';
      if (src) {
        blocks.push({
          type: 'imageBlock',
          alt: decodeBasicHtmlEntities(alt),
          src,
          alignment: extractBlockAlignment(attrs, 'center'),
        });
        continue;
      }
    }

    // 9. Aligned HTML Headings / Paragraphs / Blockquotes
    const htmlHeadingMatch = trimmed.match(/^<h([1-6])(\s+[^>]*)?>([\s\S]*)<\/h\1>$/i);
    if (htmlHeadingMatch) {
      const level = Number(htmlHeadingMatch[1]) as 1 | 2 | 3 | 4 | 5 | 6;
      const alignment = extractBlockAlignment(htmlHeadingMatch[2], defaultAlignment);
      blocks.push({
        type: 'heading',
        level,
        alignment,
        segments: parseInlineSegments(htmlHeadingMatch[3]),
      });
      continue;
    }

    const htmlQuoteMatch = trimmed.match(/^<blockquote(\s+[^>]*)?>([\s\S]*)<\/blockquote>$/i);
    if (htmlQuoteMatch) {
      const alignment = extractBlockAlignment(htmlQuoteMatch[1], defaultAlignment);
      const quoteLines = htmlQuoteMatch[2].split(/<br\s*\/?>|\n/i).filter(Boolean);
      blocks.push({
        type: 'blockquote',
        alignment,
        lines: quoteLines.map(l => parseInlineSegments(l)),
      });
      continue;
    }

    const htmlParaMatch = trimmed.match(/^<(p|div)(\s+[^>]*)?>([\s\S]*)<\/\1>$/i);
    if (htmlParaMatch) {
      const alignment = extractBlockAlignment(htmlParaMatch[2], defaultAlignment);
      blocks.push({
        type: 'paragraph',
        alignment,
        segments: parseInlineSegments(htmlParaMatch[3]),
      });
      continue;
    }

    // 10. Markdown Headings # .. ######
    const headingMatch = trimmed.match(/^(#{1,6})\s+(.+)$/);
    if (headingMatch) {
      const level = headingMatch[1].length as 1 | 2 | 3 | 4 | 5 | 6;
      blocks.push({
        type: 'heading',
        level,
        alignment: defaultAlignment,
        segments: parseInlineSegments(headingMatch[2]),
      });
      continue;
    }

    // 11. Task Lists - [x] / - [ ]
    const taskMatch = line.match(/^\s*[-*+]\s+\[([ xX])\]\s+(.*)$/);
    if (taskMatch) {
      blocks.push({
        type: 'taskListItem',
        checked: taskMatch[1].toLowerCase() === 'x',
        alignment: defaultAlignment,
        segments: parseInlineSegments(taskMatch[2]),
      });
      continue;
    }

    // 12. Bullet Lists (supports indentation level)
    const bulletMatch = line.match(/^(\s*)[-*+]\s+(.*)$/);
    if (bulletMatch) {
      const level = Math.min(3, Math.floor((bulletMatch[1] || '').length / 2));
      blocks.push({
        type: 'bulletListItem',
        level,
        alignment: defaultAlignment,
        segments: parseInlineSegments(bulletMatch[2]),
      });
      continue;
    }

    // 13. Numbered Lists
    const numMatch = line.match(/^\s*(\d+\.)\s+(.*)$/);
    if (numMatch) {
      blocks.push({
        type: 'orderedListItem',
        marker: `${numMatch[1]} `,
        alignment: defaultAlignment,
        segments: parseInlineSegments(numMatch[2]),
      });
      continue;
    }

    // 14. Standard Paragraph
    blocks.push({
      type: 'paragraph',
      alignment: defaultAlignment,
      segments: parseInlineSegments(line),
    });
  }

  flushCodeBlock();
  flushBlockquote();
  flushTable();

  return { pageConfig, blocks };
}

function toDocxAlignment(align: TextAlignment): (typeof AlignmentType)[keyof typeof AlignmentType] {
  switch (align) {
    case 'center':
      return AlignmentType.CENTER;
    case 'right':
      return AlignmentType.RIGHT;
    case 'justify':
      return AlignmentType.JUSTIFIED;
    default:
      return AlignmentType.LEFT;
  }
}

function parseDataUriImage(
  src: string
): { type: 'png' | 'jpg' | 'gif' | 'bmp'; data: string } | null {
  const match = src.match(/^data:image\/(png|jpeg|jpg|gif|bmp);base64,([A-Za-z0-9+/=]+)$/i);
  if (!match) return null;
  const rawExt = match[1].toLowerCase();
  const type = rawExt === 'jpeg' ? 'jpg' : (rawExt as 'png' | 'jpg' | 'gif' | 'bmp');
  return { type, data: match[2] };
}

function buildDocxChildrenFromSegments(
  segments: InlineSegment[],
  overrideStyle?: Partial<InlineStyle>
): ParagraphChild[] {
  const result: ParagraphChild[] = [];

  for (const seg of segments) {
    if (seg.kind === 'math') {
      try {
        const mathChildren = parseLatexToDocxMathComponents(seg.formula);
        result.push(new DocxMath({ children: mathChildren }));
      } catch {
        result.push(new TextRun({ text: seg.formula, italics: true }));
      }
      continue;
    }

    if (seg.kind === 'image') {
      const parsedImg = parseDataUriImage(seg.src);
      if (parsedImg) {
        result.push(
          new ImageRun({
            type: parsedImg.type,
            data: parsedImg.data,
            transformation: { width: 420, height: 260 },
            altText: {
              name: seg.alt,
              title: seg.alt,
              description: seg.alt,
            },
          })
        );
      } else {
        result.push(
          new TextRun({
            text: `[Image: ${seg.alt}]`,
            italics: true,
            color: '64748B',
          })
        );
      }
      continue;
    }

    if (seg.kind === 'link') {
      const merged: InlineStyle = { ...seg.style, ...overrideStyle };
      const run = new TextRun({
        text: seg.text,
        bold: merged.bold,
        italics: merged.italics,
        color: merged.color || '2563EB',
        underline: { type: UnderlineType.SINGLE },
        strike: merged.strike,
        subScript: merged.subScript,
        superScript: merged.superScript,
        shading: merged.highlight
          ? { fill: merged.highlight, type: ShadingType.CLEAR }
          : undefined,
      });

      if (/^(https?:\/\/|mailto:)/i.test(seg.url)) {
        result.push(
          new ExternalHyperlink({
            link: seg.url,
            children: [run],
          })
        );
      } else {
        result.push(run);
      }
      continue;
    }

    // Text segment
    const merged: InlineStyle = { ...seg.style, ...overrideStyle };
    result.push(
      new TextRun({
        text: seg.text,
        bold: merged.bold,
        italics: merged.italics,
        underline: merged.underline ? { type: UnderlineType.SINGLE } : undefined,
        strike: merged.strike,
        subScript: merged.subScript,
        superScript: merged.superScript,
        font: merged.code ? 'Consolas' : undefined,
        size: merged.code ? 19 : undefined,
        color: merged.color,
        shading: merged.highlight
          ? { fill: merged.highlight, type: ShadingType.CLEAR }
          : undefined,
      })
    );
  }

  return result;
}

/**
 * Parses inline markdown/HTML into docx TextRun, ExternalHyperlink, ImageRun, and Math components.
 */
export function parseInlineDocx(text: string): ParagraphChild[] {
  return buildDocxChildrenFromSegments(parseInlineSegments(text));
}

/**
 * Generates a full Word Document from the canonical parseDocumentForExport AST.
 */
export function generateDocxDocument(
  markdown: string,
  options?: DocxExportOptions
): Document {
  const { pageConfig, blocks } = parseDocumentForExport(markdown, options);
  const children: (Paragraph | Table)[] = [];

  const createParagraph = (pOptions: any): Paragraph => {
    if (pageConfig.direction === 'rtl') {
      pOptions.bidirectional = true;
    }
    return new Paragraph(pOptions);
  };

  const headingLevels: Record<number, (typeof HeadingLevel)[keyof typeof HeadingLevel]> = {
    1: HeadingLevel.HEADING_1,
    2: HeadingLevel.HEADING_2,
    3: HeadingLevel.HEADING_3,
    4: HeadingLevel.HEADING_4,
    5: HeadingLevel.HEADING_5,
    6: HeadingLevel.HEADING_6,
  };

  const headingSpacing: Record<number, { before: number; after: number }> = {
    1: { before: 360, after: 180 },
    2: { before: 280, after: 140 },
    3: { before: 220, after: 100 },
    4: { before: 180, after: 80 },
    5: { before: 140, after: 60 },
    6: { before: 120, after: 60 },
  };

  for (const block of blocks) {
    switch (block.type) {
      case 'heading': {
        children.push(
          createParagraph({
            children: buildDocxChildrenFromSegments(block.segments, { bold: true }),
            heading: headingLevels[block.level] || HeadingLevel.HEADING_1,
            alignment: toDocxAlignment(block.alignment),
            spacing: headingSpacing[block.level] || { before: 240, after: 120 },
          })
        );
        break;
      }

      case 'paragraph': {
        children.push(
          createParagraph({
            children: buildDocxChildrenFromSegments(block.segments),
            alignment: toDocxAlignment(block.alignment),
            spacing: {
              before: 100,
              after: 100,
              line: pageConfig.lineSpacingTwips,
            },
          })
        );
        break;
      }

      case 'blockquote': {
        const calloutColors: Record<string, { border: string; fill: string }> = {
          NOTE: { border: '4F46E5', fill: 'EEF2FF' },
          TIP: { border: '059669', fill: 'ECFDF5' },
          WARNING: { border: 'D97706', fill: 'FFFBEB' },
          IMPORTANT: { border: 'DC2626', fill: 'FEF2F2' },
        };
        const palette =
          (block.calloutType && calloutColors[block.calloutType]) || {
            border: '6366F1',
            fill: 'F8FAFC',
          };

        const quoteRuns: ParagraphChild[] = [];
        block.lines.forEach((lineSegs, idx) => {
          if (idx > 0) {
            quoteRuns.push(new TextRun({ text: '', break: 1 }));
          }
          quoteRuns.push(...buildDocxChildrenFromSegments(lineSegs));
        });

        children.push(
          createParagraph({
            children: quoteRuns,
            alignment: toDocxAlignment(block.alignment),
            border:
              pageConfig.direction === 'rtl'
                ? { right: { style: BorderStyle.SINGLE, size: 24, color: palette.border } }
                : { left: { style: BorderStyle.SINGLE, size: 24, color: palette.border } },
            indent:
              pageConfig.direction === 'rtl' ? { right: 360 } : { left: 360 },
            shading: { fill: palette.fill, type: ShadingType.CLEAR },
            spacing: { before: 140, after: 140, line: pageConfig.lineSpacingTwips },
          })
        );
        break;
      }

      case 'bulletListItem': {
        children.push(
          createParagraph({
            children: buildDocxChildrenFromSegments(block.segments),
            bullet: { level: block.level },
            alignment: toDocxAlignment(block.alignment),
            spacing: { before: 60, after: 60, line: pageConfig.lineSpacingTwips },
          })
        );
        break;
      }

      case 'taskListItem': {
        const prefix = block.checked ? '☑ ' : '☐ ';
        children.push(
          createParagraph({
            children: [
              new TextRun({
                text: prefix,
                bold: true,
                color: block.checked ? '059669' : '64748B',
              }),
              ...buildDocxChildrenFromSegments(
                block.segments,
                block.checked ? { strike: true, color: '64748B' } : undefined
              ),
            ],
            alignment: toDocxAlignment(block.alignment),
            indent:
              pageConfig.direction === 'rtl' ? { right: 240 } : { left: 240 },
            spacing: { before: 60, after: 60, line: pageConfig.lineSpacingTwips },
          })
        );
        break;
      }

      case 'orderedListItem': {
        children.push(
          createParagraph({
            children: [
              new TextRun({ text: block.marker, bold: true }),
              ...buildDocxChildrenFromSegments(block.segments),
            ],
            alignment: toDocxAlignment(block.alignment),
            indent:
              pageConfig.direction === 'rtl' ? { right: 360 } : { left: 360 },
            spacing: { before: 60, after: 60, line: pageConfig.lineSpacingTwips },
          })
        );
        break;
      }

      case 'codeBlock': {
        const codeLines = block.code.split('\n');
        const codeRuns: TextRun[] = [];
        if (block.language && block.language !== 'code') {
          codeRuns.push(
            new TextRun({
              text: `${block.language.toUpperCase()}`,
              font: 'Consolas',
              size: 16,
              bold: true,
              color: '64748B',
            })
          );
          codeRuns.push(new TextRun({ text: '', break: 1 }));
        }
        codeLines.forEach((lineText, idx) => {
          if (idx > 0) {
            codeRuns.push(new TextRun({ text: '', break: 1 }));
          }
          codeRuns.push(
            new TextRun({
              text: lineText || ' ',
              font: 'Consolas',
              size: 19,
              color: '1E293B',
            })
          );
        });

        children.push(
          new Paragraph({
            children: codeRuns,
            alignment: AlignmentType.LEFT,
            shading: { fill: 'F1F5F9', type: ShadingType.CLEAR },
            border: {
              left: { style: BorderStyle.SINGLE, size: 12, color: '6366F1' },
              top: { style: BorderStyle.SINGLE, size: 4, color: 'E2E8F0' },
              right: { style: BorderStyle.SINGLE, size: 4, color: 'E2E8F0' },
              bottom: { style: BorderStyle.SINGLE, size: 4, color: 'E2E8F0' },
            },
            spacing: { before: 180, after: 180, line: 260 },
            indent: { left: 240, right: 240 },
          })
        );
        break;
      }

      case 'table': {
        const rows: TableRow[] = block.rows.map((rowModel, rowIdx) => {
          const cells: TableCell[] = rowModel.cells.map((cell, colIdx) => {
            const colAlign = block.alignments[colIdx] || (pageConfig.direction === 'rtl' ? 'right' : 'left');
            const cellRuns = buildDocxChildrenFromSegments(
              cell.segments,
              rowModel.isHeader ? { bold: true } : undefined
            );
            return new TableCell({
              children: [
                createParagraph({
                  children: cellRuns.length > 0 ? cellRuns : [new TextRun({ text: '' })],
                  alignment: rowModel.isHeader
                    ? toDocxAlignment(colAlign === 'left' && pageConfig.direction === 'ltr' ? 'center' : colAlign)
                    : toDocxAlignment(colAlign),
                  spacing: { before: 80, after: 80 },
                }),
              ],
              shading: rowModel.isHeader
                ? { fill: 'F1F5F9', type: ShadingType.CLEAR }
                : rowIdx % 2 === 0
                ? { fill: 'F8FAFC', type: ShadingType.CLEAR }
                : undefined,
              borders: {
                top: { style: BorderStyle.SINGLE, size: 4, color: 'CBD5E1' },
                bottom: {
                  style: BorderStyle.SINGLE,
                  size: rowModel.isHeader ? 8 : 4,
                  color: rowModel.isHeader ? '64748B' : 'CBD5E1',
                },
                left: { style: BorderStyle.SINGLE, size: 4, color: 'CBD5E1' },
                right: { style: BorderStyle.SINGLE, size: 4, color: 'CBD5E1' },
              },
              margins: { top: 120, bottom: 120, left: 140, right: 140 },
            });
          });

          return new TableRow({
            children: cells,
            tableHeader: rowModel.isHeader,
          });
        });

        children.push(
          new Table({
            rows,
            visuallyRightToLeft: pageConfig.direction === 'rtl',
            width: { size: 100, type: WidthType.PERCENTAGE },
          })
        );
        children.push(createParagraph({ spacing: { after: 160 } }));
        break;
      }

      case 'mathBlock': {
        try {
          const mathChildren = parseLatexToDocxMathComponents(block.formula);
          children.push(
            createParagraph({
              children: [new DocxMath({ children: mathChildren })],
              alignment: AlignmentType.CENTER,
              spacing: { before: 180, after: 180 },
            })
          );
        } catch {
          children.push(
            createParagraph({
              children: [new TextRun({ text: block.formula, italics: true })],
              alignment: AlignmentType.CENTER,
            })
          );
        }
        break;
      }

      case 'imageBlock': {
        const parsedImg = parseDataUriImage(block.src);
        if (parsedImg) {
          children.push(
            createParagraph({
              children: [
                new ImageRun({
                  type: parsedImg.type,
                  data: parsedImg.data,
                  transformation: { width: 460, height: 290 },
                  altText: {
                    name: block.alt,
                    title: block.alt,
                    description: block.alt,
                  },
                }),
              ],
              alignment: toDocxAlignment(block.alignment),
              spacing: { before: 140, after: 140 },
            })
          );
        } else {
          children.push(
            createParagraph({
              children: [
                new TextRun({
                  text: `[${block.alt}] (${block.src})`,
                  italics: true,
                  color: '475569',
                }),
              ],
              alignment: toDocxAlignment(block.alignment),
              spacing: { before: 120, after: 120 },
            })
          );
        }
        break;
      }

      case 'horizontalRule': {
        children.push(
          createParagraph({
            border: {
              bottom: { style: BorderStyle.SINGLE, size: 6, color: 'CBD5E1' },
            },
            spacing: { before: 120, after: 120 },
          })
        );
        break;
      }

      case 'pageBreak': {
        children.push(
          new Paragraph({
            children: [new PageBreak()],
          })
        );
        break;
      }
    }
  }

  const isLandscape = pageConfig.orientation === 'landscape';
  const portraitWidth =
    pageConfig.paperSize === 'letter' || pageConfig.paperSize === 'legal' ? 12240 : 11906;
  const portraitHeight =
    pageConfig.paperSize === 'legal'
      ? 20160
      : pageConfig.paperSize === 'letter'
      ? 15840
      : 16838;

  return new Document({
    styles: {
      default: {
        document: {
          run: {
            font: pageConfig.fontFamily,
            size: pageConfig.fontSizePt * 2,
            color: '1E293B',
          },
          paragraph: {
            spacing: { line: pageConfig.lineSpacingTwips },
          },
        },
      },
    },
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: pageConfig.marginTwips,
              right: pageConfig.marginTwips,
              bottom: pageConfig.marginTwips,
              left: pageConfig.marginTwips,
            },
            size: isLandscape
              ? {
                  orientation: PageOrientation.LANDSCAPE,
                  width: portraitHeight,
                  height: portraitWidth,
                }
              : {
                  orientation: PageOrientation.PORTRAIT,
                  width: portraitWidth,
                  height: portraitHeight,
                },
          },
        },
        children,
      },
    ],
  });
}

function renderInlineSegmentsToPreviewHtml(segments: InlineSegment[]): string {
  return segments
    .map(seg => {
      if (seg.kind === 'math') {
        try {
          return `<span class="inline-block align-middle px-1">${renderLatexHtml(
            seg.formula,
            false
          )}</span>`;
        } catch {
          return `<em class="italic">${escapeHtml(seg.formula)}</em>`;
        }
      }

      if (seg.kind === 'image') {
        return `<img src="${escapeHtml(seg.src)}" alt="${escapeHtml(
          seg.alt
        )}" class="max-w-full h-auto rounded border border-slate-200 my-2 inline-block align-middle" />`;
      }

      const st = seg.style;
      const cssParts: string[] = [];
      if (st.bold) cssParts.push('font-weight: 700');
      if (st.italics) cssParts.push('font-style: italic');
      if (st.underline && st.strike) {
        cssParts.push('text-decoration: underline line-through');
      } else if (st.underline) {
        cssParts.push('text-decoration: underline');
      } else if (st.strike) {
        cssParts.push('text-decoration: line-through');
      }
      if (st.color) cssParts.push(`color: #${st.color}`);
      if (st.highlight) {
        cssParts.push(`background-color: #${st.highlight}; padding: 0 2px; border-radius: 2px`);
      }
      if (st.code) {
        cssParts.push(
          "font-family: Consolas, ui-monospace, monospace; font-size: 0.88em; padding: 1px 4px; border-radius: 3px"
        );
      }

      const styleAttr = cssParts.length > 0 ? ` style="${cssParts.join('; ')}"` : '';

      if (seg.kind === 'link') {
        return `<a href="${escapeHtml(
          seg.url
        )}" target="_blank" rel="noopener noreferrer"${styleAttr}>${escapeHtml(seg.text)}</a>`;
      }

      let html = `<span${styleAttr}>${escapeHtml(seg.text)}</span>`;
      if (st.subScript) html = `<sub>${html}</sub>`;
      if (st.superScript) html = `<sup>${html}</sup>`;
      return html;
    })
    .join('');
}

/**
 * Generates high-fidelity print/Word preview HTML by reusing the exact same
 * parseDocumentForExport() AST used to generate the .docx binary.
 */
export function renderDocxExportPreview(
  markdown: string,
  options?: DocxExportOptions
): ExportPreviewResult {
  const { pageConfig, blocks } = parseDocumentForExport(markdown, options);

  let hasMath = false;
  let hasTables = false;
  let hasCode = false;
  let hasImages = false;

  const headingCss: Record<number, string> = {
    1: 'font-size: 1.75em; font-weight: 800; margin: 0.8em 0 0.45em; color: #0f172a; line-height: 1.25;',
    2: 'font-size: 1.4em; font-weight: 700; margin: 0.75em 0 0.4em; color: #0f172a; padding-bottom: 4px; border-bottom: 1px solid #e2e8f0; line-height: 1.3;',
    3: 'font-size: 1.18em; font-weight: 700; margin: 0.65em 0 0.35em; color: #1e293b; line-height: 1.35;',
    4: 'font-size: 1.05em; font-weight: 700; margin: 0.55em 0 0.3em; color: #1e293b;',
    5: 'font-size: 0.98em; font-weight: 600; margin: 0.45em 0 0.25em; color: #334155;',
    6: 'font-size: 0.92em; font-weight: 600; margin: 0.4em 0 0.2em; color: #475569;',
  };

  const parts: string[] = [];

  for (const block of blocks) {
    switch (block.type) {
      case 'heading': {
        parts.push(
          `<h${block.level} style="${headingCss[block.level]} text-align: ${
            block.alignment
          };">${renderInlineSegmentsToPreviewHtml(block.segments)}</h${block.level}>`
        );
        break;
      }

      case 'paragraph': {
        parts.push(
          `<p style="margin: 0.5em 0; text-align: ${block.alignment}; line-height: ${
            pageConfig.lineSpacingRatio
          };">${renderInlineSegmentsToPreviewHtml(block.segments)}</p>`
        );
        break;
      }

      case 'blockquote': {
        const calloutColors: Record<string, { border: string; bg: string }> = {
          NOTE: { border: '#4F46E5', bg: '#EEF2FF' },
          TIP: { border: '#059669', bg: '#ECFDF5' },
          WARNING: { border: '#D97706', bg: '#FFFBEB' },
          IMPORTANT: { border: '#DC2626', bg: '#FEF2F2' },
        };
        const palette =
          (block.calloutType && calloutColors[block.calloutType]) || {
            border: '#6366F1',
            bg: '#F8FAFC',
          };
        const borderProp =
          pageConfig.direction === 'rtl'
            ? `border-right: 4px solid ${palette.border}; padding: 8px 14px 8px 10px;`
            : `border-left: 4px solid ${palette.border}; padding: 8px 10px 8px 14px;`;
        const inner = block.lines
          .map(lineSegs => renderInlineSegmentsToPreviewHtml(lineSegs))
          .join('<br/>');
        parts.push(
          `<blockquote style="margin: 0.7em 0; background-color: ${palette.bg}; ${borderProp} text-align: ${block.alignment}; border-radius: 4px;">${inner}</blockquote>`
        );
        break;
      }

      case 'bulletListItem': {
        const padProp =
          pageConfig.direction === 'rtl'
            ? `padding-right: ${18 + block.level * 16}px;`
            : `padding-left: ${18 + block.level * 16}px;`;
        parts.push(
          `<div style="display: flex; align-items: baseline; gap: 8px; margin: 0.25em 0; ${padProp} text-align: ${
            block.alignment
          };"><span aria-hidden="true">•</span><span>${renderInlineSegmentsToPreviewHtml(
            block.segments
          )}</span></div>`
        );
        break;
      }

      case 'taskListItem': {
        const padProp =
          pageConfig.direction === 'rtl' ? 'padding-right: 12px;' : 'padding-left: 12px;';
        const icon = block.checked ? '☑' : '☐';
        const color = block.checked ? '#059669' : '#64748b';
        const textStyle = block.checked
          ? 'text-decoration: line-through; color: #64748b;'
          : '';
        parts.push(
          `<div style="display: flex; align-items: baseline; gap: 8px; margin: 0.25em 0; ${padProp} text-align: ${
            block.alignment
          };"><span style="color: ${color}; font-weight: 700;">${icon}</span><span style="${textStyle}">${renderInlineSegmentsToPreviewHtml(
            block.segments
          )}</span></div>`
        );
        break;
      }

      case 'orderedListItem': {
        const padProp =
          pageConfig.direction === 'rtl' ? 'padding-right: 16px;' : 'padding-left: 16px;';
        parts.push(
          `<div style="display: flex; align-items: baseline; gap: 6px; margin: 0.25em 0; ${padProp} text-align: ${
            block.alignment
          };"><strong style="font-weight: 700;">${escapeHtml(
            block.marker
          )}</strong><span>${renderInlineSegmentsToPreviewHtml(
            block.segments
          )}</span></div>`
        );
        break;
      }

      case 'codeBlock': {
        hasCode = true;
        const langBadge =
          block.language && block.language !== 'code'
            ? `<div style="font-size: 10px; font-weight: 700; color: #64748b; margin-bottom: 4px; text-transform: uppercase;">${escapeHtml(
                block.language
              )}</div>`
            : '';
        parts.push(
          `<div dir="ltr" style="margin: 0.75em 0; background-color: #F1F5F9; border: 1px solid #E2E8F0; border-left: 3px solid #6366F1; border-radius: 6px; padding: 10px 14px; font-family: Consolas, ui-monospace, monospace; font-size: 9.5pt; color: #1E293B; overflow-x: auto; text-align: left;">${langBadge}<pre style="margin: 0; white-space: pre-wrap; word-break: break-word; font-family: inherit;">${escapeHtml(
            block.code
          )}</pre></div>`
        );
        break;
      }

      case 'table': {
        hasTables = true;
        const rowsHtml = block.rows
          .map((rowModel, rowIdx) => {
            const cellTag = rowModel.isHeader ? 'th' : 'td';
            const rowBg = rowModel.isHeader
              ? '#F1F5F9'
              : rowIdx % 2 === 0
              ? '#F8FAFC'
              : '#FFFFFF';
            const bottomBorder = rowModel.isHeader
              ? '2px solid #64748B'
              : '1px solid #CBD5E1';
            const cellsHtml = rowModel.cells
              .map((cell, colIdx) => {
                const colAlign =
                  block.alignments[colIdx] ||
                  (pageConfig.direction === 'rtl' ? 'right' : 'left');
                const resolvedAlign =
                  rowModel.isHeader &&
                  colAlign === 'left' &&
                  pageConfig.direction === 'ltr'
                    ? 'center'
                    : colAlign;
                const fw = rowModel.isHeader ? 'font-weight: 700;' : '';
                return `<${cellTag} style="border: 1px solid #CBD5E1; border-bottom: ${bottomBorder}; padding: 6px 10px; text-align: ${resolvedAlign}; background-color: ${rowBg}; ${fw}">${renderInlineSegmentsToPreviewHtml(
                  cell.segments
                )}</${cellTag}>`;
              })
              .join('');
            return `<tr>${cellsHtml}</tr>`;
          })
          .join('');

        parts.push(
          `<div style="margin: 0.75em 0; overflow-x: auto;"><table dir="${pageConfig.direction}" style="width: 100%; border-collapse: collapse; font-size: 0.92em;"><tbody>${rowsHtml}</tbody></table></div>`
        );
        break;
      }

      case 'mathBlock': {
        hasMath = true;
        let rendered = '';
        try {
          rendered = renderLatexHtml(block.formula, true);
        } catch {
          rendered = `<em style="font-style: italic;">${escapeHtml(block.formula)}</em>`;
        }
        parts.push(
          `<div style="margin: 0.75em 0; text-align: center; overflow-x: auto;">${rendered}</div>`
        );
        break;
      }

      case 'imageBlock': {
        hasImages = true;
        parts.push(
          `<div style="margin: 0.75em 0; text-align: ${block.alignment};"><img src="${escapeHtml(
            block.src
          )}" alt="${escapeHtml(
            block.alt
          )}" style="max-width: 100%; max-height: 360px; height: auto; border-radius: 6px; border: 1px solid #e2e8f0; display: inline-block;" /></div>`
        );
        break;
      }

      case 'horizontalRule': {
        parts.push(
          `<hr style="margin: 0.9em 0; border: 0; border-bottom: 1px solid #CBD5E1;" />`
        );
        break;
      }

      case 'pageBreak': {
        parts.push(
          `<div style="margin: 1.5em 0; border-top: 2px dashed #94A3B8; text-align: center; position: relative; height: 1px;"><span style="background: #ffffff; color: #64748b; font-size: 10px; font-weight: 700; padding: 0 8px; position: relative; top: -8px;">PAGE BREAK</span></div>`
        );
        break;
      }
    }
  }

  return {
    html: parts.join('\n'),
    pageConfig,
    stats: {
      blockCount: blocks.length,
      hasMath,
      hasTables,
      hasCode,
      hasImages,
    },
  };
}

/**
 * Converts markdown text into raw DOCX binary Uint8Array bytes
 */
export async function markdownToDocxBytes(
  markdown: string,
  options?: DocxExportOptions
): Promise<Uint8Array> {
  const doc = generateDocxDocument(markdown, options);
  const arrayBuffer = await Packer.toArrayBuffer(doc);
  return new Uint8Array(arrayBuffer);
}

/**
 * Triggers a browser download of any raw DOCX binary buffer
 */
export function downloadDocxBuffer(
  buffer: ArrayBuffer | Uint8Array,
  filename = 'document.docx'
): void {
  const blob = new Blob([buffer as any], {
    type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename.endsWith('.docx') ? filename : `${filename}.docx`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Parses markdown into docx elements and triggers browser download
 */
export async function exportToDocx(
  markdown: string,
  filename = 'midadd-document.docx',
  options?: DocxExportOptions
): Promise<boolean> {
  try {
    const bytes = await markdownToDocxBytes(markdown, options);
    downloadDocxBuffer(bytes, filename);
    return true;
  } catch (err) {
    console.error('Failed to export DOCX:', err);
    throw err;
  }
}
