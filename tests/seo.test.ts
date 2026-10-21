import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  absoluteImage,
  availableContentLocales,
  canonicalPath,
  isIndexablePath,
  seoDate,
  seoText,
  sitemapEntries,
} from '../shared/seo';

test('canonical paths consolidate journal layouts and discard tracking parameters', () => {
  assert.equal(canonicalPath('/tr/blog-list/?utm_source=linkedin#latest', 'tr'), '/tr/blog');
  assert.equal(canonicalPath('/blog-category', 'en'), '/blog');
  assert.equal(canonicalPath('/tr/blog/sozlesme/', 'en'), '/blog/sozlesme');
  assert.equal(canonicalPath('/tr/', 'tr'), '/tr');
});

test('social image URLs are absolute and invalid media falls back to a locale-specific card', () => {
  const origin = 'https://lexviora.example';
  assert.equal(absoluteImage('/media/cover.jpg', origin, 'en'), origin + '/media/cover.jpg');
  assert.equal(
    absoluteImage('https://cdn.example/cover.jpg', origin, 'tr'),
    'https://cdn.example/cover.jpg',
  );
  for (const image of [null, '', 'javascript:alert(1)', 'data:image/png;base64,test']) {
    assert.equal(
      absoluteImage(image, origin, 'tr'),
      origin + '/assets/social/lexviora-share-tr.jpg',
    );
  }
});

test('private, internal and error pages are excluded in both languages', () => {
  for (const path of [
    '/admin',
    '/tr/admin/login',
    '/api/auth/session',
    '/search',
    '/tr/documentation',
    '/404',
  ])
    assert.equal(isIndexablePath(path), false, path);
  for (const path of ['/', '/tr', '/blog/sozlesme', '/tr/practice-areas/family', '/privacy'])
    assert.equal(isIndexablePath(path), true, path);
});

test('sitemap alternates only advertise translations that exist', () => {
  const locales = availableContentLocales({
    id: 1,
    translations: { en: { title: 'An article' }, tr: { title: '', body: null } },
  });
  assert.deepEqual(locales, ['en']);
  const entries = sitemapEntries('/blog/new-article', locales, '2026-10-21T10:00:00Z');
  assert.equal(entries.length, 1);
  assert.equal(entries[0]!.lastmod, '2026-10-21T10:00:00.000Z');
  assert.deepEqual(
    entries[0]!.alternatives.map((a) => a.hreflang),
    ['en-US', 'x-default'],
  );
  assert.equal(sitemapEntries('/about').length, 2);
  assert.equal(seoDate('invalid'), undefined);
});

test('HTML descriptions become readable snippets with bounded length', () => {
  assert.equal(
    seoText('<p>Legal &amp; advisory</p>\n<p>Clear advice.</p>'),
    'Legal & advisory Clear advice.',
  );
  const excerpt = seoText('A considered perspective on legal questions. '.repeat(15));
  assert.ok(excerpt.length <= 170);
  assert.ok(excerpt.endsWith('…'));
});
