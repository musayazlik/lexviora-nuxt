export interface ContentLanguage {
  code: string;
  name: string;
  nativeName: string;
  direction: 'ltr' | 'rtl';
  enabled: boolean;
  sort: number;
}

export const defaultLanguages: ContentLanguage[] = [
  { code: 'en', name: 'English', nativeName: 'English', direction: 'ltr', enabled: true, sort: 0 },
  { code: 'tr', name: 'Turkish', nativeName: 'Türkçe', direction: 'ltr', enabled: true, sort: 1 },
  { code: 'zh', name: 'Chinese', nativeName: '中文', direction: 'ltr', enabled: true, sort: 2 },
  { code: 'es', name: 'Spanish', nativeName: 'Español', direction: 'ltr', enabled: true, sort: 3 },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', direction: 'ltr', enabled: true, sort: 4 },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية', direction: 'rtl', enabled: true, sort: 5 },
  { code: 'ru', name: 'Russian', nativeName: 'Русский', direction: 'ltr', enabled: true, sort: 6 },
  { code: 'ja', name: 'Japanese', nativeName: '日本語', direction: 'ltr', enabled: true, sort: 7 },
  { code: 'de', name: 'German', nativeName: 'Deutsch', direction: 'ltr', enabled: true, sort: 8 },
];

// Locale-shaped prefixes are independent of the build-time i18n catalogue.
export const localeCodePattern = /^[a-z]{2,3}(?:-[a-z0-9]{2,8})*$/;
export const reservedLocaleCodes = ['api', 'faq', '404'];
export const languageTag = (code: string) =>
  ({ en: 'en-US', tr: 'tr-TR', zh: 'zh-CN' })[code] || code;
