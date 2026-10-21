import { z } from 'zod';
import { getPool } from '../../utils/db';
import { requirePublicOrigin } from '../../utils/public-request';
import { requireContentLanguage } from '../../utils/languages';
import {
  plunkConfigured,
  enqueueMail,
  deliverOutbox,
  emailLayout,
  escapeEmail,
} from '../../utils/plunk';
import { newToken, tokenHash } from '../../utils/newsletter';
import { getNewsletterCopy } from '../../../shared/newsletter';
const input = z.object({
  email: z
    .email()
    .max(200)
    .transform((v) => v.toLowerCase()),
  name: z.string().trim().max(100).default(''),
  locale: z.string().max(35),
  consent: z.literal(true),
  website: z.string().max(0).optional(),
});
export default defineEventHandler(async (event) => {
  requirePublicOrigin(event);
  const parsed = input.safeParse(await readBody(event));
  if (!parsed.success)
    throw createError({
      statusCode: 400,
      statusMessage: 'Please check your email address and consent.',
    });
  const v = parsed.data;
  await requireContentLanguage(v.locale);
  if (!plunkConfigured())
    throw createError({
      statusCode: 503,
      statusMessage: 'Newsletter email delivery is not configured yet.',
    });
  const client = await getPool().connect();
  let outboxId: number | undefined;
  try {
    await client.query('BEGIN');
    await client.query('SELECT pg_advisory_xact_lock(hashtext($1))', ['newsletter:' + v.email]);
    const { rows } = await client.query('SELECT * FROM newsletter_subscribers WHERE email=$1', [
      v.email,
    ]);
    const existing = rows[0];
    // A uniform response avoids disclosing an email address's subscription state.
    if (existing?.status !== 'active') {
      if (existing && new Date(existing.updated_at).getTime() > Date.now() - 60000)
        throw createError({
          statusCode: 429,
          statusMessage: 'Please wait a minute before requesting another confirmation.',
        });
      const confirm = newToken(),
        unsubscribe = newToken();
      await client.query(
        `INSERT INTO newsletter_subscribers(email,name,locale,confirmation_hash,confirmation_expires_at,unsubscribe_hash) VALUES($1,$2,$3,$4,NOW()+INTERVAL '24 hours',$5) ON CONFLICT(email) DO UPDATE SET name=$2,locale=$3,status='pending',confirmation_hash=$4,confirmation_expires_at=NOW()+INTERVAL '24 hours',unsubscribe_hash=$5,consent_at=NOW(),confirmed_at=NULL,updated_at=NOW()`,
        [v.email, v.name, v.locale, tokenHash(confirm), tokenHash(unsubscribe)],
      );
      const origin =
        process.env.NUXT_PUBLIC_SITE_URL || process.env.BETTER_AUTH_URL || 'http://localhost:3000';
      const url = new URL(
        (v.locale === 'en' ? '' : '/' + v.locale) + '/newsletter/confirm',
        origin,
      );
      url.searchParams.set('token', confirm);
      const unsubscribeUrl = new URL(
        (v.locale === 'en' ? '' : '/' + v.locale) + '/newsletter/unsubscribe',
        origin,
      );
      unsubscribeUrl.searchParams.set('token', unsubscribe);
      const copy = getNewsletterCopy(v.locale);
      const body = emailLayout(
        copy.confirm,
        `<p>${escapeEmail(copy.intro)}</p><p><a href="${escapeEmail(url.href)}" style="display:inline-block;background:#24384d;color:white;padding:12px 24px;text-decoration:none">${escapeEmail(copy.confirm)}</a></p><p style="font-size:13px">${v.locale === 'tr' ? 'Bu bağlantı 24 saat geçerlidir. Talep size ait değilse bu e-postayı yok sayabilirsiniz.' : 'This link expires in 24 hours. If you did not request this subscription, you can ignore this email.'}</p><p style="font-size:12px"><a href="${escapeEmail(unsubscribeUrl.href)}">${escapeEmail(copy.unsubscribe)}</a></p>`,
        v.locale,
      );
      const queued = await client.query(
        "INSERT INTO email_outbox(kind,recipient,subject,body) VALUES('newsletter-confirmation',$1,$2,$3) RETURNING id",
        [v.email, copy.confirm + ' | Lexviora', body],
      );
      outboxId = queued.rows[0].id;
    }
    await client.query('COMMIT');
  } catch (e) {
    await client.query('ROLLBACK');
    throw e;
  } finally {
    client.release();
  }
  if (outboxId) {
    event.waitUntil(deliverOutbox(outboxId));
  }
  return { success: true, status: 'pending' };
});
