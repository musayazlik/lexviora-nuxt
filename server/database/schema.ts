import {
  boolean,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  serial,
  text,
  timestamp,
  uniqueIndex,
} from 'drizzle-orm/pg-core';
import { user } from './auth-schema';

/**
 * Content model mirrors the HTML template data (see ../../../lexviora-html-template/scripts/build.mjs).
 * Every translatable entity follows the "translation table" pattern:
 * a base table + one row per locale with a unique (entity, locale) index.
 */

export const contentStatus = pgEnum('content_status', ['draft', 'review', 'published']);

export const contentLanguages = pgTable('content_languages', {
  code: text('code').primaryKey(),
  name: text('name').notNull(),
  nativeName: text('native_name').notNull(),
  direction: text('direction').notNull().default('ltr'),
  enabled: boolean('enabled').notNull().default(true),
  sort: integer('sort').notNull().default(0),
});

export const pages = pgTable('pages', {
  id: serial('id').primaryKey(),
  slug: text('slug').notNull().unique(),
  active: boolean('active').notNull().default(true),
  sort: integer('sort').notNull().default(0),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});
export const pageTranslations = pgTable(
  'page_translations',
  {
    id: serial('id').primaryKey(),
    pageId: integer('page_id')
      .notNull()
      .references(() => pages.id, { onDelete: 'cascade' }),
    locale: text('locale').notNull(),
    title: text('title').notNull(),
    excerpt: text('excerpt'),
    body: text('body'),
  },
  (t) => [uniqueIndex('page_translations_page_locale_uq').on(t.pageId, t.locale)],
);

/* ------------------------------------------------------------------ */
/* Categories (article taxonomy: Ticaret, Aile, İş, ...)               */
/* ------------------------------------------------------------------ */

export const categories = pgTable('categories', {
  id: serial('id').primaryKey(),
  slug: text('slug').notNull().unique(),
  sort: integer('sort').notNull().default(0),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

export const categoryTranslations = pgTable(
  'category_translations',
  {
    id: serial('id').primaryKey(),
    categoryId: integer('category_id')
      .notNull()
      .references(() => categories.id, { onDelete: 'cascade' }),
    locale: text('locale').notNull(),
    name: text('name').notNull(),
  },
  (t) => [uniqueIndex('category_translations_category_locale_uq').on(t.categoryId, t.locale)],
);

/* ------------------------------------------------------------------ */
/* Attorneys                                                           */
/* ------------------------------------------------------------------ */

export const attorneys = pgTable('attorneys', {
  id: serial('id').primaryKey(),
  slug: text('slug').notNull().unique(),
  name: text('name').notNull(),
  photo: text('photo'),
  email: text('email'),
  phone: text('phone'),
  active: boolean('active').notNull().default(true),
  sort: integer('sort').notNull().default(0),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

export const attorneyTranslations = pgTable(
  'attorney_translations',
  {
    id: serial('id').primaryKey(),
    attorneyId: integer('attorney_id')
      .notNull()
      .references(() => attorneys.id, { onDelete: 'cascade' }),
    locale: text('locale').notNull(),
    role: text('role'), // "Kurucu Ortak" / "Founding Partner"
    area: text('area'), // "Ticaret & Miras Hukuku"
    bio: text('bio'),
  },
  (t) => [uniqueIndex('attorney_translations_attorney_locale_uq').on(t.attorneyId, t.locale)],
);

/* ------------------------------------------------------------------ */
/* Practice areas                                                      */
/* ------------------------------------------------------------------ */

export const practiceAreas = pgTable('practice_areas', {
  id: serial('id').primaryKey(),
  slug: text('slug').notNull().unique(),
  icon: text('icon').notNull().default('scale'),
  sort: integer('sort').notNull().default(0),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

export const practiceAreaTranslations = pgTable(
  'practice_area_translations',
  {
    id: serial('id').primaryKey(),
    areaId: integer('area_id')
      .notNull()
      .references(() => practiceAreas.id, { onDelete: 'cascade' }),
    locale: text('locale').notNull(),
    title: text('title').notNull(),
    excerpt: text('excerpt'),
    body: text('body'),
    topics: jsonb('topics').$type<string[]>().notNull().default([]),
  },
  (t) => [uniqueIndex('practice_area_translations_area_locale_uq').on(t.areaId, t.locale)],
);

/* ------------------------------------------------------------------ */
/* Articles (blog)                                                     */
/* ------------------------------------------------------------------ */

export const articles = pgTable('articles', {
  id: serial('id').primaryKey(),
  slug: text('slug').notNull().unique(),
  status: contentStatus('status').notNull().default('draft'),
  featured: boolean('featured').notNull().default(false),
  commentsEnabled: boolean('comments_enabled').notNull().default(true),
  scheduledAt: timestamp('scheduled_at', { withTimezone: true }),
  categoryId: integer('category_id').references(() => categories.id, { onDelete: 'set null' }),
  attorneyId: integer('attorney_id').references(() => attorneys.id, { onDelete: 'set null' }),
  coverImage: text('cover_image'),
  readingMinutes: integer('reading_minutes'),
  publishedAt: timestamp('published_at', { withTimezone: true }),
  createdBy: text('created_by').references(() => user.id, { onDelete: 'set null' }),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
});

export const articleTranslations = pgTable(
  'article_translations',
  {
    id: serial('id').primaryKey(),
    articleId: integer('article_id')
      .notNull()
      .references(() => articles.id, { onDelete: 'cascade' }),
    locale: text('locale').notNull(),
    title: text('title').notNull(),
    excerpt: text('excerpt'),
    body: text('body'), // rich text (HTML from TipTap)
  },
  (t) => [uniqueIndex('article_translations_article_locale_uq').on(t.articleId, t.locale)],
);

/* ------------------------------------------------------------------ */
/* FAQ                                                                 */
/* ------------------------------------------------------------------ */

export const faqs = pgTable('faqs', {
  id: serial('id').primaryKey(),
  sort: integer('sort').notNull().default(0),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

export const faqTranslations = pgTable(
  'faq_translations',
  {
    id: serial('id').primaryKey(),
    faqId: integer('faq_id')
      .notNull()
      .references(() => faqs.id, { onDelete: 'cascade' }),
    locale: text('locale').notNull(),
    question: text('question').notNull(),
    answer: text('answer').notNull(),
  },
  (t) => [uniqueIndex('faq_translations_faq_locale_uq').on(t.faqId, t.locale)],
);

/* ------------------------------------------------------------------ */
/* Glossary                                                            */
/* ------------------------------------------------------------------ */

export const glossaryTerms = pgTable('glossary_terms', {
  id: serial('id').primaryKey(),
  slug: text('slug').notNull().unique(),
  sort: integer('sort').notNull().default(0),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

export const glossaryTermTranslations = pgTable(
  'glossary_term_translations',
  {
    id: serial('id').primaryKey(),
    termId: integer('term_id')
      .notNull()
      .references(() => glossaryTerms.id, { onDelete: 'cascade' }),
    locale: text('locale').notNull(),
    term: text('term').notNull(),
    definition: text('definition').notNull(),
  },
  (t) => [uniqueIndex('glossary_term_translations_term_locale_uq').on(t.termId, t.locale)],
);

/* ------------------------------------------------------------------ */
/* Contact messages                                                    */
/* ------------------------------------------------------------------ */

export const contactMessages = pgTable('contact_messages', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull(),
  phone: text('phone'),
  subject: text('subject'),
  message: text('message').notNull(),
  locale: text('locale'),
  readAt: timestamp('read_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

export const tags = pgTable('tags', {
  id: serial('id').primaryKey(),
  slug: text('slug').notNull().unique(),
  sort: integer('sort').notNull().default(0),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});
export const tagTranslations = pgTable(
  'tag_translations',
  {
    id: serial('id').primaryKey(),
    tagId: integer('tag_id')
      .notNull()
      .references(() => tags.id, { onDelete: 'cascade' }),
    locale: text('locale').notNull(),
    name: text('name').notNull(),
  },
  (t) => [uniqueIndex('tag_translations_tag_locale_uq').on(t.tagId, t.locale)],
);
export const articleTags = pgTable(
  'article_tags',
  {
    articleId: integer('article_id')
      .notNull()
      .references(() => articles.id, { onDelete: 'cascade' }),
    tagId: integer('tag_id')
      .notNull()
      .references(() => tags.id, { onDelete: 'cascade' }),
  },
  (t) => [uniqueIndex('article_tags_article_tag_uq').on(t.articleId, t.tagId)],
);
export const articleComments = pgTable('article_comments', {
  id: serial('id').primaryKey(),
  articleId: integer('article_id')
    .notNull()
    .references(() => articles.id, { onDelete: 'cascade' }),
  locale: text('locale').notNull(),
  name: text('name').notNull(),
  email: text('email').notNull(),
  body: text('body').notNull(),
  status: text('status').notNull().default('pending'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});
export const mediaAssets = pgTable('media_assets', {
  id: serial('id').primaryKey(),
  key: text('key').notNull().unique(),
  url: text('url').notNull(),
  name: text('name').notNull(),
  mime: text('mime').notNull(),
  size: integer('size').notNull(),
  alt: text('alt').notNull().default(''),
  uploadedBy: text('uploaded_by').references(() => user.id, { onDelete: 'set null' }),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});
export const appSettings = pgTable('app_settings', {
  key: text('key').primaryKey(),
  value: jsonb('value').notNull(),
});
export const newsletterSubscribers = pgTable('newsletter_subscribers', {
  id: serial('id').primaryKey(),
  email: text('email').notNull().unique(),
  name: text('name').notNull().default(''),
  locale: text('locale').notNull().default('en'),
  status: text('status').notNull().default('pending'),
  confirmationHash: text('confirmation_hash'),
  confirmationExpiresAt: timestamp('confirmation_expires_at', { withTimezone: true }),
  unsubscribeHash: text('unsubscribe_hash').notNull(),
  plunkContactId: text('plunk_contact_id'),
  consentAt: timestamp('consent_at', { withTimezone: true }).notNull().defaultNow(),
  confirmedAt: timestamp('confirmed_at', { withTimezone: true }),
  unsubscribedAt: timestamp('unsubscribed_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
});
export const emailOutbox = pgTable('email_outbox', {
  id: serial('id').primaryKey(),
  kind: text('kind').notNull(),
  recipient: text('recipient').notNull(),
  subject: text('subject').notNull(),
  body: text('body').notNull(),
  replyTo: text('reply_to'),
  status: text('status').notNull().default('pending'),
  attempts: integer('attempts').notNull().default(0),
  error: text('error'),
  attemptedAt: timestamp('attempted_at', { withTimezone: true }),
  sentAt: timestamp('sent_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});
