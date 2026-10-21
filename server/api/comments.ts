import { z } from 'zod';
import { getPool } from '../utils/db';
import { requireContentLanguage } from '../utils/languages';
import { requirePublicOrigin } from '../utils/public-request';
const input = z.object({
  articleId: z.number().int().positive(),
  locale: z.string().max(35),
  name: z.string().trim().min(2).max(100),
  email: z
    .email()
    .max(200)
    .transform((v) => v.toLowerCase()),
  body: z.string().trim().min(5).max(3000),
  consent: z.literal(true),
  website: z.string().max(0).optional(),
});
export default defineEventHandler(async (event) => {
  if (!['GET', 'POST'].includes(event.method)) throw createError({ statusCode: 405 });
  const values = event.method === 'POST' ? await readBody(event) : getQuery(event);
  const articleId = Number(values.articleId),
    locale = String(values.locale || 'en');
  await requireContentLanguage(locale);
  const { rows: articles } = await getPool().query(
    "SELECT a.id,a.comments_enabled FROM articles a JOIN article_translations t ON t.article_id=a.id AND t.locale=$2 WHERE a.id=$1 AND a.status='published' AND (a.scheduled_at IS NULL OR a.scheduled_at <= NOW())",
    [Number.isSafeInteger(articleId) ? articleId : 0, locale],
  );
  if (!articles[0]) throw createError({ statusCode: 404, statusMessage: 'Article not found.' });
  if (event.method === 'GET') {
    const { rows } = await getPool().query(
      'SELECT id,name,body,created_at AS "createdAt" FROM article_comments WHERE article_id=$1 AND locale=$2 AND status=\'approved\' ORDER BY created_at DESC LIMIT 100',
      [articleId, locale],
    );
    return { enabled: articles[0].comments_enabled, comments: rows };
  }
  requirePublicOrigin(event);
  if (!articles[0].comments_enabled)
    throw createError({ statusCode: 403, statusMessage: 'Comments are closed for this article.' });
  const parsed = input.safeParse(values);
  if (!parsed.success)
    throw createError({ statusCode: 400, statusMessage: 'Please check your comment and consent.' });
  const v = parsed.data;
  const pool = getPool(),
    client = await pool.connect();
  try {
    await client.query('BEGIN');
    await client.query('SELECT pg_advisory_xact_lock(hashtext($1))', ['comment:' + v.email]);
    const recent = await client.query(
      "SELECT id FROM article_comments WHERE email=$1 AND created_at > NOW()-INTERVAL '1 minute' LIMIT 1",
      [v.email],
    );
    if (recent.rowCount)
      throw createError({
        statusCode: 429,
        statusMessage: 'Please wait a minute before adding another comment.',
      });
    await client.query(
      'INSERT INTO article_comments(article_id,locale,name,email,body) VALUES($1,$2,$3,$4,$5)',
      [articleId, locale, v.name, v.email, v.body],
    );
    await client.query('COMMIT');
  } catch (e) {
    await client.query('ROLLBACK');
    throw e;
  } finally {
    client.release();
  }
  return { success: true, status: 'pending' };
});
