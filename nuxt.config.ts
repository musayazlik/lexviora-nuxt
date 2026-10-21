const siteUrl =
  process.env.NUXT_PUBLIC_SITE_URL || process.env.NUXT_SITE_URL || 'http://localhost:3000';

export default defineNuxtConfig({
  buildDir: process.env.NUXT_BUILD_DIR || '.nuxt',
  watch: [],
  ignore: ['**/.nuxt-production/**'],
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  modules: ['@nuxt/ui', '@nuxtjs/i18n', '@nuxt/image', '@nuxtjs/seo'],

  css: ['~/assets/css/main.css', '~/assets/css/admin.css', '~/assets/css/content-languages.css', '~/assets/css/blog-editor.css'],
  ui: { fonts: false, colorMode: false },

  app: {
    head: {
      title: 'Lexviora — Legal & Advisory',
      titleTemplate: '%s',
      htmlAttrs: { lang: 'en', class: 'light', style: 'color-scheme: light' },
      meta: [{ name: 'viewport', content: 'width=device-width, initial-scale=1' }],
      link: [{ rel: 'icon', type: 'image/webp', href: '/assets/brand/lexviora-logo-navy.webp' }],
    },
  },

  runtimeConfig: {
    public: {
      siteUrl,
    },
  },

  site: {
    url: siteUrl,
    name: 'Lexviora',
  },

  // Prepared public JPEGs work for crawlers without a rendering service.
  ogImage: { enabled: false },
  schemaOrg: { enabled: false },
  seo: { automaticDefaults: false, automaticOgAndTwitterTags: false },
  sitemap: {
    autoI18n: false,
    excludeAppSources: true,
    sources: ['/api/__sitemap__/urls'],
    cacheMaxAgeSeconds: 300,
  },
  robots: {
    disallow: [
      '/admin',
      '/tr/admin',
      '/api/',
      '/search',
      '/tr/search',
      '/documentation',
      '/tr/documentation',
    ],
  },

  i18n: {
    baseUrl: siteUrl,
    defaultLocale: 'en',
    // Public routes use runtime content languages; the admin stays English.
    strategy: 'no_prefix',
    locales: [
      { code: 'en', language: 'en-US', name: 'English', file: 'en.json' },
      { code: 'tr', language: 'tr-TR', name: 'Türkçe', file: 'tr.json' },
    ],
    detectBrowserLanguage: false,
  },

  routeRules: {
    '/admin': { headers: { 'X-Robots-Tag': 'noindex, nofollow', 'Cache-Control': 'no-store' } },
    '/admin/**': { headers: { 'X-Robots-Tag': 'noindex, nofollow', 'Cache-Control': 'no-store' } },
    '/tr/admin': { headers: { 'X-Robots-Tag': 'noindex, nofollow', 'Cache-Control': 'no-store' } },
    '/tr/admin/**': {
      headers: { 'X-Robots-Tag': 'noindex, nofollow', 'Cache-Control': 'no-store' },
    },
    '/api/**': { headers: { 'X-Robots-Tag': 'noindex, nofollow' } },
    '/api/admin/**': { headers: { 'Cache-Control': 'no-store' } },
    '/search': { headers: { 'X-Robots-Tag': 'noindex, follow' } },
    '/tr/search': { headers: { 'X-Robots-Tag': 'noindex, follow' } },
    '/documentation': { headers: { 'X-Robots-Tag': 'noindex, follow' } },
    '/tr/documentation': { headers: { 'X-Robots-Tag': 'noindex, follow' } },
  },

  nitro: {
    // The node-server preset traces runtime dependencies into .output/server.
    // Auto-run Drizzle migrations on server start (used by the Docker image).
    // Set RUN_MIGRATIONS=false to manage migrations manually.
  },
});
