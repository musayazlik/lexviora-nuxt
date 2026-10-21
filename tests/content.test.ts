import 'dotenv/config';
import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import { readFile, unlink } from 'node:fs/promises';
import { auth } from '../server/utils/auth';
import { getPool } from '../server/utils/db';
import { adminRole, editorRole } from '../shared/permissions';

const base = process.env.TEST_BASE_URL || process.env.BETTER_AUTH_URL || 'http://localhost:3000';
const suffix = randomUUID();
const createdUsers: string[] = [];
const articleSlug = 'integration-' + suffix;
const contactEmail = `contact-${suffix}@example.test`;
const customLocale = 'qaa-test' + suffix.slice(0, 4);
const localeArticleSlug = 'language-' + suffix;
const localePageSlug = 'language-page-' + suffix;
let adminCookie = '',
  editorCookie = '',
  recordId = 0,
  uploadUrl = '';
let article: Record<string, unknown>;
async function request(path: string, method = 'GET', body?: unknown, cookie = '') {
  const response = await fetch(base + path, {
    method,
    redirect: 'manual',
    headers: {
      ...(body ? { 'Content-Type': 'application/json' } : {}),
      ...(cookie ? { Cookie: cookie } : {}),
      Origin: base,
    },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  const data = await response.json().catch(() => null);
  return { response, data };
}
async function account(role: 'admin' | 'editor') {
  const email = `${role}-${suffix}@example.test`;
  const password = randomUUID() + '!Aa8';
  const { user } = await auth.api.createUser({
    body: { name: `Integration ${role}`, email, password, role },
  });
  createdUsers.push(user.id);
  const { response, data } = await request('/api/auth/sign-in/email', 'POST', { email, password });
  assert.equal(response.status, 200, `Sign in failed: ${JSON.stringify(data)}`);
  return response.headers
    .getSetCookie()
    .map((value) => value.split(';')[0])
    .join('; ');
}
before(async () => {
  adminCookie = await account('admin');
  editorCookie = await account('editor');
});
after(async () => {
  await getPool().query('DELETE FROM articles WHERE slug = $1', [articleSlug]);
  await getPool().query('DELETE FROM articles WHERE slug = $1', [localeArticleSlug]);
  await getPool().query('DELETE FROM pages WHERE slug = $1', [localePageSlug]);
  await getPool().query('DELETE FROM content_languages WHERE code = $1', [customLocale]);
  await getPool().query('DELETE FROM contact_messages WHERE email = $1', [contactEmail]);
  for (const id of createdUsers) await getPool().query('DELETE FROM "user" WHERE id = $1', [id]);
  if (uploadUrl)
    await unlink((process.env.MEDIA_DIR || '.data/media') + '/' + uploadUrl.split('/').pop()).catch(
      () => {},
    );
  await getPool().end();
});

test('role permissions grant user management only to administrators', () => {
  assert.equal(adminRole.authorize({ user: ['create', 'list'] }).success, true);
  assert.equal(adminRole.authorize({ content: ['publish', 'delete'] }).success, true);
  assert.equal(editorRole.authorize({ user: ['create'] }).success, false);
  assert.equal(editorRole.authorize({ content: ['publish'] }).success, false);
});
test('all administration APIs reject unauthenticated requests', async () => {
  for (const path of [
    '/api/admin/stats',
    '/api/admin/content/articles',
    '/api/admin/messages',
    '/api/admin/users',
    '/api/admin/media',
    '/api/admin/languages',
  ])
    assert.equal((await request(path)).response.status, 401, path);
});
test('private registration is disabled and editor cannot manage users', async () => {
  assert.equal(
    (await request('/api/admin/users', 'GET', undefined, editorCookie)).response.status,
    403,
  );
  const result = await request('/api/auth/sign-up/email', 'POST', {
    name: 'Blocked',
    email: `blocked-${suffix}@example.test`,
    password: randomUUID(),
  });
  assert.notEqual(result.response.status, 200);
});

test('administrators configure runtime languages and partial saves preserve other translations', async () => {
  const catalogue = await request('/api/languages');
  assert.equal(catalogue.response.status, 200);
  for (const code of ['zh', 'es', 'en', 'hi', 'ar', 'ru', 'ja', 'de', 'tr'])
    assert.ok(
      catalogue.data.some((item: { code: string }) => item.code === code),
      code,
    );
  const language = {
    code: customLocale,
    name: 'Integration language',
    nativeName: 'Integration',
    direction: 'rtl',
    enabled: true,
    sort: 999,
  };
  assert.equal(
    (await request('/api/admin/languages', 'PUT', language, editorCookie)).response.status,
    403,
  );
  assert.equal(
    (await request('/api/admin/languages', 'PUT', { ...language, code: '../bad' }, adminCookie))
      .response.status,
    400,
  );
  assert.equal(
    (await request('/api/admin/languages', 'PUT', language, adminCookie)).response.status,
    200,
  );
  const created = await request(
    '/api/admin/content/articles',
    'POST',
    {
      slug: localeArticleSlug,
      status: 'published',
      translations: {
        en: { title: 'English fixture' },
        [customLocale]: { title: 'Custom language fixture', body: '<p>Translated content</p>' },
        ja: { title: '法律について' },
      },
    },
    adminCookie,
  );
  assert.equal(created.response.status, 200, JSON.stringify(created.data));
  const updated = await request(
    '/api/admin/content/articles?id=' + created.data.id,
    'PUT',
    { slug: localeArticleSlug, translations: { en: { title: 'Updated English fixture' } } },
    adminCookie,
  );
  assert.equal(updated.response.status, 200);
  assert.equal(updated.data.translations[customLocale].title, 'Custom language fixture');
  assert.equal(updated.data.translations.ja.title, '法律について');
  const publicRows = await request('/api/content/articles?locale=' + customLocale);
  assert.equal(
    publicRows.data.find((row: { slug: string }) => row.slug === localeArticleSlug).title,
    'Custom language fixture',
  );
  const articlePage = await fetch(base + '/' + customLocale + '/blog/' + localeArticleSlug);
  assert.equal(articlePage.status, 200);
  assert.ok((await articlePage.text()).includes('Custom language fixture'));
  const page = await request(
    '/api/admin/content/pages',
    'POST',
    {
      slug: localePageSlug,
      active: true,
      translations: {
        [customLocale]: {
          title: 'Custom public page',
          body: '<p>Public page translation</p><script>bad()</script>',
        },
      },
    },
    adminCookie,
  );
  assert.equal(page.response.status, 200);
  assert.equal(
    (
      await request(
        '/api/admin/content/pages',
        'POST',
        { slug: 'law', translations: { en: { title: 'Reserved path' } } },
        adminCookie,
      )
    ).response.status,
    400,
  );
  const publicPage = await fetch(base + '/' + customLocale + '/' + localePageSlug);
  assert.equal(publicPage.status, 200);
  const html = await publicPage.text();
  assert.ok(html.includes('Custom public page'));
  assert.ok(html.includes('dir="rtl"'));
  assert.ok(!html.includes('<script>bad()'));
  assert.equal(
    (await request('/api/admin/languages', 'PUT', { ...language, enabled: false }, adminCookie))
      .response.status,
    200,
  );
  assert.equal(
    (await request('/api/content/articles?locale=' + customLocale)).response.status,
    400,
  );
  assert.equal((await fetch(base + '/' + customLocale)).status, 404);
  assert.equal(
    (
      await getPool().query(
        'SELECT title FROM article_translations WHERE article_id = $1 AND locale = $2',
        [created.data.id, customLocale],
      )
    ).rows[0].title,
    'Custom language fixture',
  );
  const english = catalogue.data.find((item: { code: string }) => item.code === 'en');
  assert.equal(
    (await request('/api/admin/languages', 'PUT', { ...english, enabled: false }, adminCookie))
      .response.status,
    400,
  );
});
test('admin creates bilingual draft, strips executable HTML, and keeps it private', async () => {
  article = {
    slug: articleSlug,
    // These defaults are also sent by the shared content editor.
    name: '',
    email: '',
    phone: '',
    photo: '',
    sort: 0,
    icon: 'scale',
    active: true,
    status: 'draft',
    featured: false,
    categoryId: null,
    attorneyId: null,
    coverImage: '/assets/images/article.webp',
    readingMinutes: 4,
    translations: {
      en: {
        title: 'Integration article',
        excerpt: 'A test excerpt',
        body: '<h2>Overview</h2><p onclick="alert(1)">Safe content</p><script>alert(1)</script><a href="javascript:alert(1)">Bad link</a>',
      },
      tr: {
        title: 'Entegrasyon makalesi',
        excerpt: 'Bir test açıklaması',
        body: '<h2>Genel bakış</h2><p>Türkçe metin.</p>',
      },
    },
  };
  const result = await request('/api/admin/content/articles', 'POST', article, adminCookie);
  assert.equal(result.response.status, 200, JSON.stringify(result.data));
  recordId = result.data.id;
  assert.doesNotMatch(result.data.translations.en.body, /script|onclick|javascript:/i);
  assert.equal(
    (await request('/api/content/articles?locale=en')).data.some(
      (a: { slug: string }) => a.slug === articleSlug,
    ),
    false,
  );
});
test('editors may submit a draft for review but cannot publish or delete', async () => {
  const review = await request(
    '/api/admin/content/articles?id=' + recordId,
    'PUT',
    { ...article, status: 'review' },
    editorCookie,
  );
  assert.equal(review.response.status, 200, JSON.stringify(review.data));
  assert.equal(
    (
      await request(
        '/api/admin/content/articles?id=' + recordId,
        'PUT',
        { ...article, status: 'published' },
        editorCookie,
      )
    ).response.status,
    403,
  );
  assert.equal(
    (await request('/api/admin/content/articles?id=' + recordId, 'DELETE', undefined, editorCookie))
      .response.status,
    403,
  );
});
test('publishing exposes the correct translations and preserves the first publication date', async () => {
  const published = await request(
    '/api/admin/content/articles?id=' + recordId,
    'PUT',
    { ...article, status: 'published' },
    adminCookie,
  );
  assert.equal(published.response.status, 200, JSON.stringify(published.data));
  for (const [locale, expected] of [
    ['en', 'Integration article'],
    ['tr', 'Entegrasyon makalesi'],
  ]) {
    const publicRecord = (await request('/api/content/articles?locale=' + locale)).data.find(
      (a: { slug: string }) => a.slug === articleSlug,
    );
    assert.equal(publicRecord.title, expected);
  }
  const updated = await request(
    '/api/admin/content/articles?id=' + recordId,
    'PUT',
    { ...article, status: 'published' },
    adminCookie,
  );
  assert.equal(updated.data.publishedAt, published.data.publishedAt);
  assert.equal(
    (
      await request(
        '/api/admin/content/articles?id=' + recordId,
        'PUT',
        { ...article, status: 'draft' },
        editorCookie,
      )
    ).response.status,
    403,
  );
});
test('duplicate slugs, invalid fields and unknown resources are rejected', async () => {
  assert.equal(
    (await request('/api/admin/content/articles', 'POST', article, adminCookie)).response.status,
    409,
  );
  assert.equal(
    (
      await request(
        '/api/admin/content/articles',
        'POST',
        { ...article, slug: '../../escape' },
        adminCookie,
      )
    ).response.status,
    400,
  );
  assert.equal((await request('/api/content/unknown')).response.status, 404);
});
test('cross-origin writes are rejected', async () => {
  const response = await fetch(base + '/api/admin/content/articles', {
    method: 'POST',
    headers: {
      Cookie: adminCookie,
      Origin: 'https://untrusted.example',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(article),
  });
  assert.equal(response.status, 403);
});
test('contact consent, persistence, rate limit and read status work end to end', async () => {
  const payload = {
    name: 'Integration Visitor',
    email: contactEmail,
    subject: 'Integration enquiry',
    message: 'A test message long enough for validation.',
    locale: 'en',
  };
  assert.equal((await request('/api/contact', 'POST', payload)).response.status, 400);
  assert.equal(
    (await request('/api/contact', 'POST', { ...payload, consent: true })).response.status,
    200,
  );
  assert.equal(
    (await request('/api/contact', 'POST', { ...payload, consent: true })).response.status,
    429,
  );
  const message = (await request('/api/admin/messages', 'GET', undefined, adminCookie)).data.find(
    (m: { email: string }) => m.email === contactEmail,
  );
  assert.ok(message);
  assert.equal(message.read_at, null);
  assert.equal(
    (await request('/api/admin/messages', 'PATCH', { id: message.id, read: true }, editorCookie))
      .response.status,
    200,
  );
  const row = await getPool().query('SELECT read_at FROM contact_messages WHERE id = $1', [
    message.id,
  ]);
  assert.ok(row.rows[0].read_at);
});
test('media upload validates contents and requires configured remote storage', async (t) => {
  if (process.env.UPLOADTHING_TOKEN || process.env.NUXT_UPLOADTHING_TOKEN)
    return t.skip('Live uploads are excluded from integration tests.');
  const body = new FormData();
  body.append(
    'file',
    new Blob([await readFile('public/assets/images/article.webp')], { type: 'image/webp' }),
    'test.webp',
  );
  const response = await fetch(base + '/api/admin/media', {
    method: 'POST',
    headers: { Cookie: adminCookie, Origin: base },
    body,
  });
  const data = await response.json();
  assert.equal(response.status, 503, JSON.stringify(data));
  assert.match(data.statusMessage, /UPLOADTHING_TOKEN/);
  const invalid = new FormData();
  invalid.append('file', new Blob(['<script>alert(1)</script>']), 'fake.png');
  assert.equal(
    (
      await fetch(base + '/api/admin/media', {
        method: 'POST',
        headers: { Cookie: adminCookie, Origin: base },
        body: invalid,
      })
    ).status,
    400,
  );
});
test('AI without credentials returns a configuration error without fabricating output', async (t) => {
  if (process.env.AI_GATEWAY_API_KEY && process.env.AI_MODEL)
    return t.skip('Live AI calls are excluded from integration tests.');
  const result = await request(
    '/api/admin/ai',
    'POST',
    { action: 'draft', prompt: 'A test topic', title: '', content: '', locale: 'tr' },
    adminCookie,
  );
  assert.equal(result.response.status, 503);
  assert.match(result.data.statusMessage, /AI_GATEWAY_API_KEY/);
});
test('deleting an article removes all translations and public output', async () => {
  assert.equal(
    (await request('/api/admin/content/articles?id=' + recordId, 'DELETE', undefined, adminCookie))
      .response.status,
    200,
  );
  assert.equal(
    (await request('/api/content/articles?locale=en')).data.some(
      (a: { slug: string }) => a.slug === articleSlug,
    ),
    false,
  );
  assert.equal(
    (await getPool().query('SELECT id FROM article_translations WHERE article_id = $1', [recordId]))
      .rowCount,
    0,
  );
});
