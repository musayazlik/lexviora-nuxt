export default defineNuxtRouteMiddleware((to) => {
  const oldAdminPath = to.path.match(/^\/[a-z]{2,3}(?:-[a-z0-9]+)*\/(admin(?:\/.*)?)$/);
  if (oldAdminPath)
    return navigateTo({ path: '/' + oldAdminPath[1], query: to.query }, { redirectCode: 301 });
  if (!to.params.contentLocale) return;
  const code = String(to.params.contentLocale);
  const { languages } = useContentLanguages();
  if (!languages.value.some((item) => item.code === code && item.enabled))
    throw createError({ statusCode: 404, statusMessage: 'Language not available.' });
  if (code === 'en')
    return navigateTo(
      { path: to.path.replace(/^\/en(?=\/|$)/, '') || '/', query: to.query, hash: to.hash },
      { redirectCode: 301 },
    );
});
