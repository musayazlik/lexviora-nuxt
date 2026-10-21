import { requireStaff } from '../../../utils/admin';
import { isOpenRouterConfigured, listTextAndImageModels } from '../../../utils/openrouter';
import { getAiSettings } from '../../../utils/settings';
export default defineEventHandler(async (event) => {
  await requireStaff(event);
  const defaults = await getAiSettings();
  if (!isOpenRouterConfigured()) return { text: [], image: [], defaults, configured: false };
  try {
    return { ...(await listTextAndImageModels()), defaults, configured: true };
  } catch {
    throw createError({
      statusCode: 502,
      statusMessage: 'OpenRouter model list could not be loaded.',
    });
  }
});
