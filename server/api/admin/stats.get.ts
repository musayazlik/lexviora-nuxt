import { count, eq, isNull } from 'drizzle-orm';
import { articles, attorneys, contactMessages, practiceAreas } from '../../database/schema';
import { auth } from '../../utils/auth';
import { db } from '../../utils/db';

/**
 * Dashboard statistics for the admin panel.
 * Requires an authenticated user with the admin or editor role.
 */
export default defineEventHandler(async (event) => {
  const session = await auth.api.getSession({ headers: event.headers });

  if (!session?.user) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' });
  }
  if (session.user.role !== 'admin' && session.user.role !== 'editor') {
    throw createError({ statusCode: 403, statusMessage: 'Forbidden' });
  }

  const [totalArticles] = await db.select({ value: count() }).from(articles);
  const [publishedArticles] = await db
    .select({ value: count() })
    .from(articles)
    .where(eq(articles.status, 'published'));
  const [totalAttorneys] = await db.select({ value: count() }).from(attorneys);
  const [totalPracticeAreas] = await db.select({ value: count() }).from(practiceAreas);
  const [unreadMessages] = await db
    .select({ value: count() })
    .from(contactMessages)
    .where(isNull(contactMessages.readAt));

  return {
    articles: totalArticles?.value ?? 0,
    publishedArticles: publishedArticles?.value ?? 0,
    attorneys: totalAttorneys?.value ?? 0,
    practiceAreas: totalPracticeAreas?.value ?? 0,
    unreadMessages: unreadMessages?.value ?? 0,
  };
});
