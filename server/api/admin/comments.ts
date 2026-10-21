import { z } from 'zod';
import { requireStaff } from '../../utils/admin';
import { getPool } from '../../utils/db';
export default defineEventHandler(async (event) => {
  await requireStaff(event, event.method !== 'GET');
  if (event.method === 'GET') {
    const { rows } = await getPool().query(
      `SELECT c.*, a.slug, COALESCE(t.title,a.slug) AS "articleTitle" FROM article_comments c JOIN articles a ON a.id=c.article_id LEFT JOIN article_translations t ON t.article_id=a.id AND t.locale=c.locale ORDER BY c.created_at DESC LIMIT 2000`,
    );
    return rows;
  }
  const parsed = z
    .object({
      id: z.number().int().positive(),
      status: z.enum(['pending', 'approved', 'rejected', 'spam']).optional(),
    })
    .safeParse(await readBody(event));
  if (!parsed.success) throw createError({ statusCode: 400 });
  let result;
  if (event.method === 'PATCH' && parsed.data.status)
    result = await getPool().query(
      'UPDATE article_comments SET status=$2 WHERE id=$1 RETURNING id',
      [parsed.data.id, parsed.data.status],
    );
  else if (event.method === 'DELETE')
    result = await getPool().query('DELETE FROM article_comments WHERE id=$1 RETURNING id', [
      parsed.data.id,
    ]);
  else throw createError({ statusCode: 405 });
  if (!result.rowCount) throw createError({ statusCode: 404 });
  return { success: true };
});
