import type { ContentLocale } from '#shared/types/content';
import type { MaybeRefOrGetter } from 'vue';
import { languageTag } from '#shared/languages';
import {
  absoluteImage,
  canonicalPath,
  isIndexablePath,
  localizedPath,
  seoDate,
  seoText,
  siteDescriptions,
  socialImages,
  unlocalizedPath,
} from '#shared/seo';

interface PageSeoOptions {
  title?: string;
  description?: string;
  image?: string | null;
  imageAlt?: string;
  type?: 'website' | 'article' | 'profile';
  publishedAt?: string | null;
  updatedAt?: string | null;
  author?: string;
  category?: string;
  availableLocales?: ContentLocale[];
}

export function usePageSeo(input: MaybeRefOrGetter<PageSeoOptions>) {
  const route = useRoute();
  const { locale, language, languages } = useContentLanguage();
  const config = useRuntimeConfig();
  const meta = computed(() => {
    const options = toValue(input);
    const lang: ContentLocale = locale.value;
    const origin = config.public.siteUrl;
    const path = canonicalPath(route.path, lang);
    const url = new URL(path, origin).href;
    const title =
      options.title ||
      (lang === 'tr' ? 'Lexviora | Hukuk ve Danışmanlık' : 'Lexviora | Legal & Advisory');
    const description =
      seoText(options.description) || siteDescriptions[lang] || siteDescriptions.en!;
    const image = absoluteImage(options.image, origin, lang);
    const brandImage = image === new URL(socialImages[lang] || socialImages.en!, origin).href;
    const imageAlt = brandImage
      ? lang === 'tr'
        ? 'Lexviora Hukuk ve Danışmanlık — Hukuka özen. Geleceğe güven.'
        : 'Lexviora Legal & Advisory — Care in law. Trust in tomorrow.'
      : options.imageAlt || title;
    const enabledLocales = languages.value.map((item) => item.code);
    const locales = (options.availableLocales || enabledLocales).filter((code) =>
      enabledLocales.includes(code),
    );
    const indexable = isIndexablePath(route.path) && !route.query.q && !route.query.category;
    return {
      ...options,
      lang,
      origin,
      path,
      url,
      title,
      description,
      image,
      brandImage,
      imageAlt,
      locales,
      indexable,
    };
  });
  const pageLanguages = useState<{ path: string; locales: string[] } | null>(
    'page-languages',
    () => null,
  );
  watchEffect(() => {
    pageLanguages.value = { path: route.path, locales: meta.value.locales };
  });

  useRobotsRule(
    computed(() =>
      meta.value.indexable
        ? 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1'
        : 'noindex, follow',
    ),
  );

  useSeoMeta({
    title: () => meta.value.title,
    description: () => meta.value.description,
    robots: () =>
      meta.value.indexable
        ? 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1'
        : 'noindex, follow',
    ogSiteName: 'Lexviora',
    ogTitle: () => meta.value.title,
    ogDescription: () => meta.value.description,
    ogType: () => meta.value.type || 'website',
    ogUrl: () => meta.value.url,
    ogLocale: () => languageTag(meta.value.lang).replace('-', '_'),
    ogLocaleAlternate: () =>
      meta.value.locales
        .filter((lang) => lang !== meta.value.lang)
        .map((lang) => languageTag(lang).replace('-', '_')),
    ogImage: () => meta.value.image,
    ogImageSecureUrl: () => (meta.value.image.startsWith('https:') ? meta.value.image : undefined),
    ogImageAlt: () => meta.value.imageAlt,
    ogImageWidth: () => (meta.value.brandImage ? 1200 : undefined),
    ogImageHeight: () => (meta.value.brandImage ? 630 : undefined),
    ogImageType: () => (meta.value.brandImage ? 'image/jpeg' : undefined),
    twitterCard: 'summary_large_image',
    twitterTitle: () => meta.value.title,
    twitterDescription: () => meta.value.description,
    twitterImage: () => meta.value.image,
    twitterImageAlt: () => meta.value.imageAlt,
    articlePublishedTime: () =>
      meta.value.type === 'article' ? seoDate(meta.value.publishedAt) : undefined,
    articleModifiedTime: () =>
      meta.value.type === 'article' ? seoDate(meta.value.updatedAt) : undefined,
    articleAuthor: () =>
      meta.value.type === 'article' && meta.value.author ? [meta.value.author] : undefined,
    articleSection: () => (meta.value.type === 'article' ? meta.value.category : undefined),
  });

  useHead(() => {
    const m = meta.value;
    const home = new URL(localizedPath('/', m.lang), m.origin).href;
    const organizationId = new URL('/#organization', m.origin).href;
    const websiteId = new URL('/#website', m.origin).href;
    const webpageId = `${m.url}#webpage`;
    const pageName = m.title.split(' | ')[0]!;
    const graph: Record<string, unknown>[] = [
      {
        '@type': 'LegalService',
        '@id': organizationId,
        name: 'Lexviora',
        url: new URL('/', m.origin).href,
        logo: new URL('/assets/brand/lexviora-logo-navy.png', m.origin).href,
        image: absoluteImage(null, m.origin, m.lang),
      },
      {
        '@type': 'WebSite',
        '@id': websiteId,
        url: new URL('/', m.origin).href,
        name: 'Lexviora',
        publisher: { '@id': organizationId },
        inLanguage: languages.value.map((item) => languageTag(item.code)),
      },
      {
        '@type': m.type === 'profile' ? 'ProfilePage' : 'WebPage',
        '@id': webpageId,
        url: m.url,
        name: m.title,
        description: m.description,
        inLanguage: languageTag(m.lang),
        isPartOf: { '@id': websiteId },
        about: { '@id': organizationId },
        primaryImageOfPage: {
          '@type': 'ImageObject',
          url: m.image,
          ...(m.brandImage ? { width: 1200, height: 630 } : {}),
        },
      },
    ];
    if (unlocalizedPath(m.path) !== '/') {
      const crumbs = [{ name: m.lang === 'tr' ? 'Ana sayfa' : 'Home', item: home }];
      const parent = unlocalizedPath(m.path).split('/')[1];
      const labels: Record<string, string> = {
        blog: m.lang === 'tr' ? 'Hukuk günlüğü' : 'Journal',
        attorneys: m.lang === 'tr' ? 'Avukatlarımız' : 'Our lawyers',
        'practice-areas': m.lang === 'tr' ? 'Faaliyet alanları' : 'Practice areas',
      };
      if (parent && labels[parent] && unlocalizedPath(m.path).split('/').length > 2)
        crumbs.push({
          name: labels[parent],
          item: new URL(localizedPath(`/${parent}`, m.lang), m.origin).href,
        });
      crumbs.push({ name: pageName, item: m.url });
      graph.push({
        '@type': 'BreadcrumbList',
        '@id': `${m.url}#breadcrumbs`,
        itemListElement: crumbs.map((crumb, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          ...crumb,
        })),
      });
      graph[2]!.breadcrumb = { '@id': `${m.url}#breadcrumbs` };
    }
    if (m.type === 'article')
      graph.push({
        '@type': 'BlogPosting',
        '@id': `${m.url}#article`,
        headline: pageName,
        description: m.description,
        image: [m.image],
        url: m.url,
        inLanguage: languageTag(m.lang),
        mainEntityOfPage: { '@id': webpageId },
        publisher: { '@id': organizationId },
        ...(m.author ? { author: { '@type': 'Person', name: m.author } } : {}),
        datePublished: seoDate(m.publishedAt),
        dateModified: seoDate(m.updatedAt),
        articleSection: m.category || undefined,
      });
    if (m.type === 'profile') {
      graph.push({
        '@type': 'Person',
        '@id': `${m.url}#person`,
        name: pageName,
        url: m.url,
        image: m.image,
        worksFor: { '@id': organizationId },
      });
      graph[2]!.mainEntity = { '@id': `${m.url}#person` };
    }
    const alternates: { locale: ContentLocale; hreflang: string }[] = m.locales.map((lang) => ({
      locale: lang,
      hreflang: languageTag(lang),
    }));
    if (m.locales.includes('en')) alternates.push({ locale: 'en', hreflang: 'x-default' });
    const alternate = alternates.map((lang) => ({
      key: `alternate-${lang.hreflang}`,
      rel: 'alternate' as const,
      type: 'text/html',
      hreflang: lang.hreflang,
      href: new URL(canonicalPath(route.path, lang.locale), m.origin).href,
    }));
    return {
      htmlAttrs: { lang: languageTag(m.lang), dir: language.value?.direction || 'ltr' },
      link: [{ key: 'canonical', rel: 'canonical', href: m.url }, ...alternate],
      script: m.indexable
        ? [
            {
              key: 'lexviora-schema',
              type: 'application/ld+json',
              innerHTML: JSON.stringify({
                '@context': 'https://schema.org',
                '@graph': graph,
              }).replace(/</g, '\\u003c'),
            },
          ]
        : [],
    };
  });
}
