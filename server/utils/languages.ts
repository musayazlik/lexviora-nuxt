import { z } from 'zod';
import { getPool } from './db';
import { localeCodePattern, reservedLocaleCodes } from '../../shared/languages';
import type { ContentLanguage } from '../../shared/languages';

export async function listLanguages(): Promise<ContentLanguage[]> {
  const { rows } = await getPool().query(
    'SELECT code, name, native_name AS "nativeName", direction, enabled, sort FROM content_languages ORDER BY sort, code',
  );
  return rows;
}

export async function requireContentLanguage(code: unknown, enabledOnly = true) {
  const language = (await listLanguages()).find(
    (item) => item.code === code && (!enabledOnly || item.enabled),
  );
  if (!language)
    throw createError({ statusCode: 400, statusMessage: 'Unknown or disabled content language.' });
  return language;
}

const languageSchema = z.object({
  code: z
    .string()
    .trim()
    .toLowerCase()
    .max(35)
    .regex(localeCodePattern)
    .refine((code) => !reservedLocaleCodes.includes(code), 'This language code is reserved.')
    .refine((code) => {
      try {
        return Intl.getCanonicalLocales(code).length === 1;
      } catch {
        return false;
      }
    }, 'Enter a valid language code.'),
  name: z.string().trim().min(2).max(80),
  nativeName: z.string().trim().min(1).max(80),
  direction: z.enum(['ltr', 'rtl']),
  enabled: z.boolean(),
  sort: z.number().int().min(0).max(1000),
});
export async function saveLanguage(input: unknown) {
  const parsed = languageSchema.safeParse(input);
  if (!parsed.success)
    throw createError({
      statusCode: 400,
      statusMessage: parsed.error.issues[0]?.message || 'Invalid language.',
    });
  const value = parsed.data;
  if (value.code === 'en' && !value.enabled)
    throw createError({
      statusCode: 400,
      statusMessage: 'English is the default website language and must stay enabled.',
    });
  await getPool().query(
    `INSERT INTO content_languages (code, name, native_name, direction, enabled, sort) VALUES ($1,$2,$3,$4,$5,$6)
     ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, native_name = EXCLUDED.native_name, direction = EXCLUDED.direction, enabled = EXCLUDED.enabled, sort = EXCLUDED.sort`,
    [value.code, value.name, value.nativeName, value.direction, value.enabled, value.sort],
  );
  return listLanguages();
}
