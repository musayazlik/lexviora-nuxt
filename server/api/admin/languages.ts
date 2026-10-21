import { requireStaff } from '../../utils/admin';
import { listLanguages, saveLanguage } from '../../utils/languages';
export default defineEventHandler(async (event) => {
  await requireStaff(event, event.method !== 'GET');
  if (event.method === 'GET') return listLanguages();
  if (!['POST', 'PUT'].includes(event.method)) throw createError({ statusCode: 405 });
  return saveLanguage(await readBody(event));
});
