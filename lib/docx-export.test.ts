import test from 'node:test';
import assert from 'node:assert/strict';
import {
  normalizeColorHex,
  parseInlineSegments,
  parseDocumentForExport,
  renderDocxExportPreview,
  markdownToDocxBytes,
} from './docx-export';

test('normalizeColorHex normalizes #hex, #rgb, rgb(), rgba(), and named colors', () => {
  assert.equal(normalizeColorHex('#f00'), 'FF0000');
  assert.equal(normalizeColorHex('#1e293b'), '1E293B');
  assert.equal(normalizeColorHex('rgb(220, 38, 38)'), 'DC2626');
  assert.equal(normalizeColorHex('rgba(37, 99, 235, 0.85)'), '2563EB');
  assert.equal(normalizeColorHex('rgba(0, 0, 0, 0)'), undefined);
  assert.equal(normalizeColorHex('blue'), '2563EB');
  assert.equal(normalizeColorHex('transparent'), undefined);
});

test('parseInlineSegments handles nested bold, italic, underline, strike, color, highlight, sub/sup, links, code, and math', () => {
  const nested = parseInlineSegments(
    '<span style="color: rgb(220, 38, 38);"><mark style="background-color: #fef08a;"><strong><u>Important</u></strong></mark></span> and ~~old~~ + H<sub>2</sub>O + x<sup>2</sup>'
  );

  const styledSeg = nested.find(s => s.kind === 'text' && s.text === 'Important');
  assert.ok(styledSeg && styledSeg.kind === 'text');
  assert.equal(styledSeg.style.color, 'DC2626');
  assert.equal(styledSeg.style.highlight, 'FEF08A');
  assert.equal(styledSeg.style.bold, true);
  assert.equal(styledSeg.style.underline, true);

  const strikeSeg = nested.find(s => s.kind === 'text' && s.text === 'old');
  assert.ok(strikeSeg && strikeSeg.kind === 'text');
  assert.equal(strikeSeg.style.strike, true);

  const subSeg = nested.find(s => s.kind === 'text' && s.text === '2' && s.style.subScript);
  assert.ok(subSeg);

  const supSeg = nested.find(s => s.kind === 'text' && s.text === '2' && s.style.superScript);
  assert.ok(supSeg);

  const doubleSpan = parseInlineSegments(
    '<span style="color: #dc2626;"><span style="background-color: #fef08a;">Deep</span></span>'
  );
  assert.equal(doubleSpan.length, 1);
  assert.equal(doubleSpan[0].kind, 'text');
  if (doubleSpan[0].kind === 'text') {
    assert.equal(doubleSpan[0].text, 'Deep');
    assert.equal(doubleSpan[0].style.color, 'DC2626');
    assert.equal(doubleSpan[0].style.highlight, 'FEF08A');
  }

  const linkCodeMath = parseInlineSegments('See [Docs](https://example.com) and `const x = 1` and $E=mc^2$');
  assert.ok(linkCodeMath.some(s => s.kind === 'link' && s.url === 'https://example.com'));
  assert.ok(linkCodeMath.some(s => s.kind === 'text' && s.style.code && s.text === 'const x = 1'));
  assert.ok(linkCodeMath.some(s => s.kind === 'math' && s.formula === 'E=mc^2'));
});

test('parseDocumentForExport extracts aligned headings, aligned paragraphs, lists, tables, code blocks, page breaks, and page config', () => {
  const sample = [
    '<h1 style="text-align: center;">**Executive Summary**</h1>',
    '',
    '<p style="text-align: right;">Aligned paragraph with <span style="color: #2563eb;">blue text</span>.</p>',
    '',
    '- [x] Completed task',
    '- First bullet',
    '1. First step',
    '',
    '| Left | Center | Right |',
    '| :--- | :---: | ---: |',
    '| A | B | C |',
    '',
    '```ts',
    'const line1 = true;',
    'const line2 = false;',
    '```',
    '',
    '<div style="page-break-after: always;"></div>',
  ].join('\n');

  const parsed = parseDocumentForExport(sample, {
    orientation: 'landscape',
    paperSize: 'letter',
    margins: 'narrow',
    fontFamily: 'Cairo',
    fontSize: 12,
    lineSpacing: '1.5',
    direction: 'ltr',
    watermark: 'CONFIDENTIAL',
    headerText: 'Q4 Report',
  });

  assert.equal(parsed.pageConfig.orientation, 'landscape');
  assert.equal(parsed.pageConfig.paperSize, 'letter');
  assert.equal(parsed.pageConfig.marginTwips, 720);
  assert.equal(parsed.pageConfig.fontFamily, 'Cairo');
  assert.equal(parsed.pageConfig.fontSizePt, 12);
  assert.equal(parsed.pageConfig.lineSpacingRatio, 1.5);
  assert.equal(parsed.pageConfig.watermark, 'CONFIDENTIAL');
  assert.equal(parsed.pageConfig.headerText, 'Q4 Report');

  const heading = parsed.blocks[0];
  assert.equal(heading.type, 'heading');
  if (heading.type === 'heading') {
    assert.equal(heading.level, 1);
    assert.equal(heading.alignment, 'center');
    assert.equal(heading.segments[0].kind, 'text');
    if (heading.segments[0].kind === 'text') {
      assert.equal(heading.segments[0].style.bold, true);
    }
  }

  const alignedPara = parsed.blocks[1];
  assert.equal(alignedPara.type, 'paragraph');
  if (alignedPara.type === 'paragraph') {
    assert.equal(alignedPara.alignment, 'right');
    assert.ok(alignedPara.segments.some(s => s.kind === 'text' && s.style.color === '2563EB'));
  }

  const task = parsed.blocks.find(b => b.type === 'taskListItem');
  assert.ok(task && task.type === 'taskListItem' && task.checked);

  const bullet = parsed.blocks.find(b => b.type === 'bulletListItem');
  assert.ok(bullet);

  const ordered = parsed.blocks.find(b => b.type === 'orderedListItem');
  assert.ok(ordered);

  const table = parsed.blocks.find(b => b.type === 'table');
  assert.ok(table && table.type === 'table');
  assert.deepEqual(table.alignments, ['left', 'center', 'right']);

  const codeBlock = parsed.blocks.find(b => b.type === 'codeBlock');
  assert.ok(codeBlock && codeBlock.type === 'codeBlock');
  assert.equal(codeBlock.language, 'ts');
  assert.equal(codeBlock.code, 'const line1 = true;\nconst line2 = false;');

  const pageBreak = parsed.blocks.find(b => b.type === 'pageBreak');
  assert.ok(pageBreak);
});

test('renderDocxExportPreview and markdownToDocxBytes share formatting fidelity and produce valid output', async () => {
  const md = [
    '<h2 style="text-align: center;">Formatted Report</h2>',
    '',
    'Text with <span style="color: #dc2626;">red</span> and <mark style="background-color: #fef08a;"><u>highlight</u></mark>.',
    '',
    '| Item | Status |',
    '| :--- | :---: |',
    '| Export | **Ready** |',
    '',
    '```js',
    'console.log("ok");',
    '```',
  ].join('\n');

  const options = {
    fontFamily: 'Amiri',
    fontSize: 12,
    orientation: 'portrait' as const,
    paperSize: 'a4' as const,
    margins: 'wide' as const,
    lineSpacing: '1.5',
    direction: 'ltr' as const,
  };

  const preview = renderDocxExportPreview(md, options);
  assert.equal(preview.pageConfig.fontFamily, 'Amiri');
  assert.equal(preview.pageConfig.margins, 'wide');
  assert.equal(preview.stats.hasTables, true);
  assert.equal(preview.stats.hasCode, true);
  assert.match(preview.html, /text-align:\s*center/);
  assert.match(preview.html, /#DC2626/);
  assert.match(preview.html, /#FEF08A/);
  assert.match(preview.html, /text-decoration:\s*underline/);
  assert.match(preview.html, /<table/);
  assert.match(preview.html, /<pre/);

  const bytes = await markdownToDocxBytes(md, options);
  assert.ok(bytes instanceof Uint8Array);
  assert.ok(bytes.length > 500);
  // DOCX files are valid ZIP archives starting with "PK"
  assert.equal(bytes[0], 0x50);
  assert.equal(bytes[1], 0x4b);
});
