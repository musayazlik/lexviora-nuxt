import type { ContentLanguage } from '#shared/languages';
export default defineNuxtPlugin(async () => {
  const { data, error } = await useFetch<ContentLanguage[]>('/api/languages', {
    key: 'website-languages',
  });
  if (error.value)
    throw createError({ statusCode: 503, statusMessage: 'Unable to load website languages.' });
  const { languages } = useContentLanguages();
  languages.value = data.value || [];
});
