import { createHash, timingSafeEqual } from 'node:crypto';
import { z } from 'zod';
import { getPool } from '../../utils/db';
export default defineEventHandler(async (event) => {
  const secret = process.env.PLUNK_WEBHOOK_SECRET;
  if (!secret)
    throw createError({ statusCode: 503, statusMessage: 'Plunk webhook is not configured.' });
  const supplied = getHeader(event, 'authorization') || '';
  const hash = (v: string) => createHash('sha256').update(v).digest();
  if (!timingSafeEqual(hash(supplied), hash('Bearer ' + secret)))
    throw createError({ statusCode: 401 });
  const parsed = z
    .object({ contact: z.object({ email: z.email().max(200), subscribed: z.literal(false) }) })
    .safeParse(await readBody(event));
  if (!parsed.success)
    throw createError({ statusCode: 400, statusMessage: 'Expected an unsubscribe event.' });
  // Plunk's contact.unsubscribed workflow also covers bounces and complaints.
  // Do not echo back to Plunk: its contact is already unsubscribed.
  await getPool().query(
    "UPDATE newsletter_subscribers SET status='unsubscribed',unsubscribed_at=COALESCE(unsubscribed_at,NOW()),confirmation_hash=NULL,updated_at=NOW() WHERE email=$1 AND status <> 'unsubscribed'",
    [parsed.data.contact.email.toLowerCase()],
  );
  return { success: true };
});
