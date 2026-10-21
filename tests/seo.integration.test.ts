import 'dotenv/config';
import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import { load } from 'cheerio';
import { Pool } from 'pg';

const base = process.env.TEST_BASE_URL || 'http://localhost:3000';
const origin = process.env.TEST_SITE_URL || base;
const bot = 'facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)';
const fixtureSlug = `seo-check-${randomUUID()}`;
let fixturePool: Pool | undefined;
before(async () => {
  // Opt in only against a local test database. Normal runs remain read-only.
  if (process.env.SEO_TEST_FIXTURES !== 'true') return;
  assert.ok(
    ['localhost', '127.0.0.1'].includes(new URL(base).hostname),
    'Fixtures require a local test server',
  );
  fixturePool = new Pool({ connectionString: process.env.DATABASE_URL });
  const attorney = (
    await fixturePool.query('INSERT INTO attorneys (slug, name) VALUES ($1, $2) RETURNING id', [
      fixtureSlug,
      'SEO Verification Lawyer',
    ])
  ).rows[0].id;
  const practice = (
    await fixturePool.query('INSERT INTO practice_areas (slug) VALUES ($1) RETURNING id', [
      fixtureSlug,
    ])
  ).rows[0].id;
  const article = (
    await fixturePool.query(
      'INSERT INTO articles (slug, status, attorney_id, cover_image, published_at) VALUES ($1, $2, $3, $4, NOW()) RETURNING id',
      [fixtureSlug, 'published', attorney, '/assets/images/article.webp'],
    )
  ).rows[0].id;
  const fallback = (
    await fixturePool.query(
      'INSERT INTO articles (slug, status, published_at) VALUES ($1, $2, NOW()) RETURNING id',
      [fixtureSlug + '-fallback', 'published'],
    )
  ).rows[0].id;
  await fixturePool.query('INSERT INTO articles (slug, status) VALUES ($1, $2)', [
    fixtureSlug + '-draft',
    'draft',
  ]);
  await fixturePool.query(
    'INSERT INTO article_translations (article_id, locale, title, excerpt, body) VALUES ($1, $2, $3, $4, $5)',
    [
      fallback,
      'en',
      'SEO fallback card check',
      'An article without a cover image.',
      '<p>A temporary verification article.</p>',
    ],
  );
  for (const locale of ['en', 'tr']) {
    await fixturePool.query(
      'INSERT INTO attorney_translations (attorney_id, locale, role, area, bio) VALUES ($1, $2, $3, $4, $5)',
      [attorney, locale, 'Lawyer', 'Legal advice', '<p>Temporary SEO verification profile.</p>'],
    );
    await fixturePool.query(
      'INSERT INTO practice_area_translations (area_id, locale, title, excerpt, body) VALUES ($1, $2, $3, $4, $5)',
      [
        practice,
        locale,
        'SEO Verification Practice',
        'A temporary practice area for SEO verification.',
        '<p>Legal services.</p>',
      ],
    );
    await fixturePool.query(
      'INSERT INTO article_translations (article_id, locale, title, excerpt, body) VALUES ($1, $2, $3, $4, $5)',
      [
        article,
        locale,
        'SEO Verification Article',
        'A temporary article for SEO verification.',
        '<h2>Overview</h2><p>Legal insight.</p>',
      ],
    );
  }
});
after(async () => {
  if (!fixturePool) return;
  try {
    await fixturePool.query('DELETE FROM articles WHERE slug = ANY($1::text[])', [
      [fixtureSlug, fixtureSlug + '-fallback', fixtureSlug + '-draft'],
    ]);
    await fixturePool.query('DELETE FROM attorneys WHERE slug = $1', [fixtureSlug]);
    await fixturePool.query('DELETE FROM practice_areas WHERE slug = $1', [fixtureSlug]);
  } finally {
    await fixturePool.end();
  }
});
async function page(path: string) {
  const response = await fetch(base + path, { headers: { 'user-agent': bot }, redirect: 'manual' });
  return { response, $: load(await response.text()) };
}

test('social crawlers receive complete bilingual cards in the initial HTML', async () => {
  for (const [path, locale, language] of [
    ['/', 'en', 'en-US'],
    ['/tr', 'tr', 'tr-TR'],
    ['/about', 'en', 'en-US'],
    ['/tr/contact', 'tr', 'tr-TR'],
  ]) {
    const { response, $ } = await page(path!);
    assert.equal(response.status, 200, path);
    const meta = (name: string) =>
      $(`meta[property="${name}"], meta[name="${name}"]`).attr('content');
    assert.equal($('html').attr('lang'), language);
    for (const name of [
      'description',
      'og:title',
      'og:description',
      'og:url',
      'og:image',
      'og:image:alt',
      'twitter:title',
      'twitter:description',
      'twitter:image',
    ])
      assert.ok(meta(name), `${path}: ${name}`);
    assert.equal($('meta[property="og:image"]').length, 1);
    assert.equal($('link[rel="canonical"]').length, 1);
    assert.equal(meta('og:image'), origin + `/assets/social/lexviora-share-${locale}.jpg`);
    assert.equal(meta('twitter:image'), meta('og:image'));
    assert.equal(meta('twitter:card'), 'summary_large_image');
    assert.equal(meta('og:image:width'), '1200');
    assert.equal(meta('og:image:height'), '630');
    assert.doesNotMatch(meta('description')!, /template|şablon/i);
    assert.equal($('link[hreflang="tr-TR"]').length, 1);
    const schema = JSON.parse($('script[type="application/ld+json"]').text());
    assert.ok(
      schema['@graph'].some((node: Record<string, unknown>) => node['@type'] === 'LegalService'),
    );
    const image = await fetch(base + new URL(meta('og:image')!).pathname, {
      headers: { 'user-agent': bot },
    });
    assert.equal(image.status, 200);
    assert.match(image.headers.get('content-type')!, /image\/jpeg/);
    assert.ok((await image.arrayBuffer()).byteLength < 300_000);
  }
});

test('query strings and alternate journal layouts share the clean canonical URL', async () => {
  for (const path of ['/blog-list?utm_source=linkedin', '/blog-category', '/tr/blog-list']) {
    const { $, response } = await page(path);
    assert.equal(response.status, 200);
    assert.equal(
      $('link[rel="canonical"]').attr('href'),
      origin + (path.startsWith('/tr') ? '/tr/blog' : '/blog'),
    );
  }
  const { $ } = await page('/blog?q=contract');
  assert.match($('meta[name="robots"]').attr('content')!, /noindex/);
});

test('search, administration and missing pages cannot be indexed', async () => {
  for (const path of [
    '/search',
    '/tr/search',
    '/admin/login',
    '/tr/admin/login',
    '/documentation',
    '/404',
    '/tr/404',
    '/page-that-does-not-exist',
  ]) {
    const { response, $ } = await page(path);
    if (path.includes('404') || path.includes('does-not-exist'))
      assert.equal(response.status, 404, path);
    assert.match(
      ($('meta[name="robots"]').attr('content') || '') +
        (response.headers.get('x-robots-tag') || ''),
      /noindex/,
      path,
    );
  }
});

test('live sitemap includes published content, locale alternates and the runtime domain', async () => {
  const development = (await (await fetch(base + '/robots.txt')).text()).includes(
    '# DEVELOPMENT HINTS:',
  );
  // Nuxt Sitemap intentionally uses the request origin in development.
  const sitemapOrigin = development ? base : origin;
  const response = await fetch(base + '/sitemap.xml');
  assert.equal(response.status, 200);
  const xml = await response.text();
  const $ = load(xml, { xml: true });
  const urls = $('url > loc')
    .map((_, el) => $(el).text())
    .get();
  assert.ok(urls.includes(sitemapOrigin + '/tr'));
  assert.ok(urls.includes(sitemapOrigin + '/about'));
  assert.ok(urls.every((url) => url.startsWith(sitemapOrigin + '/')));
  assert.ok(
    urls.every(
      (url) =>
        !/\/(admin|search|documentation|404|blog-list|blog-category)(\/|$)/.test(
          new URL(url).pathname,
        ),
    ),
  );
  assert.match(xml, /hreflang="tr-TR"/);
  if (fixturePool) {
    assert.ok(!urls.some((url) => url.includes(fixtureSlug + '-draft')));
    assert.ok(!urls.includes(sitemapOrigin + '/tr/blog/' + fixtureSlug + '-fallback'));
    const fallback = await page('/blog/' + fixtureSlug + '-fallback');
    assert.equal(
      fallback.$('meta[property="og:image"]').attr('content'),
      origin + '/assets/social/lexviora-share-en.jpg',
    );
    assert.equal(fallback.$('link[hreflang="tr-TR"]').length, 0);
  }
  for (const resource of ['articles', 'practice-areas', 'attorneys']) {
    const content = (await (await fetch(base + `/api/content/${resource}?locale=en`)).json()) as {
      slug: string;
      title?: string;
      name?: string;
      coverImage?: string;
    }[];
    assert.ok(content.length, `Seeded ${resource} are required for the full SEO check`);
    for (const item of content)
      assert.ok(
        urls.includes(
          sitemapOrigin + `/${resource === 'articles' ? 'blog' : resource}/${item.slug}`,
        ),
      );
    const item = content[0]!;
    const path = `/${resource === 'articles' ? 'blog' : resource}/${item.slug}`;
    const { response: detail, $: detailHtml } = await page(path);
    assert.equal(detail.status, 200);
    assert.ok(
      detailHtml('meta[property="og:title"]')
        .attr('content')
        ?.includes(item.title || item.name!),
    );
    if (resource === 'articles') {
      assert.equal(detailHtml('meta[property="og:type"]').attr('content'), 'article');
      assert.ok(detailHtml('script[type="application/ld+json"]').text().includes('BlogPosting'));
      if (item.coverImage)
        assert.equal(
          detailHtml('meta[property="og:image"]').attr('content'),
          new URL(item.coverImage, origin).href,
        );
    }
  }
});

test('robots.txt keeps public media accessible and advertises the sitemap', async () => {
  const response = await fetch(base + '/robots.txt');
  const robots = await response.text();
  assert.equal(response.status, 200);
  if (process.env.SEO_EXPECT_PRODUCTION === 'true') {
    assert.doesNotMatch(robots, /indexing disabled|^Disallow: \/\s*$/m);
    assert.ok(robots.includes(origin + '/sitemap.xml'));
    const home = await page('/');
    assert.doesNotMatch(home.$('meta[name="robots"]').attr('content') || '', /noindex/);
  }
  // Development deliberately blocks crawlers; the remaining assertions target production.
  if (!/^Disallow: \/\s*$/m.test(robots)) {
    assert.match(robots, /Disallow: \/admin/);
    assert.match(robots, /Disallow: \/tr\/admin/);
    assert.ok(robots.includes(origin + '/sitemap.xml'));
    assert.doesNotMatch(robots, /Disallow: \/assets/);
  }
});
