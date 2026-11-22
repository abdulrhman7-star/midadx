import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateDocumentStats,
  formatReadingTime,
  stripMarkdownForStats,
} from './text-stats';

test('calculateDocumentStats handles empty and whitespace-only strings', () => {
  const empty = calculateDocumentStats('');
  assert.equal(empty.words, 0);
  assert.equal(empty.characters, 0);
  assert.equal(empty.charactersNoSpaces, 0);
  assert.equal(empty.readingSeconds, 0);
  assert.equal(empty.readingMinutes, 0);
  assert.equal(empty.estimatedPages, 1);

  const spaces = calculateDocumentStats('   \n\t  ');
  assert.equal(spaces.words, 0);
  assert.equal(spaces.characters, 0);
  assert.equal(spaces.readingMinutes, 0);
});

test('calculateDocumentStats accurately counts Arabic and English words and characters', () => {
  const sample = 'مرحباً بكم في محرر مداد الذكي midadd';
  const stats = calculateDocumentStats(sample);
  assert.equal(stats.words, 7);
  assert.equal(stats.characters, sample.length);
  assert.equal(stats.charactersNoSpaces, sample.replace(/\s/g, '').length);
  assert.equal(stats.readingSeconds > 0, true);
  assert.equal(stats.readingMinutes, 1);
});

test('stripMarkdownForStats strips formatting, URLs, and base64 images without losing visible text', () => {
  const md = [
    '# عنوان المستند',
    '',
    'هذا **نص عربي** مع [رابط مفيد](https://example.com/very/long/path?x=123).',
    '![صورة توضيحية](data:image/png;base64,' + 'A'.repeat(500) + ')',
    '| العمود الأول | العمود الثاني |',
    '| :--- | :--- |',
    '| قيمة 1 | قيمة 2 |',
  ].join('\n');

  const stripped = stripMarkdownForStats(md);
  assert.equal(stripped.includes('AAAA'), false);
  assert.equal(stripped.includes('https://example.com'), false);
  assert.equal(stripped.includes('عنوان المستند'), true);
  assert.equal(stripped.includes('رابط مفيد'), true);
  assert.equal(stripped.includes('صورة توضيحية'), true);

  const stats = calculateDocumentStats(md);
  // Words: عنوان(1) المستند(2) هذا(3) نص(4) عربي(5) مع(6) رابط(7) مفيد(8) صورة(9) توضيحية(10) العمود(11) الأول(12) العمود(13) الثاني(14) قيمة(15) 1(16) قيمة(17) 2(18)
  assert.equal(stats.words, 18);
  assert.equal(stats.characters < 200, true);
});

test('formatReadingTime handles empty, under-1-minute, and multi-minute states in Arabic and English', () => {
  const zeroStats = calculateDocumentStats('');
  assert.equal(formatReadingTime(zeroStats, 'ar'), '0 دقيقة');
  assert.equal(formatReadingTime(zeroStats, 'en'), '0 min');

  const shortStats = calculateDocumentStats('كلمة اثنتان ثلاث أربع خمس');
  assert.equal(formatReadingTime(shortStats, 'ar'), 'أقل من دقيقة');
  assert.equal(formatReadingTime(shortStats, 'en'), '< 1 min');

  const fourHundredWords = Array.from({ length: 400 }, () => 'word').join(' ');
  const multiStats = calculateDocumentStats(fourHundredWords);
  assert.equal(multiStats.words, 400);
  assert.equal(multiStats.readingMinutes, 2);
  assert.equal(formatReadingTime(multiStats, 'ar'), 'دقيقتان');
  assert.equal(formatReadingTime(multiStats, 'en'), '2 min');

  const thousandWords = Array.from({ length: 1000 }, () => 'كلمة').join(' ');
  const fiveMinStats = calculateDocumentStats(thousandWords);
  assert.equal(fiveMinStats.words, 1000);
  assert.equal(formatReadingTime(fiveMinStats, 'ar'), '5 دقائق');
  assert.equal(formatReadingTime(fiveMinStats, 'en'), '5 min');
});
