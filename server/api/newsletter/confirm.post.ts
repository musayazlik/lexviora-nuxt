import { getPool } from '../../utils/db';
import { requirePublicOrigin } from '../../utils/public-request';
import { tokenHash, tokenPattern } from '../../utils/newsletter';
import { queueContactSync, deliverOutbox } from '../../utils/plunk';
export default defineEventHandler(async (event) => {
  requirePublicOrigin(event);
  const token = (await readBody(event))?.token;
  if (typeof token !== 'string' || !tokenPattern.test(token))
    throw createError({ statusCode: 400, statusMessage: 'This confirmation link is invalid.' });
  const { rows } = await getPool().query(
    "UPDATE newsletter_subscribers SET status='active',confirmed_at=COALESCE(confirmed_at,NOW()),updated_at=NOW(),unsubscribed_at=NULL WHERE confirmation_hash=$1 AND confirmation_expires_at>NOW() AND status IN ('pending','active') RETURNING email",
    [tokenHash(token)],
  );
  if (!rows[0])
    throw createError({
      statusCode: 400,
      statusMessage: 'This confirmation link has expired or is invalid. Please subscribe again.',
    });
  const id = await queueContactSync(rows[0].email);
  event.waitUntil(deliverOutbox(id));
  return { success: true };
});
