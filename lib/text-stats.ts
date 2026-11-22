export interface DocumentStats {
  words: number;
  characters: number;
  charactersNoSpaces: number;
  lines: number;
  paragraphs: number;
  sentences: number;
  readingSeconds: number;
  readingMinutes: number;
  speakingMinutes: number;
  estimatedPages: number;
}

const DEFAULT_WORDS_PER_MINUTE = 200;
const DEFAULT_SPEAKING_WPM = 130;
const WORDS_PER_PAGE = 320;

/**
 * Strips Markdown formatting tokens, URLs, base64 payloads, and HTML tags
 * while preserving readable human text (Arabic, Latin, digits, code text).
 */
export function stripMarkdownForStats(markdown: string): string {
  if (!markdown) return '';

  let text = markdown;

  // Replace Markdown images ![alt](url_or_base64) with alt text only
  text = text.replace(/!\[([^\]]*)\]\([^)]*\)/g, ' $1 ');

  // Replace Markdown links [label](url) with label text only
  text = text.replace(/\[([^\]]+)\]\([^)]*\)/g, ' $1 ');

  // Remove HTML tags (keeping inner text)
  text = text.replace(/<[^>]+>/g, ' ');

  // Remove fenced code block fence lines (```lang / ```), keeping code lines
  text = text.replace(/^```[^\n]*$/gm, ' ');

  // Remove LaTeX math delimiters ($$ ... $$ and $) while keeping math tokens
  text = text.replace(/\$\$/g, ' ').replace(/\$/g, ' ');

  // Remove table separator rows like | :--- | :---: | --- |
  text = text.replace(/^\s*\|?(?:\s*:?-{2,}:?\s*\|)+\s*:?-{0,}:?\s*$/gm, ' ');

  // Remove heading hashes, blockquote markers, horizontal rules, list bullets
  text = text
    .replace(/^\s{0,3}#{1,6}\s+/gm, '')
    .replace(/^\s{0,3}>\s?/gm, '')
    .replace(/^\s{0,3}(?:[-*_]\s*){3,}$/gm, ' ')
    .replace(/^\s{0,3}(?:[-*+]|\d+\.)\s+/gm, '');

  // Strip inline markdown tokens (*, _, ~, `, |)
  text = text.replace(/[*_`~|]/g, ' ');

  // Collapse consecutive spaces/tabs per line and trim
  return text
    .replace(/[ \t]+/g, ' ')
    .replace(/ *\n */g, '\n')
    .replace(/\n{2,}/g, '\n')
    .trim();
}

/**
 * Computes real-time document statistics: words, characters, and reading time.
 */
export function calculateDocumentStats(
  markdown: string,
  wordsPerMinute: number = DEFAULT_WORDS_PER_MINUTE
): DocumentStats {
  const safeInput = markdown || '';
  if (!safeInput.trim()) {
    return {
      words: 0,
      characters: 0,
      charactersNoSpaces: 0,
      lines: safeInput ? safeInput.split('\n').length : 0,
      paragraphs: 0,
      sentences: 0,
      readingSeconds: 0,
      readingMinutes: 0,
      speakingMinutes: 0,
      estimatedPages: 1,
    };
  }

  const plainText = stripMarkdownForStats(safeInput);
  const wordsList = plainText
    .split(/\s+/)
    .map(token => token.trim())
    // Filter out tokens that are purely punctuation (e.g., "-", "—", "...")
    .filter(token => /[\p{L}\p{N}]/u.test(token));

  const words = wordsList.length;
  const characters = plainText.length;
  const charactersNoSpaces = plainText.replace(/\s/g, '').length;
  const lines = safeInput.split('\n').length;
  const paragraphs = safeInput
    .split(/\n\s*\n/)
    .filter(p => stripMarkdownForStats(p).length > 0).length;
  const sentences = plainText
    .split(/[.!?؟]+/)
    .filter(s => /[\p{L}\p{N}]/u.test(s)).length;

  const wpm = wordsPerMinute > 0 ? wordsPerMinute : DEFAULT_WORDS_PER_MINUTE;
  const readingSeconds = words === 0 ? 0 : Math.max(1, Math.round((words / wpm) * 60));
  const readingMinutes = words === 0 ? 0 : Math.ceil(words / wpm);
  const speakingMinutes = words === 0 ? 0 : Math.ceil(words / DEFAULT_SPEAKING_WPM);
  const estimatedPages = Math.max(1, Math.ceil(words / WORDS_PER_PAGE));

  return {
    words,
    characters,
    charactersNoSpaces,
    lines,
    paragraphs,
    sentences,
    readingSeconds,
    readingMinutes,
    speakingMinutes,
    estimatedPages,
  };
}

/**
 * Formats estimated reading time in Arabic or English for status bar & modal UI.
 */
export function formatReadingTime(
  stats: Pick<DocumentStats, 'words' | 'readingSeconds' | 'readingMinutes'>,
  language: string = 'ar'
): string {
  const isAr = language === 'ar';

  if (stats.words === 0 || stats.readingSeconds === 0) {
    return isAr ? '0 دقيقة' : '0 min';
  }

  if (stats.readingSeconds < 60) {
    return isAr ? 'أقل من دقيقة' : '< 1 min';
  }

  const mins = Math.max(1, Math.round(stats.readingSeconds / 60));
  if (isAr) {
    if (mins === 1) return 'دقيقة واحدة';
    if (mins === 2) return 'دقيقتان';
    if (mins <= 10) return `${mins} دقائق`;
    return `${mins} دقيقة`;
  }

  return `${mins} min`;
}
