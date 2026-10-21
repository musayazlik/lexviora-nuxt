import { getPool } from '../../utils/db';
import { requirePublicOrigin } from '../../utils/public-request';
import { tokenHash, tokenPattern } from '../../utils/newsletter';
import { queueContactSync, deliverOutbox } from '../../utils/plunk';
export default defineEventHandler(async (event) => {
  requirePublicOrigin(event);
  const token = (await readBody(event))?.token;
  if (typeof token !== 'string' || !tokenPattern.test(token))
    throw createError({ statusCode: 400, statusMessage: 'This unsubscribe link is invalid.' });
  const { rows } = await getPool().query(
    "UPDATE newsletter_subscribers SET status='unsubscribed',unsubscribed_at=COALESCE(unsubscribed_at,NOW()),updated_at=NOW(),confirmation_hash=NULL WHERE unsubscribe_hash=$1 RETURNING email",
    [tokenHash(token)],
  );
  if (!rows[0])
    throw createError({ statusCode: 400, statusMessage: 'This unsubscribe link is invalid.' });
  const id = await queueContactSync(rows[0].email);
  event.waitUntil(deliverOutbox(id));
  return { success: true };
});
