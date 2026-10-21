import { publicContent } from '../../utils/content';
export default defineEventHandler(async (event) => {
  const { code: locale } = await requireContentLanguage(getQuery(event).locale || 'en');
  return publicContent(getRouterParam(event, 'resource')!, locale);
});
