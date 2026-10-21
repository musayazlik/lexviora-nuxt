import 'dotenv/config';
import { before, after, test } from 'node:test';
import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { randomUUID } from 'node:crypto';
import { getPool } from '../server/utils/db';
import { newToken, tokenHash } from '../server/utils/newsletter';
const email = `mail-test-${randomUUID()}@example.test`;
const calls: { path: string; body: any }[] = [];
let reject = false;
const server = createServer(async (req, res) => {
  let raw = '';
  for await (const c of req) raw += c;
  calls.push({ path: req.url!, body: JSON.parse(raw) });
  res.setHeader('Content-Type', 'application/json');
  res.statusCode = reject ? 503 : 200;
  res.end(JSON.stringify(reject ? { error: 'Service unavailable' } : { id: 'test-contact' }));
});
let mail: typeof import('../server/utils/plunk');
before(async () => {
  await new Promise<void>((resolve) => server.listen(0, '127.0.0.1', resolve));
  process.env.PLUNK_API_URL = `http://127.0.0.1:${(server.address() as { port: number }).port}`;
  process.env.PLUNK_SECRET_KEY = 'test-only';
  process.env.PLUNK_FROM_EMAIL = 'verified@example.test';
  mail = await import('../server/utils/plunk');
});
after(async () => {
  server.closeAllConnections();
  server.close();
  await getPool().query('DELETE FROM email_outbox WHERE recipient=$1', [email]);
  await getPool().query('DELETE FROM newsletter_subscribers WHERE email=$1', [email]);
  await getPool().end();
});
test('email delivery records failures and retries without resending successful jobs', async () => {
  const id = await mail.enqueueMail(
    'test-receipt',
    email,
    'Test subject',
    mail.emailLayout('Received', '<p>Thank you.</p>'),
    'reply@example.test',
  );
  reject = true;
  await mail.deliverOutbox(id);
  let row = (await getPool().query('SELECT * FROM email_outbox WHERE id=$1', [id])).rows[0];
  assert.equal(row.status, 'failed');
  assert.equal(row.attempts, 1);
  assert.match(row.error, /503/);
  reject = false;
  await mail.deliverOutbox(id);
  row = (await getPool().query('SELECT * FROM email_outbox WHERE id=$1', [id])).rows[0];
  assert.equal(row.status, 'sent');
  assert.equal(row.attempts, 2);
  assert.equal(calls.at(-1)?.path, '/v1/send');
  assert.equal(calls.at(-1)?.body.from.email, 'verified@example.test');
  assert.equal(calls.at(-1)?.body.reply, 'reply@example.test');
  const count = calls.length;
  await mail.deliverOutbox(id);
  assert.equal(calls.length, count);
});
test('contact sync derives subscription state from the latest confirmed record', async () => {
  await getPool().query(
    "INSERT INTO newsletter_subscribers(email,status,unsubscribe_hash) VALUES($1,'pending',$2)",
    [email, tokenHash(newToken())],
  );
  await mail.deliverOutbox(await mail.queueContactSync(email));
  assert.equal(calls.at(-1)?.path, '/contacts');
  assert.equal(calls.at(-1)?.body.subscribed, false);
  await getPool().query(
    "UPDATE newsletter_subscribers SET status='active',confirmed_at=NOW() WHERE email=$1",
    [email],
  );
  await mail.deliverOutbox(await mail.queueContactSync(email));
  assert.equal(calls.at(-1)?.body.subscribed, true);
  const queued = await mail.queueContactSync(email);
  await getPool().query("UPDATE newsletter_subscribers SET status='unsubscribed' WHERE email=$1", [
    email,
  ]);
  await mail.deliverOutbox(queued);
  assert.equal(calls.at(-1)?.body.subscribed, false);
});
test('email templates escape untrusted user text', () => {
  assert.equal(
    mail.escapeEmail('<img onerror="alert(1)">'),
    '&lt;img onerror=&quot;alert(1)&quot;&gt;',
  );
  assert.ok(mail.emailLayout('<script>', '<p>Safe</p>').includes('&lt;script&gt;'));
});
test('a delivery interrupted by a server restart can be recovered after five minutes', async () => {
  const id = await mail.enqueueMail('test-receipt', email, 'Recovery test', '<p>Recovery</p>');
  await getPool().query(
    "UPDATE email_outbox SET status='sending',attempted_at=NOW()-INTERVAL '6 minutes' WHERE id=$1",
    [id],
  );
  await mail.deliverOutbox(id);
  const { rows } = await getPool().query('SELECT status,attempts FROM email_outbox WHERE id=$1', [
    id,
  ]);
  assert.equal(rows[0].status, 'sent');
  assert.equal(rows[0].attempts, 1);
});
