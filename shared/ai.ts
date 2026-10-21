export type CoverRef = { assetId: number; url: string; name: string };

/**
 * Client-safe types for the AI content dialog. Shared between the panel
 * components and the /api/admin/ai routes so both sides agree on the payload
 * without importing server code into the client bundle.
 */

export type AiModelInfo = {
  id: string;
  name: string;
  context: number | null;
  /** USD per 1M tokens; null when OpenRouter reports no pricing. */
  priceIn: number | null;
  priceOut: number | null;
  free: boolean;
  /** Supports tool calling (Telegram agent). */
  tools?: boolean;
};

export const AI_STYLES = ['informative', 'conversational', 'persuasive', 'technical'] as const;
export type AiStyle = (typeof AI_STYLES)[number];
export const AI_STYLE_LABELS: Record<AiStyle, string> = {
  informative: 'Informative',
  conversational: 'Conversational',
  persuasive: 'Persuasive',
  technical: 'Technical',
};

export const AI_DEPTHS = ['concise', 'standard', 'in-depth'] as const;
export type AiDepth = (typeof AI_DEPTHS)[number];
export const AI_DEPTH_LABELS: Record<AiDepth, string> = {
  concise: 'Concise',
  standard: 'Standard',
  'in-depth': 'In-depth',
};

export const AI_LANGUAGES = ['en', 'tr', 'zh', 'es', 'hi', 'ar', 'ru', 'ja', 'de'] as const;
export type AiLanguage = string;
export const AI_LANGUAGE_LABELS: Record<AiLanguage, string> = {
  en: 'English',
  de: 'German',
  tr: 'Turkish',
  zh: 'Chinese',
  es: 'Spanish',
  hi: 'Hindi',
  ar: 'Arabic',
  ru: 'Russian',
  ja: 'Japanese',
};

export type AiFields = {
  title: boolean;
  description: boolean;
  content: boolean;
  /** Generate illustrations embedded inside the post body. Requires content. */
  contentImages: boolean;
  cover: boolean;
  category: boolean;
  tags: boolean;
};

export type AiGenerateRequest = {
  fields: AiFields;
  topic: string;
  style: AiStyle;
  depth: AiDepth;
  language: AiLanguage;
  webSearch: boolean;
  model: string;
  imageModel: string;
  categories: string[];
  tags: string[];
};

export type AiGenerateResult = {
  language?: string;
  contentHtml?: string;
  sources?: { n: number; url: string; title: string | null }[];
  title?: string;
  description?: string;
  /** Markdown; the client converts it to the editor's HTML. */
  content?: string;
  /** Exact name of an existing category, or null when nothing fits. */
  category?: string | null;
  tags: string[];
  cover: CoverRef | null;
  warnings: string[];
};
