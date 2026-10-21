import { z } from 'zod';
import { requireStaff } from '../../utils/admin';
import { getMailSettings, plunkConfigured } from '../../utils/plunk';
import { uploadthingConfigured } from '../../utils/uploadthing';
import { isOpenRouterConfigured } from '../../utils/openrouter';
import { saveSetting } from '../../utils/settings';
const schema = z.object({
  senderName: z.string().trim().min(2).max(100),
  contactEmail: z.union([z.email().max(200), z.literal('')]),
  notifyContact: z.boolean(),
  acknowledgeContact: z.boolean(),
});
export default defineEventHandler(async (event) => {
  await requireStaff(event, true);
  if (event.method === 'PUT') {
    const parsed = schema.safeParse(await readBody(event));
    if (!parsed.success)
      throw createError({
        statusCode: 400,
        statusMessage: 'Check the sender name and notification email address.',
      });
    await saveSetting('mail', parsed.data);
  } else if (event.method !== 'GET') throw createError({ statusCode: 405 });
  return {
    configured: {
      openrouter: isOpenRouterConfigured(),
      uploadthing: uploadthingConfigured(),
      plunk: plunkConfigured(),
    },
    fromEmail: process.env.PLUNK_FROM_EMAIL || '',
    mail: await getMailSettings(),
  };
});
