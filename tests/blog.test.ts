import 'dotenv/config';
import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import { auth } from '../server/utils/auth';
import { getPool } from '../server/utils/db';
import { tokenHash, newToken } from '../server/utils/newsletter';
const base = process.env.TEST_BASE_URL || 'http://localhost:3000',
  suffix = randomUUID();
const email = `blog-test-${suffix}@example.test`;
let cookie = '',
  editorCookie = '',
  userId = '',
  editorId = '',
  articleId = 0,
  tagId = 0,
  commentId = 0;
const slug = 'blog-test-' + suffix;
async function request(path: string, method = 'GET', body?: unknown, session = cookie) {
  const response = await fetch(base + path, {
    method,
    headers: {
      Origin: base,
      ...(session ? { Cookie: session } : {}),
      ...(body ? { 'Content-Type': 'application/json' } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  return { status: response.status, data: await response.json() };
}
before(async () => {
  for (const role of ['admin', 'editor'] as const) {
    const password = randomUUID() + 'Aa8!';
    const { user } = await auth.api.createUser({
      body: { email: `${role}-${email}`, password, name: 'Blog test', role },
    });
    const response = await fetch(base + '/api/auth/sign-in/email', {
      method: 'POST',
      headers: { Origin: base, 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: user.email, password }),
    });
    assert.equal(response.status, 200);
    const value = response.headers
      .getSetCookie()
      .map((v) => v.split(';')[0])
      .join('; ');
    if (role === 'admin') {
      userId = user.id;
      cookie = value;
    } else {
      editorId = user.id;
      editorCookie = value;
    }
  }
});
after(async () => {
  await getPool().query('DELETE FROM articles WHERE slug=$1', [slug]);
  await getPool().query('DELETE FROM tags WHERE slug=$1', [slug]);
  await getPool().query('DELETE FROM email_outbox WHERE recipient=$1', [email]);
  await getPool().query('DELETE FROM newsletter_subscribers WHERE email=$1', [email]);
  await getPool().query('DELETE FROM "user" WHERE id=ANY($1::text[])', [[userId, editorId]]);
  await getPool().end();
});
test('new admin endpoints enforce staff and administrator roles', async () => {
  for (const path of [
    '/api/admin/comments',
    '/api/admin/newsletter',
    '/api/admin/mail',
    '/api/admin/integrations',
    '/api/admin/ai/models',
    '/api/admin/ai/settings',
  ])
    assert.equal((await request(path, 'GET', undefined, '')).status, 401, path);
  for (const path of ['/api/admin/newsletter', '/api/admin/mail', '/api/admin/integrations'])
    assert.equal((await request(path, 'GET', undefined, editorCookie)).status, 403, path);
});
test('article tags are translated, deduplicated and saved transactionally', async () => {
  const tag = await request('/api/admin/content/tags', 'POST', {
    slug,
    translations: { en: { name: 'Contract law' }, tr: { name: 'Sözleşme hukuku' } },
  });
  assert.equal(tag.status, 200, JSON.stringify(tag.data));
  tagId = tag.data.id;
  const article = await request('/api/admin/content/articles', 'POST', {
    slug,
    status: 'published',
    commentsEnabled: true,
    tagIds: [tagId, tagId],
    translations: {
      en: { title: 'Test article', excerpt: 'Test', body: '<h2>Article</h2><p>Test body</p>' },
      tr: { title: 'Test yazısı', excerpt: 'Test', body: '<p>İçerik</p>' },
    },
  });
  assert.equal(article.status, 200, JSON.stringify(article.data));
  articleId = article.data.id;
  assert.deepEqual(article.data.tagIds, [tagId]);
  const publicRows = await request('/api/content/articles?locale=tr', 'GET', undefined, '');
  assert.equal(
    publicRows.data.find((r: any) => r.id === articleId).tags[0].name,
    'Sözleşme hukuku',
  );
  const invalid = await request('/api/admin/content/articles?id=' + articleId, 'PUT', {
    ...article.data,
    tagIds: [2147483647],
  });
  assert.equal(invalid.status, 400);
  const rows = await request('/api/admin/content/articles');
  assert.deepEqual(rows.data.find((r: any) => r.id === articleId).tagIds, [tagId]);
});
test('future publication is hidden from public content and the sitemap', async () => {
  await request('/api/admin/content/articles?id=' + articleId, 'PUT', {
    slug,
    status: 'published',
    scheduledAt: new Date(Date.now() + 86400000).toISOString(),
    translations: { en: { title: 'Scheduled test', body: '<p>Future content</p>' } },
  });
  const rows = await request('/api/content/articles?locale=en', 'GET', undefined, '');
  const scheduled = (await request('/api/admin/content/articles')).data.find(
    (r: any) => r.id === articleId,
  );
  assert.equal(scheduled.publishedAt, scheduled.scheduledAt);
  assert.equal(
    rows.data.some((r: any) => r.id === articleId),
    false,
  );
  const sitemap = await request('/api/__sitemap__/urls', 'GET', undefined, '');
  assert.equal(JSON.stringify(sitemap.data).includes('/blog/' + slug), false);
  await request('/api/admin/content/articles?id=' + articleId, 'PUT', {
    slug,
    status: 'published',
    scheduledAt: null,
    translations: { en: { title: 'Test article', body: '<p>Published</p>' } },
  });
});
test('comments require consent and moderation and never expose emails publicly', async () => {
  const comment = {
    articleId,
    locale: 'en',
    name: 'Test reader',
    email,
    body: 'A thoughtful test comment.',
    consent: true,
  };
  assert.equal(
    (await request('/api/comments', 'POST', { ...comment, consent: false }, '')).status,
    400,
  );
  assert.equal((await request('/api/comments', 'POST', comment, '')).status, 200);
  const publicBefore = await request(
    `/api/comments?articleId=${articleId}&locale=en`,
    'GET',
    undefined,
    '',
  );
  assert.equal(publicBefore.data.comments.length, 0);
  const list = await request('/api/admin/comments');
  commentId = list.data.find((c: any) => c.email === email).id;
  assert.equal(
    (
      await request(
        '/api/admin/comments',
        'PATCH',
        { id: commentId, status: 'approved' },
        editorCookie,
      )
    ).status,
    403,
  );
  assert.equal(
    (await request('/api/admin/comments', 'PATCH', { id: commentId, status: 'approved' })).status,
    200,
  );
  const publicAfter = await request(
    `/api/comments?articleId=${articleId}&locale=en`,
    'GET',
    undefined,
    '',
  );
  assert.equal(publicAfter.data.comments.length, 1);
  assert.equal(JSON.stringify(publicAfter.data).includes(email), false);
  assert.equal((await request('/api/comments', 'POST', comment, '')).status, 429);
  await request('/api/admin/content/articles?id=' + articleId, 'PUT', {
    slug,
    status: 'published',
    commentsEnabled: false,
    translations: { en: { title: 'Test article', body: '<p>Published</p>' } },
  });
  assert.equal(
    (await request('/api/comments', 'POST', { ...comment, email: 'closed-' + email }, '')).status,
    403,
  );
});
test('rich text keeps tables, colors, tasks, aligned media and trusted video while stripping executable HTML', async () => {
  const body =
    '<h2 style="text-align:center">Rich content</h2><p><span style="color:#92764c">Gold</span><mark data-color="#fff000" style="background-color:#fff000">highlight</mark><sub>2</sub></p><table><tbody><tr><th colspan="2">Header</th></tr><tr><td>Cell</td><td>Value</td></tr></tbody></table><ul data-type="taskList"><li data-type="taskItem" data-checked="true"><input type="checkbox" checked><p>Done</p></li></ul><img src="https://example.test/image.webp" width="320" data-align="right"><iframe src="https://www.youtube-nocookie.com/embed/test"></iframe><iframe src="https://evil.example/"></iframe><script>alert(1)</script><p onclick="alert(1)">Safe</p>';
  const result = await request('/api/admin/content/articles?id=' + articleId, 'PUT', {
    slug,
    status: 'published',
    translations: { en: { title: 'Rich content', body } },
  });
  assert.equal(result.status, 200);
  const html = result.data.translations.en.body;
  for (const expected of [
    '<table>',
    'colspan="2"',
    'color:#92764c',
    'background-color:#fff000',
    'data-type="taskList"',
    'disabled',
    'data-align="right"',
    'youtube-nocookie.com',
  ])
    assert.ok(html.includes(expected), expected);
  for (const forbidden of ['<script', 'onclick', 'src="https://evil.example'])
    assert.equal(html.includes(forbidden), false, forbidden);
});
test('newsletter confirmation uses expiring hashed tokens and unsubscribe is idempotent', async (t) => {
  if (process.env.PLUNK_SECRET_KEY)
    return t.skip('Live mail sync is excluded from integration tests.');
  assert.equal(
    (
      await request(
        '/api/newsletter/subscribe',
        'POST',
        { email, locale: 'en', consent: false },
        '',
      )
    ).status,
    400,
  );
  assert.equal(
    (await request('/api/newsletter/subscribe', 'POST', { email, locale: 'en', consent: true }, ''))
      .status,
    503,
  );
  const confirm = newToken(),
    unsubscribe = newToken();
  await getPool().query(
    "INSERT INTO newsletter_subscribers(email,locale,confirmation_hash,confirmation_expires_at,unsubscribe_hash) VALUES($1,'en',$2,NOW()+INTERVAL '1 hour',$3)",
    [email, tokenHash(confirm), tokenHash(unsubscribe)],
  );
  assert.equal(
    (await request('/api/newsletter/confirm', 'POST', { token: newToken() }, '')).status,
    400,
  );
  assert.equal(
    (await request('/api/newsletter/confirm', 'POST', { token: confirm }, '')).status,
    200,
  );
  assert.equal(
    (await getPool().query('SELECT status FROM newsletter_subscribers WHERE email=$1', [email]))
      .rows[0].status,
    'active',
  );
  assert.equal(
    (await request('/api/newsletter/unsubscribe', 'POST', { token: unsubscribe }, '')).status,
    200,
  );
  assert.equal(
    (await request('/api/newsletter/unsubscribe', 'POST', { token: unsubscribe }, '')).status,
    200,
  );
  assert.equal(
    (await request('/api/newsletter/confirm', 'POST', { token: confirm }, '')).status,
    400,
  );
  const list = await request('/api/admin/newsletter');
  assert.equal(JSON.stringify(list.data).includes(confirm), false);
  assert.equal(JSON.stringify(list.data).includes(tokenHash(unsubscribe)), false);
  await getPool().query(
    "UPDATE newsletter_subscribers SET status='pending',confirmation_hash=$2,confirmation_expires_at=NOW()-INTERVAL '1 minute' WHERE email=$1",
    [email, tokenHash(confirm)],
  );
  assert.equal(
    (await request('/api/newsletter/confirm', 'POST', { token: confirm }, '')).status,
    400,
  );
});
test('AI configuration endpoints report missing services without fabricating results', async (t) => {
  if (process.env.OPENROUTER_API_KEY) return t.skip('Live AI calls are excluded.');
  const catalog = await request('/api/admin/ai/models');
  assert.equal(catalog.status, 200);
  assert.equal(catalog.data.configured, false);
  assert.deepEqual(catalog.data.text, []);
  assert.equal(
    (await request('/api/admin/ai/generate', 'POST', { topic: 'Test topic' })).status,
    503,
  );
});
