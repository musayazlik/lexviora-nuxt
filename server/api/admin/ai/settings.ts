import { requireStaff } from '../../../utils/admin';
import { getAiSettings, saveSetting } from '../../../utils/settings';
import { validateAiSettings } from '../../../../shared/ai-settings';
import { requireContentLanguage } from '../../../utils/languages';
export default defineEventHandler(async (event) => {
  await requireStaff(event, event.method !== 'GET');
  if (event.method === 'GET') return getAiSettings();
  if (event.method !== 'PUT') throw createError({ statusCode: 405 });
  const parsed = validateAiSettings(await readBody(event));
  if ('error' in parsed) throw createError({ statusCode: 400, statusMessage: parsed.error });
  await requireContentLanguage(parsed.data.language);
  await saveSetting('ai', parsed.data);
  return parsed.data;
});
