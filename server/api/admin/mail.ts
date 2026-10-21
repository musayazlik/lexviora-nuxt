import { requireStaff } from '../../utils/admin';
import { getPool } from '../../utils/db';
import { deliverOutbox } from '../../utils/plunk';
export default defineEventHandler(async (event) => {
  await requireStaff(event, true);
  if (event.method === 'GET') {
    const { rows } = await getPool().query(
      "SELECT id,kind,recipient,subject,CASE WHEN status='sending' AND attempted_at<NOW()-INTERVAL '5 minutes' THEN 'failed' ELSE status END AS status,attempts,error,sent_at,created_at FROM email_outbox ORDER BY created_at DESC LIMIT 500",
    );
    return rows;
  }
  const id = Number((await readBody(event))?.id);
  if (event.method !== 'POST' || !Number.isSafeInteger(id) || id < 1)
    throw createError({ statusCode: 400 });
  const { rows } = await getPool().query(
    "SELECT id FROM email_outbox WHERE id=$1 AND (status IN ('pending','failed') OR (status='sending' AND attempted_at<NOW()-INTERVAL '5 minutes'))",
    [id],
  );
  if (!rows[0])
    throw createError({
      statusCode: 409,
      statusMessage: 'This delivery is already sent or in progress.',
    });
  await deliverOutbox(id);
  return { success: true };
});
