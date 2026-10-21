import { z } from 'zod';
import sanitizeHtml from 'sanitize-html';
import { getPool } from './db';
import type {
  ContentRecord,
  Resource,
  ContentLocale,
  PublicRecord,
} from '../../shared/types/content';
import { availableContentLocales } from '../../shared/seo';

const registry = {
  articles: {
    table: 'articles',
    translations: 'article_translations',
    fk: 'article_id',
    base: [
      'slug',
      'status',
      'featured',
      'categoryId',
      'attorneyId',
      'coverImage',
      'readingMinutes',
    ],
    text: ['title', 'excerpt', 'body'],
  },
  categories: {
    table: 'categories',
    translations: 'category_translations',
    fk: 'category_id',
    base: ['slug', 'sort'],
    text: ['name'],
  },
  'practice-areas': {
    table: 'practice_areas',
    translations: 'practice_area_translations',
    fk: 'area_id',
    base: ['slug', 'icon', 'sort'],
    text: ['title', 'excerpt', 'body', 'topics'],
  },
  attorneys: {
    table: 'attorneys',
    translations: 'attorney_translations',
    fk: 'attorney_id',
    base: ['slug', 'name', 'photo', 'email', 'phone', 'active', 'sort'],
    text: ['role', 'area', 'bio'],
  },
  faqs: {
    table: 'faqs',
    translations: 'faq_translations',
    fk: 'faq_id',
    base: ['sort'],
    text: ['question', 'answer'],
  },
  glossary: {
    table: 'glossary_terms',
    translations: 'glossary_term_translations',
    fk: 'term_id',
    base: ['slug', 'sort'],
    text: ['term', 'definition'],
  },
} as const;
export function resourceConfig(value: string) {
  if (!Object.hasOwn(registry, value))
    throw createError({ statusCode: 404, statusMessage: 'İçerik türü bulunamadı.' });
  return registry[value as Resource];
}
const snake = (value: string) => value.replace(/[A-Z]/g, (c) => '_' + c.toLowerCase());
const camel = (value: string) => value.replace(/_([a-z])/g, (_, c: string) => c.toUpperCase());
export const cleanHtml = (value: string) =>
  sanitizeHtml(value, {
    allowedTags: [...sanitizeHtml.defaults.allowedTags, 'img', 'h1', 'h2', 's', 'u'],
    allowedAttributes: {
      a: ['href', 'target', 'rel'],
      img: ['src', 'alt', 'width', 'height'],
      '*': ['id'],
    },
    allowedSchemes: ['https', 'http', 'mailto'],
    allowProtocolRelative: false,
    transformTags: { a: sanitizeHtml.simpleTransform('a', { rel: 'noopener noreferrer' }) },
  });

export async function listContent(resource: string): Promise<ContentRecord[]> {
  const cfg = resourceConfig(resource);
  const { rows } = await getPool().query(
    `SELECT b.*, COALESCE((SELECT jsonb_object_agg(t.locale, to_jsonb(t) - 'id' - '${cfg.fk}' - 'locale') FROM ${cfg.translations} t WHERE t.${cfg.fk} = b.id), '{}'::jsonb) AS translations FROM ${cfg.table} b ORDER BY b.${resource === 'articles' ? 'updated_at DESC' : 'id ASC'} LIMIT 1000`,
  );
  return rows.map((row) =>
    Object.fromEntries(Object.entries(row).map(([k, v]) => [camel(k), v])),
  ) as unknown as ContentRecord[];
}

const slug = z
  .string()
  .min(1)
  .max(160)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'URL yalnızca küçük harf, sayı ve tire içerebilir.');
const path = z
  .string()
  .max(1500)
  .refine(
    (v) => !v || /^\/(?!\/)[\w/%.\-]+$/.test(v) || /^https:\/\//.test(v),
    'Geçerli bir görsel yolu girin.',
  );
const inputSchema = z.object({
  slug: slug.optional(),
  name: z.string().trim().min(1).max(200).optional(),
  status: z.enum(['draft', 'review', 'published']).optional(),
  featured: z.boolean().optional(),
  active: z.boolean().optional(),
  categoryId: z.number().int().positive().nullable().optional(),
  attorneyId: z.number().int().positive().nullable().optional(),
  coverImage: path.nullable().optional(),
  photo: path.nullable().optional(),
  email: z
    .union([z.email(), z.literal('')])
    .nullable()
    .optional(),
  phone: z.string().max(80).nullable().optional(),
  icon: z.string().max(80).optional(),
  sort: z.number().int().min(0).max(10000).optional(),
  readingMinutes: z.number().int().min(1).max(300).nullable().optional(),
  translations: z.object({
    en: z
      .record(z.string(), z.union([z.string().max(150000), z.array(z.string().max(500)), z.null()]))
      .optional(),
    tr: z
      .record(z.string(), z.union([z.string().max(150000), z.array(z.string().max(500)), z.null()]))
      .optional(),
  }),
});
export async function saveContent(
  resource: string,
  input: unknown,
  id?: number,
): Promise<ContentRecord> {
  const cfg = resourceConfig(resource);
  const parsed = inputSchema.safeParse(input);
  if (!parsed.success)
    throw createError({
      statusCode: 400,
      statusMessage: parsed.error.issues[0]?.message || 'Geçersiz içerik.',
    });
  const value = parsed.data;
  if (cfg.base.includes('slug' as never) && !value.slug)
    throw createError({ statusCode: 400, statusMessage: 'URL alanı zorunludur.' });
  if (resource === 'attorneys' && !value.name)
    throw createError({ statusCode: 400, statusMessage: 'Ad soyad zorunludur.' });
  const firstField = cfg.text[0];
  const translated = Object.entries(value.translations).filter(
    ([, t]) => t && String(t[firstField] || '').trim(),
  );
  if (!translated.length)
    throw createError({ statusCode: 400, statusMessage: 'En az bir dilde başlık girin.' });
  for (const [, trans] of translated) {
    if (String(trans![firstField]).length > 250)
      throw createError({
        statusCode: 400,
        statusMessage: 'Başlık en fazla 250 karakter olabilir.',
      });
  }
  const client = await getPool().connect();
  try {
    await client.query('BEGIN');
    const entries = cfg.base
      .filter((k) => value[k as keyof typeof value] !== undefined)
      .map((k) => [snake(k), value[k as keyof typeof value]] as const);
    if (resource === 'articles') {
      if (id) entries.push(['updated_at', new Date() as never]);
      else
        entries.push([
          'published_at',
          value.status === 'published' ? (new Date() as never) : (null as never),
        ]);
    }
    let result;
    if (id) {
      const assignments = entries.map(([k], i) => `${k} = $${i + 1}`);
      if (resource === 'articles')
        assignments.push(
          value.status === 'published'
            ? 'published_at = COALESCE(published_at, NOW())'
            : 'published_at = NULL',
        );
      if (!assignments.length) assignments.push('id = id');
      result = await client.query(
        `UPDATE ${cfg.table} SET ${assignments.join(', ')} WHERE id = $${entries.length + 1} RETURNING id`,
        [...entries.map(([, v]) => v), id],
      );
      if (!result.rows.length)
        throw createError({ statusCode: 404, statusMessage: 'İçerik bulunamadı.' });
    } else if (entries.length) {
      result = await client.query(
        `INSERT INTO ${cfg.table} (${entries.map(([k]) => k).join(', ')}) VALUES (${entries.map((_, i) => '$' + (i + 1)).join(', ')}) RETURNING id`,
        entries.map(([, v]) => v),
      );
    } else result = await client.query(`INSERT INTO ${cfg.table} DEFAULT VALUES RETURNING id`);
    const recordId = result.rows[0].id as number;
    await client.query(`DELETE FROM ${cfg.translations} WHERE ${cfg.fk} = $1`, [recordId]);
    for (const [locale, trans] of translated) {
      const keys = cfg.text;
      const values = keys.map((k) =>
        k === 'topics'
          ? JSON.stringify(Array.isArray(trans![k]) ? trans![k] : [])
          : ['body', 'bio', 'answer'].includes(k)
            ? cleanHtml(String(trans![k] || ''))
            : String(trans![k] || '').trim(),
      );
      await client.query(
        `INSERT INTO ${cfg.translations} (${cfg.fk}, locale, ${keys.map(snake).join(', ')}) VALUES (${[recordId, locale, ...values].map((_, i) => '$' + (i + 1)).join(', ')})`,
        [recordId, locale, ...values],
      );
    }
    await client.query('COMMIT');
    return (await listContent(resource)).find((row) => row.id === recordId)!;
  } catch (error) {
    await client.query('ROLLBACK');
    if ((error as { code?: string }).code === '23505')
      throw createError({ statusCode: 409, statusMessage: 'Bu URL zaten kullanılıyor.' });
    if ((error as { code?: string }).code === '23503')
      throw createError({
        statusCode: 400,
        statusMessage: 'Seçilen kategori veya yazar bulunamadı.',
      });
    throw error;
  } finally {
    client.release();
  }
}

export async function publicContent(
  resource: string,
  locale: ContentLocale,
): Promise<PublicRecord[]> {
  const rows = await listContent(resource);
  let categories: ContentRecord[] = [],
    attorneys: ContentRecord[] = [];
  if (resource === 'articles')
    [categories, attorneys] = await Promise.all([
      listContent('categories'),
      listContent('attorneys'),
    ]);
  return rows
    .filter((row) => resource !== 'articles' || row.status === 'published')
    .filter((row) => row.active !== false)
    .filter((row) => row.translations[locale])
    .map((row) => {
      const { translations, ...base } = row;
      const category = categories.find((c) => c.id === row.categoryId);
      const attorney = attorneys.find((a) => a.id === row.attorneyId);
      return {
        ...base,
        ...translations[locale],
        availableLocales: availableContentLocales(row),
        categoryName: String(category?.translations[locale]?.name || ''),
        attorneyName: attorney?.name || '',
      } as PublicRecord;
    });
}
