import { publicCopy } from '#shared/public-copy';
export function usePublicCopy() {
  const { locale } = useContentLanguage();
  return computed(() => publicCopy(locale.value));
}
