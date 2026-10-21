import { requireStaff } from '../../utils/admin';
import { getPool } from '../../utils/db';
export default defineEventHandler(async (event) => {
  await requireStaff(event);
  if (event.method === 'GET')
    return (
      await getPool().query('SELECT * FROM contact_messages ORDER BY created_at DESC LIMIT 500')
    ).rows;
  if (event.method !== 'PATCH') throw createError({ statusCode: 405 });
  const { id, read } = await readBody(event);
  if (!Number.isSafeInteger(id) || typeof read !== 'boolean')
    throw createError({ statusCode: 400 });
  await getPool().query('UPDATE contact_messages SET read_at = $1 WHERE id = $2', [
    read ? new Date() : null,
    id,
  ]);
  return { success: true };
});
