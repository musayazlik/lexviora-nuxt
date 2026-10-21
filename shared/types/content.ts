export type ContentLocale = string;
export type Resource =
  | 'articles'
  | 'categories'
  | 'practice-areas'
  | 'attorneys'
  | 'faqs'
  | 'glossary'
  | 'pages'
  | 'tags';
export type Translation = Record<string, string | string[] | null>;
export interface ContentRecord {
  id: number;
  slug?: string;
  name?: string;
  status?: 'draft' | 'review' | 'published';
  featured?: boolean;
  commentsEnabled?: boolean;
  scheduledAt?: string | null;
  tagIds?: number[];
  active?: boolean;
  coverImage?: string | null;
  photo?: string | null;
  email?: string | null;
  phone?: string | null;
  icon?: string;
  sort?: number;
  categoryId?: number | null;
  attorneyId?: number | null;
  readingMinutes?: number | null;
  publishedAt?: string | null;
  createdAt?: string;
  updatedAt?: string;
  translations: Partial<Record<ContentLocale, Translation>>;
}
export interface PublicRecord extends Omit<ContentRecord, 'translations'> {
  availableLocales?: ContentLocale[];
  title: string;
  excerpt: string;
  body: string;
  role: string;
  area: string;
  bio: string;
  question: string;
  answer: string;
  term: string;
  definition: string;
  categoryName?: string;
  attorneyName?: string;
  topics?: string[];
  tags?: { id: number; slug: string; name: string }[];
}
