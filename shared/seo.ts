import type { ContentLocale, ContentRecord } from './types/content';
import { languageTag, localeCodePattern, reservedLocaleCodes } from './languages';

export const seoLocales = ['en', 'tr'] as const;
export const languageTags: Record<string, string> = {
  en: 'en-US',
  tr: 'tr-TR',
  zh: 'zh-CN',
  es: 'es',
  hi: 'hi',
  ar: 'ar',
  ru: 'ru',
  ja: 'ja',
  de: 'de',
};
export const socialImages: Record<string, string> = {
  en: '/assets/social/lexviora-share-en.jpg',
  tr: '/assets/social/lexviora-share-tr.jpg',
} as const;
export const siteDescriptions: Record<string, string> & { en: string; tr: string } = {
  en: 'Lexviora offers legal and advisory services in Istanbul. Explore our practice areas, meet our lawyers and read practical legal insights.',
  tr: 'Lexviora, İstanbul merkezli hukuk ve danışmanlık hizmetleri sunar. Faaliyet alanlarımızı, avukatlarımızı ve güncel hukuk yazılarımızı keşfedin.',
};

// These overrides survive re-importing the original static templates.
export const pageSeo: Record<
  string,
  Record<ContentLocale, { title?: string; description: string }>
> = {
  index: {
    en: { title: 'Lexviora | Legal & Advisory in Istanbul', description: siteDescriptions.en },
    tr: { title: 'Lexviora | İstanbul Hukuk ve Danışmanlık', description: siteDescriptions.tr },
  },
  about: {
    en: {
      description:
        'Discover Lexviora’s approach to law: clear communication, careful preparation and personal attention to every legal matter.',
    },
    tr: {
      description:
        'Lexviora’nın hukuka yaklaşımını tanıyın: açık iletişim, özenli hazırlık ve her hukuki meseleye insan odaklı bir bakış.',
    },
  },
  'practice-areas': {
    en: {
      description:
        'Explore Lexviora’s legal services in family, corporate, employment, criminal, inheritance and real estate law.',
    },
    tr: {
      description:
        'Lexviora’nın aile, ticaret, iş, ceza, miras ve gayrimenkul hukuku alanlarındaki hizmetlerini ve çalışma yaklaşımını inceleyin.',
    },
  },
  attorneys: {
    en: {
      description:
        'Meet the Lexviora legal team. Explore our lawyers’ backgrounds, practice areas and approach to legal advice.',
    },
    tr: {
      description:
        'Lexviora avukat kadrosunu tanıyın. Ekibimizin mesleki geçmişini, çalışma alanlarını ve hukuki danışmanlık yaklaşımını keşfedin.',
    },
  },
  contact: {
    en: {
      description:
        'Contact Lexviora in Istanbul to discuss your legal questions. Find our contact details and send an enquiry to our team.',
    },
    tr: {
      description:
        'Hukuki sorularınızı değerlendirmek için İstanbul’daki Lexviora ekibiyle iletişime geçin. İletişim bilgilerimize ulaşın ve görüşme talebinizi iletin.',
    },
  },
  faq: {
    en: {
      description:
        'Find answers to common questions about legal consultations, preparing documents and working with the Lexviora team.',
    },
    tr: {
      description:
        'Hukuki danışmanlık, görüşmeye hazırlık, gerekli belgeler ve Lexviora ekibiyle çalışma süreci hakkında sık sorulan soruların yanıtları.',
    },
  },
  glossary: {
    en: {
      description:
        'Understand commonly used legal terms with Lexviora’s legal glossary. Clear explanations to help you follow legal questions and processes.',
    },
    tr: {
      description:
        'Lexviora hukuk sözlüğüyle sık kullanılan hukuki kavramları öğrenin. Hukuki konuları ve süreçleri anlamanıza yardımcı olan açık tanımlar.',
    },
  },
  'legal-guides': {
    en: {
      description:
        'Explore practical legal guides and resources from Lexviora to help you prepare documents and understand common legal processes.',
    },
    tr: {
      description:
        'Belgelerinizi hazırlamanıza ve hukuki süreçleri anlamanıza yardımcı olacak Lexviora hukuk rehberlerini ve pratik kaynaklarını inceleyin.',
    },
  },
  'home-editorial': {
    en: {
      description:
        'Read Lexviora’s featured legal insights, practical guides and considered perspectives on the legal questions that shape everyday life.',
    },
    tr: {
      description:
        'Lexviora’nın öne çıkan hukuk yazılarını, pratik rehberlerini ve günlük yaşamı etkileyen hukuki konulara dair değerlendirmelerini okuyun.',
    },
  },
  privacy: {
    en: {
      description:
        'Read how Lexviora handles personal data, contact enquiries and your privacy rights when you use this website.',
    },
    tr: {
      description:
        'Lexviora web sitesinde kişisel verilerin işlenmesi, iletişim talepleri ve gizlilik haklarınız hakkında bilgi edinin.',
    },
  },
  cookies: {
    en: {
      description:
        'Learn about the cookies used on the Lexviora website, their purposes and how to manage your cookie preferences.',
    },
    tr: {
      description:
        'Lexviora web sitesinde kullanılan çerezler, kullanım amaçları ve çerez tercihlerinizi nasıl yönetebileceğiniz hakkında bilgi edinin.',
    },
  },
};

export function unlocalizedPath(path: string): string {
  const clean = path.split(/[?#]/)[0] || '/';
  const first = clean.split('/')[1] || '';
  return (
    (localeCodePattern.test(first) && !reservedLocaleCodes.includes(first)
      ? clean.slice(first.length + 1)
      : clean
    ).replace(/\/+$/, '') || '/'
  );
}

export function localizedPath(path: string, locale: ContentLocale): string {
  const clean = unlocalizedPath(path);
  return locale !== 'en' ? `/${locale}${clean === '/' ? '' : clean}` : clean;
}

export function canonicalPath(path: string, locale: ContentLocale): string {
  let clean = unlocalizedPath(path);
  if (clean === '/blog-list' || clean === '/blog-category') clean = '/blog';
  return localizedPath(clean, locale);
}

export function isIndexablePath(path: string): boolean {
  return !/^\/(?:admin|api|search|documentation|newsletter|404)(?:\/|$)/.test(
    unlocalizedPath(path),
  );
}

export function seoText(value: string | undefined | null, limit = 170): string {
  const text = (value || '')
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/\s+/g, ' ')
    .trim();
  if (text.length <= limit) return text;
  const end = text.lastIndexOf(' ', limit - 1);
  return text.slice(0, end > limit * 0.6 ? end : limit - 1).trimEnd() + '…';
}

export function absoluteImage(
  value: string | null | undefined,
  siteUrl: string,
  locale: ContentLocale,
): string {
  try {
    const image = new URL(value || socialImages[locale] || socialImages.en!, siteUrl);
    if (['https:', 'http:'].includes(image.protocol)) return image.href;
  } catch {
    /* Invalid media URLs use the public brand card. */
  }
  return new URL(socialImages[locale] || socialImages.en!, siteUrl).href;
}

export function seoDate(value: string | null | undefined): string | undefined {
  if (!value) return undefined;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? undefined : date.toISOString();
}

export function availableContentLocales(record: ContentRecord): ContentLocale[] {
  return Object.keys(record.translations).filter((locale) =>
    Object.values(record.translations[locale] || {}).some(
      (value) => typeof value === 'string' && value.trim(),
    ),
  );
}

export interface SeoSitemapUrl {
  loc: string;
  lastmod?: string;
  alternatives: { hreflang: string; href: string }[];
}

export function sitemapEntries(
  path: string,
  locales: readonly ContentLocale[] = seoLocales,
  modified?: string | null,
): SeoSitemapUrl[] {
  const alternatives: SeoSitemapUrl['alternatives'] = locales.map((locale) => ({
    hreflang: languageTag(locale),
    href: localizedPath(path, locale),
  }));
  if (locales.includes('en'))
    alternatives.push({ hreflang: 'x-default', href: localizedPath(path, 'en') });
  return locales.map((locale) => ({
    loc: localizedPath(path, locale),
    lastmod: seoDate(modified),
    alternatives,
  }));
}
