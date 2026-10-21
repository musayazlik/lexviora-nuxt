import 'dotenv/config';
import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { spawn, type ChildProcess } from 'node:child_process';
import { randomUUID } from 'node:crypto';
import { auth } from '../server/utils/auth';
import { getPool } from '../server/utils/db';
// This suite boots a production build with local providers. No billable service is used.
const suffix = randomUUID(),
  email = `provider-test-${suffix}@example.test`,
  slug = 'provider-' + suffix;
let app: ChildProcess,
  base = '',
  cookie = '',
  userId = '';
const emails: any[] = [],
  contacts: any[] = [];
const body = Array.from(
  { length: 5 },
  (_, i) => `## Section ${i + 1}\n\nClear legal information for readers.`,
).join('\n\n');
const provider = createServer(async (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  if (req.url === '/models')
    return res.end(
      JSON.stringify({
        data: [
          { id: 'test/writer', name: 'Test writer', architecture: { output_modalities: ['text'] } },
          { id: 'test/image', name: 'Test image', architecture: { output_modalities: ['image'] } },
        ],
      }),
    );
  let raw = '';
  for await (const chunk of req) raw += chunk;
  const data = JSON.parse(raw);
  if (req.url === '/v1/send') {
    emails.push(data);
    return res.end(JSON.stringify({ id: 'test-email' }));
  }
  if (req.url === '/contacts') {
    contacts.push(data);
    return res.end(JSON.stringify({ id: 'test-contact' }));
  }
  if (data.modalities)
    return res.end(
      JSON.stringify({
        choices: [
          {
            message: {
              images: [
                { image_url: { url: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAAB' } },
              ],
            },
          },
        ],
      }),
    );
  res.end(
    JSON.stringify({
      choices: [
        {
          message: {
            content: JSON.stringify({
              title: 'A clear legal perspective',
              description: 'A useful introduction to the topic.',
              content: body,
              category: 'Legal insights',
              tags: ['contracts'],
            }),
          },
        },
      ],
    }),
  );
});
const pause = () => new Promise((resolve) => setTimeout(resolve, 100));
async function until(check: () => boolean | Promise<boolean>) {
  for (let i = 0; i < 100; i++) {
    if (await check()) return;
    await pause();
  }
  throw new Error('The local test service did not become ready.');
}
async function request(path: string, method = 'GET', data?: unknown, session = '') {
  const response = await fetch(base + path, {
    method,
    headers: {
      Origin: base,
      ...(session ? { Cookie: session } : {}),
      ...(data ? { 'Content-Type': 'application/json' } : {}),
    },
    body: data ? JSON.stringify(data) : undefined,
  });
  return { status: response.status, data: await response.json() };
}
before(async () => {
  await new Promise<void>((resolve) => provider.listen(0, '127.0.0.1', resolve));
  const providerUrl = `http://127.0.0.1:${(provider.address() as { port: number }).port}`;
  // Reserve an available local port without depending on the user's dev server.
  const reservation = createServer();
  await new Promise<void>((resolve) => reservation.listen(0, '127.0.0.1', resolve));
  const port = (reservation.address() as { port: number }).port;
  await new Promise<void>((resolve) => reservation.close(() => resolve()));
  base = `http://localhost:${port}`;
  app = spawn(process.execPath, [process.env.TEST_SERVER_ENTRY || '.output/server/index.mjs'], {
    stdio: 'ignore',
    env: {
      ...process.env,
      NITRO_PORT: String(port),
      RUN_MIGRATIONS: 'false',
      BETTER_AUTH_URL: base,
      NUXT_PUBLIC_SITE_URL: base,
      OPENROUTER_API_KEY: 'local-test-only',
      OPENROUTER_BASE_URL: providerUrl,
      UPLOADTHING_TOKEN: '',
      NUXT_UPLOADTHING_TOKEN: '',
      PLUNK_API_URL: providerUrl,
      PLUNK_SECRET_KEY: 'local-test-only',
      PLUNK_FROM_EMAIL: 'sender@example.test',
      PLUNK_WEBHOOK_SECRET: 'local-webhook-test-only',
    },
  });
  await until(async () => {
    try {
      return (await fetch(base + '/api/languages')).ok;
    } catch {
      return false;
    }
  });
  const password = randomUUID() + 'Aa8!';
  const { user } = await auth.api.createUser({
    body: { name: 'Provider integration test', email: 'admin-' + email, password, role: 'admin' },
  });
  userId = user.id;
  const response = await fetch(base + '/api/auth/sign-in/email', {
    method: 'POST',
    headers: { Origin: base, 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: user.email, password }),
  });
  assert.equal(response.status, 200);
  cookie = response.headers
    .getSetCookie()
    .map((v) => v.split(';')[0])
    .join('; ');
});
after(async () => {
  app?.kill();
  provider.closeAllConnections();
  provider.close();
  await getPool().query('DELETE FROM articles WHERE slug=$1', [slug]);
  await getPool().query('DELETE FROM email_outbox WHERE recipient=$1', [email]);
  await getPool().query('DELETE FROM newsletter_subscribers WHERE email=$1', [email]);
  if (userId) await getPool().query('DELETE FROM "user" WHERE id=$1', [userId]);
  await getPool().end();
});
test('the article API returns an editable generated draft and preserves text when image storage is missing', async () => {
  const generated = await request(
    '/api/admin/ai/generate',
    'POST',
    {
      topic: 'Explain contract basics',
      language: 'en',
      style: 'informative',
      depth: 'standard',
      webSearch: false,
      model: 'test/writer',
      imageModel: 'test/image',
      categories: [],
      tags: [],
      fields: {
        title: true,
        description: true,
        content: true,
        contentImages: false,
        cover: true,
        category: true,
        tags: true,
      },
    },
    cookie,
  );
  assert.equal(generated.status, 200, JSON.stringify(generated.data));
  assert.equal(generated.data.title, 'A clear legal perspective');
  assert.match(generated.data.contentHtml, /<h2>/);
  assert.equal(generated.data.cover, null);
  assert.match(generated.data.warnings.join(' '), /cover/);
  const saved = await request(
    '/api/admin/content/articles',
    'POST',
    {
      slug,
      status: 'draft',
      translations: {
        en: {
          title: generated.data.title,
          excerpt: generated.data.description,
          body: generated.data.contentHtml,
        },
      },
    },
    cookie,
  );
  assert.equal(saved.status, 200);
  assert.equal(saved.data.status, 'draft');
  assert.match(saved.data.translations.en.body, /Clear legal information/);
});
test('newsletter signup sends a localized confirmation, then confirms and unsubscribes through the public API', async () => {
  const signup = await request('/api/newsletter/subscribe', 'POST', {
    email,
    locale: 'tr',
    consent: true,
  });
  assert.equal(signup.status, 200, JSON.stringify(signup.data));
  await until(() => emails.some((m) => m.to === email));
  const message = emails.find((m) => m.to === email);
  assert.match(message.subject, /Aboneliği onayla/);
  const confirm = message.body.match(/href="([^"]*\/newsletter\/confirm\?token=[^"]+)"/)?.[1];
  assert.ok(confirm);
  const token = new URL(confirm).searchParams.get('token');
  assert.equal((await request('/api/newsletter/confirm', 'POST', { token })).status, 200);
  await until(() => contacts.some((c) => c.email === email && c.subscribed === true));
  assert.equal(contacts.find((c) => c.subscribed === true)?.data.locale, 'tr');
  const link = message.body.match(/href="([^"]*\/newsletter\/unsubscribe\?token=[^"]+)"/)?.[1];
  assert.ok(link);
  assert.equal(
    (
      await request('/api/newsletter/unsubscribe', 'POST', {
        token: new URL(link).searchParams.get('token'),
      })
    ).status,
    200,
  );
  await until(() => contacts.some((c) => c.email === email && c.subscribed === false));
  assert.equal((await request('/api/newsletter/confirm', 'POST', { token })).status, 400);
});
test('the Plunk unsubscribe webhook authenticates requests and updates local subscription state', async () => {
  const payload = { contact: { email, subscribed: false } };
  assert.equal((await request('/api/webhooks/plunk', 'POST', payload)).status, 401);
  await getPool().query("UPDATE newsletter_subscribers SET status='active' WHERE email=$1", [
    email,
  ]);
  const response = await fetch(base + '/api/webhooks/plunk', {
    method: 'POST',
    headers: {
      Authorization: 'Bearer local-webhook-test-only',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });
  assert.equal(response.status, 200);
  assert.equal(
    (await getPool().query('SELECT status FROM newsletter_subscribers WHERE email=$1', [email]))
      .rows[0].status,
    'unsubscribed',
  );
});
