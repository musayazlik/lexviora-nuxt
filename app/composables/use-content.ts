import type { PublicRecord, Resource } from '#shared/types/content';
export function usePublicContent(resource: Resource) {
  const { locale } = useContentLanguage();
  return useFetch<PublicRecord[]>(`/api/content/${resource}`, {
    query: { locale },
    default: () => [],
  });
}
