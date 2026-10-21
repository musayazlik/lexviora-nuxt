import { z } from 'zod';
import { requireStaff } from '../../utils/admin';
import { auth } from '../../utils/auth';
const schema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.email(),
  password: z.string().min(12).max(128),
  role: z.enum(['admin', 'editor']),
});
export default defineEventHandler(async (event) => {
  await requireStaff(event, true);
  if (event.method === 'GET')
    return auth.api.listUsers({
      headers: event.headers,
      query: { limit: 100, sortBy: 'createdAt', sortDirection: 'desc' },
    });
  if (event.method !== 'POST') throw createError({ statusCode: 405 });
  const input = schema.safeParse(await readBody(event));
  if (!input.success)
    throw createError({
      statusCode: 400,
      statusMessage: 'Enter a name, email, role and a password of at least 12 characters.',
    });
  try {
    const result = await auth.api.createUser({ headers: event.headers, body: input.data });
    return {
      user: {
        id: result.user.id,
        name: result.user.name,
        email: result.user.email,
        role: result.user.role,
      },
    };
  } catch {
    throw createError({
      statusCode: 400,
      statusMessage: 'Unable to create the account. Check the email address and form fields.',
    });
  }
});
