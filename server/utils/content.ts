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
import { listLanguages } from './languages';
import { localeCodePattern } from '../../shared/languages';

const registry = {
  tags: {
    table: 'tags',
    translations: 'tag_translations',
    fk: 'tag_id',
    base: ['slug', 'sort'],
    text: ['name'],
  },
  pages: {
    table: 'pages',
    translations: 'page_translations',
    fk: 'page_id',
    base: ['slug', 'active', 'sort'],
    text: ['title', 'excerpt', 'body'],
  },
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
      'commentsEnabled',
      'scheduledAt',
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
    throw createError({ statusCode: 404, statusMessage: 'Content type not found.' });
  return registry[value as Resource];
}
const snake = (value: string) => value.replace(/[A-Z]/g, (c) => '_' + c.toLowerCase());
const camel = (value: string) => value.replace(/_([a-z])/g, (_, c: string) => c.toUpperCase());
export const cleanHtml = (value: string) =>
  sanitizeHtml(value, {
    allowedTags: [
      ...sanitizeHtml.defaults.allowedTags,
      'img',
      'h1',
      'h2',
      's',
      'u',
      'mark',
      'sub',
      'sup',
      'video',
      'iframe',
      'input',
    ],
    allowedAttributes: {
      a: ['href', 'target', 'rel'],
      img: ['src', 'alt', 'width', 'height', 'data-align'],
      video: ['src', 'controls', 'preload'],
      iframe: ['src', 'width', 'height', 'allowfullscreen', 'frameborder'],
      input: ['type', 'checked', 'disabled'],
      '*': ['id', 'style', 'data-type', 'data-checked'],
      td: ['colspan', 'rowspan', 'colwidth', 'style'],
      th: ['colspan', 'rowspan', 'colwidth', 'style'],
    },
    allowedIframeHostnames: ['www.youtube-nocookie.com', 'www.youtube.com'],
    allowedStyles: {
      '*': {
        'text-align': [/^(left|right|center|justify)$/],
        color: [/^#[0-9a-f]{3,8}$/i, /^rgb\([\d\s,.]+\)$/],
        'background-color': [/^#[0-9a-f]{3,8}$/i, /^rgb\([\d\s,.]+\)$/],
        width: [/^\d+(?:px|%)$/],
        'min-width': [/^\d+px$/],
      },
    },
    exclusiveFilter: (frame) => frame.tag === 'input' && frame.attribs.type !== 'checkbox',
    allowedSchemes: ['https', 'http', 'mailto'],
    allowProtocolRelative: false,
    transformTags: {
      a: sanitizeHtml.simpleTransform('a', { rel: 'noopener noreferrer' }),
      input: sanitizeHtml.simpleTransform('input', { disabled: 'disabled' }),
    },
  });

export async function listContent(resource: string): Promise<ContentRecord[]> {
  const cfg = resourceConfig(resource);
  const { rows } = await getPool().query(
    `SELECT b.*${resource === 'articles' ? ", COALESCE((SELECT jsonb_agg(tag_id) FROM article_tags WHERE article_id = b.id), '[]'::jsonb) AS tag_ids" : ''}, COALESCE((SELECT jsonb_object_agg(t.locale, to_jsonb(t) - 'id' - '${cfg.fk}' - 'locale') FROM ${cfg.translations} t WHERE t.${cfg.fk} = b.id), '{}'::jsonb) AS translations FROM ${cfg.table} b ORDER BY b.${resource === 'articles' ? 'updated_at DESC' : 'id ASC'} LIMIT 1000`,
  );
  return rows.map((row) =>
    Object.fromEntries(Object.entries(row).map(([k, v]) => [camel(k), v])),
  ) as unknown as ContentRecord[];
}

const slug = z
  .string()
  .min(1)
  .max(160)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Use lowercase letters, numbers and hyphens for the URL.');
const path = z
  .string()
  .max(1500)
  .refine(
    (v) => !v || /^\/(?!\/)[\w/%.\-]+$/.test(v) || /^https:\/\//.test(v),
    'Enter a valid image URL.',
  );
const inputSchema = z.object({
  slug: slug.optional(),
  name: z.string().trim().min(1).max(200).optional(),
  status: z.enum(['draft', 'review', 'published']).optional(),
  featured: z.boolean().optional(),
  commentsEnabled: z.boolean().optional(),
  scheduledAt: z.iso.datetime({ offset: true }).nullable().optional(),
  tagIds: z.array(z.number().int().positive()).max(50).optional(),
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
  translations: z.record(
    z.string().max(35),
    z.record(z.string(), z.union([z.string().max(150000), z.array(z.string().max(500)), z.null()])),
  ),
});
export async function saveContent(
  resource: string,
  input: unknown,
  id?: number,
): Promise<ContentRecord> {
  const cfg = resourceConfig(resource);
  // Shared editor forms carry defaults for several content types. Validate
  // only the fields belonging to this resource before writing the record.
  const candidate =
    input && typeof input === 'object' && !Array.isArray(input)
      ? (input as Record<string, unknown>)
      : {};
  const allowed = [...cfg.base, 'translations', ...(resource === 'articles' ? ['tagIds'] : [])];
  const payload = Object.fromEntries(
    allowed.filter((key) => Object.hasOwn(candidate, key)).map((key) => [key, candidate[key]]),
  );
  const parsed = inputSchema.safeParse(payload);
  if (!parsed.success)
    throw createError({
      statusCode: 400,
      statusMessage: parsed.error.issues[0]?.message || 'Invalid content.',
    });
  const value = parsed.data;
  const languages = await listLanguages();
  if (Object.keys(value.translations).some((code) => !languages.some((item) => item.code === code)))
    throw createError({
      statusCode: 400,
      statusMessage: 'Add this content language in Languages before saving a translation.',
    });
  if (cfg.base.includes('slug' as never) && !value.slug)
    throw createError({ statusCode: 400, statusMessage: 'A URL slug is required.' });
  if (
    resource === 'pages' &&
    value.slug &&
    ((localeCodePattern.test(value.slug) && value.slug !== 'faq') ||
      ['admin', 'api', 'media', '404'].includes(value.slug))
  )
    throw createError({
      statusCode: 400,
      statusMessage: 'This page address is reserved. Choose a longer, descriptive slug.',
    });
  if (resource === 'attorneys' && !value.name)
    throw createError({ statusCode: 400, statusMessage: 'A full name is required.' });
  const firstField = cfg.text[0];
  const translated = Object.entries(value.translations).filter(
    ([, t]) => t && String(t[firstField] || '').trim(),
  );
  if (!translated.length)
    throw createError({
      statusCode: 400,
      statusMessage: 'Enter a title in at least one language.',
    });
  for (const [, trans] of translated) {
    if (String(trans![firstField]).length > 250)
      throw createError({
        statusCode: 400,
        statusMessage: 'The title must be no longer than 250 characters.',
      });
  }
  const client = await getPool().connect();
  try {
    await client.query('BEGIN');
    const entries = cfg.base
      .filter((k) => value[k as keyof typeof value] !== undefined)
      .map((k) => [snake(k), value[k as keyof typeof value]] as const);
    if (resource === 'articles') {
      const existing = id
        ? (
            await client.query(
              'SELECT status,scheduled_at,published_at FROM articles WHERE id=$1 FOR UPDATE',
              [id],
            )
          ).rows[0]
        : null;
      const status = value.status ?? existing?.status ?? 'draft';
      const scheduledAt =
        value.scheduledAt === undefined ? existing?.scheduled_at : value.scheduledAt;
      const previousDate = existing?.published_at && new Date(existing.published_at);
      const publishedAt =
        status === 'published'
          ? scheduledAt
            ? new Date(scheduledAt)
            : previousDate && previousDate <= new Date()
              ? previousDate
              : new Date()
          : null;
      entries.push(['published_at', publishedAt as never]);
      if (id) entries.push(['updated_at', new Date() as never]);
    }
    let result;
    if (id) {
      const assignments = entries.map(([k], i) => `${k} = $${i + 1}`);
      if (!assignments.length) assignments.push('id = id');
      result = await client.query(
        `UPDATE ${cfg.table} SET ${assignments.join(', ')} WHERE id = $${entries.length + 1} RETURNING id`,
        [...entries.map(([, v]) => v), id],
      );
      if (!result.rows.length)
        throw createError({ statusCode: 404, statusMessage: 'Content not found.' });
    } else if (entries.length) {
      result = await client.query(
        `INSERT INTO ${cfg.table} (${entries.map(([k]) => k).join(', ')}) VALUES (${entries.map((_, i) => '$' + (i + 1)).join(', ')}) RETURNING id`,
        entries.map(([, v]) => v),
      );
    } else result = await client.query(`INSERT INTO ${cfg.table} DEFAULT VALUES RETURNING id`);
    const recordId = result.rows[0].id as number;
    if (resource === 'articles' && value.tagIds !== undefined) {
      await client.query('DELETE FROM article_tags WHERE article_id = $1', [recordId]);
      for (const tagId of new Set(value.tagIds))
        await client.query('INSERT INTO article_tags (article_id, tag_id) VALUES ($1,$2)', [
          recordId,
          tagId,
        ]);
    }
    // Only touch supplied locales. A partial update must preserve other translations.
    for (const code of Object.keys(value.translations))
      await client.query(`DELETE FROM ${cfg.translations} WHERE ${cfg.fk} = $1 AND locale = $2`, [
        recordId,
        code,
      ]);
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
      throw createError({ statusCode: 409, statusMessage: 'This URL is already in use.' });
    if ((error as { code?: string }).code === '23503')
      throw createError({
        statusCode: 400,
        statusMessage: 'The selected category or author was not found.',
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
  const enabled = (await listLanguages()).filter((item) => item.enabled).map((item) => item.code);
  let categories: ContentRecord[] = [],
    attorneys: ContentRecord[] = [],
    tags: ContentRecord[] = [];
  if (resource === 'articles')
    [categories, attorneys, tags] = await Promise.all([
      listContent('categories'),
      listContent('attorneys'),
      listContent('tags'),
    ]);
  return rows
    .filter((row) => resource !== 'articles' || row.status === 'published')
    .filter((row) => !row.scheduledAt || new Date(row.scheduledAt) <= new Date())
    .filter((row) => row.active !== false)
    .filter((row) => row.translations[locale])
    .map((row) => {
      const { translations, ...base } = row;
      const category = categories.find((c) => c.id === row.categoryId);
      const attorney = attorneys.find((a) => a.id === row.attorneyId);
      return {
        ...base,
        ...translations[locale],
        availableLocales: availableContentLocales(row).filter((code) => enabled.includes(code)),
        categoryName: String(category?.translations[locale]?.name || ''),
        attorneyName: attorney?.name || '',
        tags: tags
          .filter((tag) => row.tagIds?.includes(tag.id))
          .map((tag) => ({
            id: tag.id,
            slug: tag.slug!,
            name: String(tag.translations[locale]?.name || tag.translations.en?.name || tag.slug),
          })),
      } as PublicRecord;
    });
}
