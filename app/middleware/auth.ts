/**
 * Route guard for the admin area. Runs on the server during SSR too,
 * so unauthenticated visitors never receive the dashboard HTML.
 */
import type { SessionUser } from '~/composables/use-auth';
export default defineNuxtRouteMiddleware(async (to) => {
  const localePath = useContentLocalePath();
  const requestFetch = useRequestFetch();
  let session;
  try {
    session = await requestFetch<{ user?: SessionUser | null }>('/api/auth/get-session');
  } catch {
    throw createError({
      statusCode: 503,
      statusMessage: 'The session service is unavailable. Please try again.',
    });
  }
  const staffUser = useState<SessionUser | null>('staff-user', () => null);
  staffUser.value = session?.user || null;
  if (!session?.user) {
    return navigateTo({ path: localePath('/admin/login'), query: { redirect: to.fullPath } });
  }
  if (!['admin', 'editor'].includes(session.user.role || ''))
    throw createError({ statusCode: 403, statusMessage: 'You do not have access to this area.' });
  if (/\/admin\/(?:users|languages|newsletter|integrations)(?:\/|$)/.test(to.path) && session.user.role !== 'admin')
    throw createError({
      statusCode: 403,
      statusMessage: 'Only administrators can access this area.',
    });
});
