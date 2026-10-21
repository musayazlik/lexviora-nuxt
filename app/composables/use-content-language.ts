import { defaultLanguages } from '#shared/languages';
import type { ContentLanguage } from '#shared/languages';
import { localizedPath, unlocalizedPath } from '#shared/seo';

export function useContentLanguages() {
  const languages = useState<ContentLanguage[]>('content-languages', () => defaultLanguages);
  return { languages };
}

export function useContentLanguage() {
  const route = useRoute();
  const { languages } = useContentLanguages();
  const locale = computed(() => String(route.params.contentLocale || 'en'));
  const language = computed(() => languages.value.find((item) => item.code === locale.value));
  return { locale, language, languages };
}

export function useContentLocalePath() {
  const { locale } = useContentLanguage();
  return (path: string, code = locale.value) => {
    if (path.startsWith('/admin')) return path;
    return localizedPath(path, code);
  };
}

export function useContentSwitchLocalePath() {
  const route = useRoute();
  return (code: string) => localizedPath(unlocalizedPath(route.path), code);
}
