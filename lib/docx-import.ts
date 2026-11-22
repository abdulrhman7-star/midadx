import mammoth from 'mammoth';

/**
 * Converts HTML into Markdown for the editor
 */
export function htmlToMarkdown(html: string): string {
  if (!html) return '';

  // Use DOMParser in the browser
  if (typeof window !== 'undefined' && typeof DOMParser !== 'undefined') {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');

    function nodeToMarkdown(node: Node): string {
      if (node.nodeType === Node.TEXT_NODE) {
        return node.textContent || '';
      }

      if (node.nodeType !== Node.ELEMENT_NODE) {
        return '';
      }

      const el = node as HTMLElement;
      const tag = el.tagName.toLowerCase();
      const childrenText = Array.from(el.childNodes)
        .map(child => nodeToMarkdown(child))
        .join('');

      // Check for LaTeX math elements with data-latex
      const dataLatex = el.getAttribute('data-latex');
      if (dataLatex) {
        if (el.classList.contains('katex-display')) {
          return `\n\n$$\n${dataLatex}\n$$\n\n`;
        }
        return `$${dataLatex}$`;
      }

      const wrapWithSpaces = (raw: string, open: string, close: string): string => {
        if (!raw) return '';
        const m = raw.match(/^(\s*)([\s\S]*?)(\s*)$/);
        if (!m || !m[2]) return raw;
        return `${m[1]}${open}${m[2]}${close}${m[3]}`;
      };

      const rawAlign = el.style?.textAlign?.toLowerCase() || el.getAttribute('align')?.toLowerCase() || '';
      const explicitAlign =
        rawAlign === 'center' || rawAlign === 'right' || rawAlign === 'left' || rawAlign === 'justify'
          ? rawAlign
          : '';

      // Detect page break divs inserted by WordRibbon
      if (tag === 'div' && el.style?.pageBreakAfter === 'always') {
        return '\n\n<div style="page-break-after: always; height: 1px; margin: 30px 0; border-bottom: 2px dashed #cbd5e1;"></div>\n\n';
      }

      switch (tag) {
        case 'h1':
        case 'h2':
        case 'h3':
        case 'h4':
        case 'h5':
        case 'h6': {
          const level = Number(tag.slice(1));
          const inner = childrenText.trim();
          if (explicitAlign) {
            return `\n\n<${tag} style="text-align: ${explicitAlign}">${inner}</${tag}>\n\n`;
          }
          return `\n\n${'#'.repeat(level)} ${inner}\n\n`;
        }
        case 'p': {
          const inner = childrenText.trim();
          if (!inner) return '';
          if (explicitAlign) {
            return `\n\n<p style="text-align: ${explicitAlign}">${inner}</p>\n\n`;
          }
          return `\n\n${inner}\n\n`;
        }
        case 'div': {
          const inner = childrenText.trim();
          if (!inner) return '';
          if (explicitAlign) {
            return `\n\n<p style="text-align: ${explicitAlign}">${inner}</p>\n\n`;
          }
          return `\n\n${childrenText}\n\n`;
        }
        case 'strong':
        case 'b':
          return wrapWithSpaces(childrenText, '**', '**');
        case 'em':
        case 'i':
          return wrapWithSpaces(childrenText, '*', '*');
        case 'u':
          return wrapWithSpaces(childrenText, '<u>', '</u>');
        case 's':
        case 'del':
        case 'strike':
          return wrapWithSpaces(childrenText, '~~', '~~');
        case 'sub':
          return `<sub>${childrenText}</sub>`;
        case 'sup':
          return `<sup>${childrenText}</sup>`;
        case 'code':
          return `\`${childrenText}\``;
        case 'pre': {
          const codeEl = el.querySelector('code');
          let lang = '';
          if (codeEl) {
            const cls = codeEl.className || '';
            const match = cls.match(/language-([a-zA-Z0-9_-]+)/);
            if (match) lang = match[1];
          }
          const rawCode = (codeEl ? codeEl.textContent : el.textContent) || '';
          return `\n\n\`\`\`${lang}\n${rawCode.trim()}\n\`\`\`\n\n`;
        }
        case 'img': {
          const src = el.getAttribute('src') || '';
          const alt = el.getAttribute('alt') || 'Image';
          return `\n\n![${alt}](${src})\n\n`;
        }
        case 'blockquote': {
          const inner = childrenText.trim();
          if (explicitAlign) {
            return `\n\n<blockquote style="text-align: ${explicitAlign}">${inner}</blockquote>\n\n`;
          }
          return `\n\n> ${inner.replace(/\n/g, '\n> ')}\n\n`;
        }
        case 'ul': {
          const items = Array.from(el.children)
            .map(li => `- ${nodeToMarkdown(li).trim()}`)
            .join('\n');
          return `\n\n${items}\n\n`;
        }
        case 'ol': {
          let count = 1;
          const items = Array.from(el.children)
            .map(li => `${count++}. ${nodeToMarkdown(li).trim()}`)
            .join('\n');
          return `\n\n${items}\n\n`;
        }
        case 'li':
          return childrenText.trim();
        case 'table': {
          // Parse table into markdown table
          const rows = Array.from(el.querySelectorAll('tr'));
          if (rows.length === 0) return '';

          const parsedRows: string[][] = [];
          rows.forEach(tr => {
            const cells = Array.from(tr.querySelectorAll('th, td')).map(cell =>
              nodeToMarkdown(cell).replace(/\|/g, '\\|').trim()
            );
            if (cells.length > 0) parsedRows.push(cells);
          });

          if (parsedRows.length === 0) return '';

          const maxCols = Math.max(...parsedRows.map(r => r.length));
          let mdTable = '\n\n|';

          const firstRow = parsedRows[0];
          for (let c = 0; c < maxCols; c++) {
            mdTable += ` ${firstRow[c] || `Header ${c + 1}`} |`;
          }
          mdTable += '\n|';
          for (let c = 0; c < maxCols; c++) {
            mdTable += ' :--- |';
          }

          for (let r = 1; r < parsedRows.length; r++) {
            mdTable += '\n|';
            for (let c = 0; c < maxCols; c++) {
              mdTable += ` ${parsedRows[r][c] || ''} |`;
            }
          }
          mdTable += '\n\n';
          return mdTable;
        }
        case 'hr':
          return '\n\n---\n\n';
        case 'br':
          return '\n';
        case 'a': {
          const href = el.getAttribute('href') || '#';
          return `[${childrenText}](${href})`;
        }
        case 'span': {
          let out = childrenText;
          const textColor = el.style?.color;
          const bgColor = el.style?.backgroundColor;
          const isTransparentBg =
            !bgColor || bgColor === 'transparent' || bgColor === 'rgba(0, 0, 0, 0)';
          if (textColor) {
            out = `<span style="color: ${textColor}">${out}</span>`;
          }
          if (!isTransparentBg) {
            out = `<mark style="background-color: ${bgColor}">${out}</mark>`;
          }
          return out;
        }
        case 'mark': {
          if (el.style && el.style.backgroundColor) {
            return `<mark style="background-color: ${el.style.backgroundColor}">${childrenText}</mark>`;
          }
          return `<mark>${childrenText}</mark>`;
        }
        case 'font': {
          const color = el.getAttribute('color');
          if (color) {
            return `<span style="color: ${color}">${childrenText}</span>`;
          }
          return childrenText;
        }
        default:
          return childrenText;
      }
    }

    const md = nodeToMarkdown(doc.body);
    // Clean up excessive blank lines
    return md.replace(/\n{3,}/g, '\n\n').trim();
  }

  // Fallback regex cleaner
  return html
    .replace(/<h1>(.*?)<\/h1>/gi, '\n\n# $1\n\n')
    .replace(/<h2>(.*?)<\/h2>/gi, '\n\n## $1\n\n')
    .replace(/<h3>(.*?)<\/h3>/gi, '\n\n### $1\n\n')
    .replace(/<strong>(.*?)<\/strong>/gi, '**$1**')
    .replace(/<b>(.*?)<\/b>/gi, '**$1**')
    .replace(/<em>(.*?)<\/em>/gi, '*$1*')
    .replace(/<i>(.*?)<\/i>/gi, '*$1*')
    .replace(/<p>(.*?)<\/p>/gi, '\n\n$1\n\n')
    .replace(/<br\s*[\/]?>/gi, '\n')
    .replace(/<[^>]+>/g, '')
    .trim();
}

/**
 * Imports a .docx file and returns markdown content + title
 */
export async function importDocxFile(file: File): Promise<{
  title: string;
  markdown: string;
  html: string;
  messages: string[];
}> {
  const arrayBuffer = await file.arrayBuffer();
  const result = await mammoth.convertToHtml({ arrayBuffer });

  const html = result.value;
  const markdown = htmlToMarkdown(html);

  // Extract title from filename (strip .docx)
  const cleanTitle = file.name.replace(/\.docx$/i, '').replace(/[-_]/g, ' ');

  const messages = result.messages.map(m => m.message);

  return {
    title: cleanTitle || 'Imported Document',
    markdown,
    html,
    messages,
  };
}
