import test from 'node:test';
import assert from 'node:assert/strict';
import { GUIDE_ARTICLES, getGuideBySlug, filterGuidesByCategory } from './guides-data';

test('GUIDE_ARTICLES contains at least 3 complete foundational articles', () => {
  assert.ok(GUIDE_ARTICLES.length >= 3);
  for (const article of GUIDE_ARTICLES) {
    assert.ok(article.slug.length > 0);
    assert.ok(article.titleAr.length > 10);
    assert.ok(article.sections.length >= 2);
  }
});

test('getGuideBySlug returns the expected article and undefined for missing slugs', () => {
  const found = getGuideBySlug('ai-markdown-to-word-guide');
  assert.ok(found);
  assert.equal(found.categoryId, 'formatting');
  assert.equal(getGuideBySlug('non-existent-slug'), undefined);
});

test('filterGuidesByCategory filters by category and search text', () => {
  const all = filterGuidesByCategory('all');
  assert.equal(all.length, GUIDE_ARTICLES.length);

  const mathOnly = filterGuidesByCategory('math');
  assert.equal(mathOnly.length, 1);
  assert.equal(mathOnly[0].slug, 'latex-omml-arabic-research-guide');

  const queryMatch = filterGuidesByCategory('all', 'RTL');
  assert.equal(queryMatch.length, 1);
  assert.equal(queryMatch[0].slug, 'fixing-arabic-rtl-tables-word-guide');
});
