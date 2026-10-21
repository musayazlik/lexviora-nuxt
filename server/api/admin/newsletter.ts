import { z } from 'zod';
import { requireStaff } from '../../utils/admin';
import { getPool } from '../../utils/db';
import { queueContactSync, deliverOutbox } from '../../utils/plunk';
export default defineEventHandler(async (event) => {
  await requireStaff(event, true);
  if (event.method === 'GET') {
    const { rows } = await getPool().query(
      'SELECT id,email,name,locale,status,consent_at,confirmed_at,unsubscribed_at,created_at,plunk_contact_id FROM newsletter_subscribers ORDER BY created_at DESC LIMIT 5000',
    );
    return rows;
  }
  const parsed = z
    .object({ id: z.number().int().positive(), action: z.enum(['unsubscribe', 'sync']) })
    .safeParse(await readBody(event));
  if (!parsed.success || event.method !== 'PATCH') throw createError({ statusCode: 400 });
  const { rows } = await getPool().query('SELECT email FROM newsletter_subscribers WHERE id=$1', [
    parsed.data.id,
  ]);
  if (!rows[0]) throw createError({ statusCode: 404 });
  if (parsed.data.action === 'unsubscribe')
    await getPool().query(
      "UPDATE newsletter_subscribers SET status='unsubscribed',unsubscribed_at=NOW(),updated_at=NOW(),confirmation_hash=NULL WHERE id=$1",
      [parsed.data.id],
    );
  const id = await queueContactSync(rows[0].email);
  await deliverOutbox(id);
  return { success: true };
});
