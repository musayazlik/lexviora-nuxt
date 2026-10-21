import { publicContent } from '../../utils/content';
export default defineEventHandler(async event => {
  const locale = getQuery(event).locale === 'tr' ? 'tr' : 'en';
  return publicContent(getRouterParam(event, 'resource')!, locale);
});
