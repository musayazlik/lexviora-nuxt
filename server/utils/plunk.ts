import { getPool } from './db';
import { getSetting } from './settings';
export const plunkConfigured = () =>
  Boolean(process.env.PLUNK_SECRET_KEY && process.env.PLUNK_FROM_EMAIL);
export const mailDefaults = {
  senderName: 'Lexviora',
  contactEmail: '',
  notifyContact: true,
  acknowledgeContact: true,
};
export const getMailSettings = () =>
  getSetting('mail', { ...mailDefaults, contactEmail: process.env.PLUNK_CONTACT_TO_EMAIL || '' });
export const escapeEmail = (v: string) =>
  v.replace(
    /[&<>"']/g,
    (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!,
  );
export function emailLayout(heading: string, body: string, locale = 'en') {
  return `<!doctype html><html lang="${escapeEmail(locale)}" dir="${/^(ar|fa|he)(-|$)/.test(locale) ? 'rtl' : 'ltr'}"><body style="margin:0;background:#f5f6f7;color:#24384d;font:16px/1.7 Arial,sans-serif"><div style="max-width:600px;margin:32px auto;background:white;padding:40px;border-top:3px solid #92764c"><p style="font-size:24px;letter-spacing:1px">Lexviora</p><h1 style="font-size:25px">${escapeEmail(heading)}</h1>${body}<p style="margin-top:36px;color:#687381;font-size:12px">Lexviora · Legal &amp; Advisory</p></div></body></html>`;
}
async function plunk(path: string, body: unknown) {
  if (!plunkConfigured()) throw new Error('Plunk is not configured.');
  const response = await fetch(
    (process.env.PLUNK_API_URL || 'https://next-api.useplunk.com') + path,
    {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + process.env.PLUNK_SECRET_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(20000),
    },
  );
  if (!response.ok) throw new Error('Plunk request failed (' + response.status + ').');
  return response.json() as Promise<{ id?: string }>;
}
export async function enqueueMail(
  kind: string,
  recipient: string,
  subject: string,
  body: string,
  replyTo?: string,
) {
  const { rows } = await getPool().query(
    'INSERT INTO email_outbox(kind,recipient,subject,body,reply_to) VALUES($1,$2,$3,$4,$5) RETURNING id',
    [kind, recipient, subject, body, replyTo || null],
  );
  return rows[0].id as number;
}
export async function queueContactSync(email: string) {
  return enqueueMail('contact-sync', email, 'Synchronise newsletter contact', '{}');
}
export async function deliverOutbox(id: number) {
  const { rows } = await getPool().query(
    "UPDATE email_outbox SET status='sending',attempts=attempts+1,error=NULL,attempted_at=NOW() WHERE id=$1 AND (status IN ('pending','failed') OR (status='sending' AND attempted_at<NOW()-INTERVAL '5 minutes')) RETURNING *",
    [id],
  );
  const row = rows[0];
  if (!row) return;
  try {
    if (row.kind === 'contact-sync') {
      const { rows: subscribers } = await getPool().query(
        'SELECT * FROM newsletter_subscribers WHERE email=$1',
        [row.recipient],
      );
      const subscriber = subscribers[0];
      if (subscriber) {
        const contact = await plunk('/contacts', {
          email: subscriber.email,
          subscribed: subscriber.status === 'active',
          data: { name: subscriber.name, locale: subscriber.locale, source: 'lexviora-newsletter' },
        });
        if (contact.id)
          await getPool().query(
            'UPDATE newsletter_subscribers SET plunk_contact_id=$2 WHERE id=$1',
            [subscriber.id, contact.id],
          );
      }
    } else {
      const settings = await getMailSettings();
      await plunk('/v1/send', {
        to: row.recipient,
        subject: row.subject,
        body: row.body,
        from: { email: process.env.PLUNK_FROM_EMAIL, name: settings.senderName },
        ...(row.reply_to ? { reply: row.reply_to } : {}),
      });
    }
    await getPool().query("UPDATE email_outbox SET status='sent',sent_at=NOW() WHERE id=$1", [id]);
  } catch (e) {
    await getPool().query("UPDATE email_outbox SET status='failed',error=$2 WHERE id=$1", [
      id,
      e instanceof Error ? e.message.slice(0, 300) : 'Mail delivery failed.',
    ]);
  }
}
