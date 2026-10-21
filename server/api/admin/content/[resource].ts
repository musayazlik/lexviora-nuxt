import { requireStaff } from '../../../utils/admin';
import { listContent, saveContent, resourceConfig } from '../../../utils/content';
import { getPool } from '../../../utils/db';

export default defineEventHandler(async (event) => {
  const session = await requireStaff(event);
  const resource = getRouterParam(event, 'resource')!;
  const cfg = resourceConfig(resource);
  if (event.method === 'GET') return listContent(resource);
  const rawId = getQuery(event).id;
  const id = rawId === undefined ? undefined : Number(rawId);
  if (id !== undefined && (!Number.isSafeInteger(id) || id < 1))
    throw createError({ statusCode: 400, statusMessage: 'Invalid record.' });
  if (event.method === 'DELETE') {
    await requireStaff(event, true);
    if (!id) throw createError({ statusCode: 400, statusMessage: 'Select a record.' });
    const result = await getPool().query(`DELETE FROM ${cfg.table} WHERE id = $1 RETURNING id`, [
      id,
    ]);
    if (!result.rowCount)
      throw createError({ statusCode: 404, statusMessage: 'Content not found.' });
    return { success: true };
  }
  if (!['POST', 'PUT'].includes(event.method)) throw createError({ statusCode: 405 });
  const input = await readBody(event);
  if (resource === 'articles' && session.user.role !== 'admin') {
    const existing = id ? (await listContent(resource)).find((item) => item.id === id) : null;
    if (input.status === 'published' || existing?.status === 'published')
      throw createError({
        statusCode: 403,
        statusMessage: 'Only administrators can change published content.',
      });
  }
  return saveContent(resource, input, id);
});
