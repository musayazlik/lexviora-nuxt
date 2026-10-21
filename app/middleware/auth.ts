/**
 * Route guard for the admin area. Runs on the server during SSR too,
 * so unauthenticated visitors never receive the dashboard HTML.
 */
export default defineNuxtRouteMiddleware(async (to) => {
  const localePath = useLocalePath();
  const requestFetch = useRequestFetch();
  try {
    const session = await requestFetch<{
      user?: { id: string; role?: string | null } | null;
    }>('/api/auth/get-session');

    if (!session?.user) {
      return navigateTo({ path: localePath('/admin/login'), query: { redirect: to.fullPath } });
    }
    if (!['admin', 'editor'].includes(session.user.role || '')) {
      throw createError({ statusCode: 403, statusMessage: 'Bu alana erişim yetkiniz yok.' });
    }
  } catch {
    return navigateTo({ path: localePath('/admin/login'), query: { redirect: to.fullPath } });
  }
});
