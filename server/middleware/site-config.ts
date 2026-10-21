// Docker receives its public domain at runtime, after the Nuxt image is built.
export default defineEventHandler((event) => {
  const config = useRuntimeConfig(event);
  const { siteUrl } = config.public;
  // Nitro provides a separate mutable runtime config for each request.
  config.public.i18n.baseUrl = siteUrl;
  updateSiteConfig(event, {
    _priority: 100,
    _context: 'lexviora-runtime',
    url: siteUrl,
    env: process.env.NUXT_SITE_ENV || (import.meta.dev ? 'development' : 'production'),
  });
});
