import type { PublicRecord, Resource } from '#shared/types/content';
export function usePublicContent(resource: Resource) {
  const { locale } = useI18n();
  return useFetch<PublicRecord[]>(`/api/content/${resource}`, {
    query: { locale },
    default: () => [],
  });
}
