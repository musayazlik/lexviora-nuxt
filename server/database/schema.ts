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

export const localeEnum = pgEnum('locale', ['en', 'tr']);
export const contentStatus = pgEnum('content_status', ['draft', 'review', 'published']);

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
    locale: localeEnum('locale').notNull(),
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
    locale: localeEnum('locale').notNull(),
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
    locale: localeEnum('locale').notNull(),
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
    locale: localeEnum('locale').notNull(),
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
    locale: localeEnum('locale').notNull(),
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
    locale: localeEnum('locale').notNull(),
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
  locale: localeEnum('locale'),
  readAt: timestamp('read_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});
