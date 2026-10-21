const siteUrl = process.env.NUXT_PUBLIC_SITE_URL || 'http://localhost:3000';

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  modules: ['@nuxt/ui', '@nuxtjs/i18n', '@nuxt/image', '@nuxtjs/seo'],

  css: ['~/assets/css/main.css'],

  app: {
    head: {
      title: 'Lexviora — Legal & Advisory',
      htmlAttrs: { lang: 'en' },
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'A modern law firm — legal & advisory services.' },
      ],
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

  i18n: {
    baseUrl: siteUrl,
    defaultLocale: 'en',
    strategy: 'prefix_except_default',
    locales: [
      { code: 'en', language: 'en-US', name: 'English', file: 'en.json' },
      { code: 'tr', language: 'tr-TR', name: 'Türkçe', file: 'tr.json' },
    ],
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'i18n_redirected',
      redirectOn: 'root',
    },
  },

  nitro: {
    // Auto-run Drizzle migrations on server start (used by the Docker image).
    // Set RUN_MIGRATIONS=false to manage migrations manually.
  },
});
