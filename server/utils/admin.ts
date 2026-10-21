import type { H3Event } from 'h3';
import { auth } from './auth';

export async function requireStaff(event: H3Event, adminOnly = false) {
  const session = await auth.api.getSession({ headers: event.headers });
  if (!session?.user)
    throw createError({ statusCode: 401, statusMessage: 'Please sign in to continue.' });
  if (
    !['admin', 'editor'].includes(session.user.role || '') ||
    (adminOnly && session.user.role !== 'admin')
  ) {
    throw createError({
      statusCode: 403,
      statusMessage: 'You do not have permission to perform this action.',
    });
  }
  if (!['GET', 'HEAD'].includes(event.method)) {
    const origin = getHeader(event, 'origin');
    const expected = new Set(
      [process.env.BETTER_AUTH_URL, process.env.NUXT_PUBLIC_SITE_URL].filter(Boolean),
    );
    if (origin && !expected.has(origin))
      throw createError({ statusCode: 403, statusMessage: 'Invalid request origin.' });
  }
  return session;
}
