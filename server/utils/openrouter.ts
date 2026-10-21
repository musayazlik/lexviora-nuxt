/**
 * Server-side OpenRouter client. The API key never leaves the server: the
 * panel talks to /api/admin/ai/*, which calls these helpers. Text models are
 * listed separately from image models (output modality) so the dialog can
 * offer a dedicated picker for cover generation.
 */

const OPENROUTER_BASE = process.env.OPENROUTER_BASE_URL || 'https://openrouter.ai/api/v1';

export type OpenRouterModel = {
  id: string;
  name: string;
  context: number | null;
  priceIn: number | null;
  priceOut: number | null;
  free: boolean;
  /** Accepts tool (function) definitions — required for the Telegram agent. */
  tools: boolean;
};

function requireKey(): string {
  const key = process.env.OPENROUTER_API_KEY;
  if (!key) throw new Error('OPENROUTER_API_KEY is not configured.');
  return key;
}

function headers(key: string) {
  return {
    Authorization: `Bearer ${key}`,
    'Content-Type': 'application/json',
    // OpenRouter attribution headers; used for their dashboard rankings.
    'HTTP-Referer': process.env.NUXT_PUBLIC_SITE_URL || 'http://localhost:3000',
    'X-Title': 'Lexviora Admin',
  };
}

/** USD/token (a decimal string) → USD per 1M tokens; null when unknown. */
function perMillion(value: string | undefined): number | null {
  if (!value) return null;
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed < 0) return null;
  return parsed * 1_000_000;
}

type OpenRouterModelRow = {
  id: string;
  name: string;
  context_length?: number;
  architecture?: { output_modalities?: string[] };
  pricing?: { prompt?: string; completion?: string };
  supported_parameters?: string[];
};

let modelCache: { at: number; text: OpenRouterModel[]; image: OpenRouterModel[] } | null = null;
const MODEL_CACHE_MS = 60 * 60 * 1000;

/** Text and image model catalogues; cached in memory for an hour. */
export async function listTextAndImageModels(): Promise<{
  text: OpenRouterModel[];
  image: OpenRouterModel[];
}> {
  if (modelCache && Date.now() - modelCache.at < MODEL_CACHE_MS) return modelCache;

  const response = await fetch(`${OPENROUTER_BASE}/models`, {
    headers: headers(requireKey()),
    signal: AbortSignal.timeout(15_000),
  });
  if (!response.ok) throw new Error(`OpenRouter models request failed (${response.status}).`);

  const payload = (await response.json()) as { data?: OpenRouterModelRow[] };
  const text: OpenRouterModel[] = [];
  const image: OpenRouterModel[] = [];
  for (const row of payload.data ?? []) {
    const model: OpenRouterModel = {
      id: row.id,
      name: row.name,
      context: typeof row.context_length === 'number' ? row.context_length : null,
      priceIn: perMillion(row.pricing?.prompt),
      priceOut: perMillion(row.pricing?.completion),
      free: perMillion(row.pricing?.prompt) === 0 && perMillion(row.pricing?.completion) === 0,
      tools: row.supported_parameters?.includes('tools') ?? false,
    };
    // openrouter/* are routers that may pick any model, and *guard models are
    // safety classifiers; neither belongs in a picker for writing or drawing.
    if (row.id.startsWith('openrouter/') || /guard/i.test(row.id)) continue;
    if (row.architecture?.output_modalities?.includes('image')) image.push(model);
    else text.push(model);
  }
  const byName = (a: OpenRouterModel, b: OpenRouterModel) => a.name.localeCompare(b.name);
  text.sort(byName);
  image.sort(byName);

  modelCache = { at: Date.now(), text, image };
  return modelCache;
}

/** A web-search source the model actually grounded on (deduplicated by URL). */
export type ChatCitation = { url: string; title: string | null };

/**
 * One chat completion. Web search is OpenRouter's plugin, billed per result;
 * it uses the provider's native search when there is one (Google Search for
 * Gemini) and is skipped for models that search by themselves.
 */
export async function chatCompletion(options: {
  model: string;
  system: string;
  user: string;
  webSearch?: boolean;
  /** Results the web plugin fetches; 5 by default. */
  maxResults?: number;
  timeoutMs?: number;
  signal?: AbortSignal;
}): Promise<{ content: string; citations: ChatCitation[]; sources: ChatCitation[] }> {
  const plugin = options.webSearch && !searchesNatively(options.model);
  const response = await fetch(`${OPENROUTER_BASE}/chat/completions`, {
    method: 'POST',
    headers: headers(requireKey()),
    body: JSON.stringify({
      model: options.model,
      messages: [
        { role: 'system', content: options.system },
        { role: 'user', content: options.user },
      ],
      ...(plugin ? { plugins: [{ id: 'web', max_results: options.maxResults ?? 5 }] } : {}),
    }),
    signal: options.signal
      ? AbortSignal.any([options.signal, AbortSignal.timeout(options.timeoutMs ?? 180_000)])
      : AbortSignal.timeout(options.timeoutMs ?? 180_000),
  });
  if (!response.ok) {
    const detail = await response.text().catch(() => '');
    throw new Error(
      `OpenRouter request failed (${response.status})${detail ? `: ${detail.slice(0, 300)}` : ''}`,
    );
  }
  const payload = (await response.json()) as {
    choices?: {
      message?: {
        content?: unknown;
        annotations?: { url_citation?: { url?: unknown; title?: unknown } }[];
      };
    }[];
  };
  const message = payload.choices?.[0]?.message;
  const content = message?.content;
  if (typeof content !== 'string' || !content.trim()) {
    throw new Error('The model returned an empty response.');
  }
  // \`sources\` keeps the model's order, duplicates included: Perplexity's [n] markers point at sources[n - 1].
  const sources: ChatCitation[] = (message?.annotations ?? []).map((annotation) => {
    const url = annotation.url_citation?.url;
    const title = annotation.url_citation?.title;
    return {
      url: typeof url === 'string' && url.startsWith('http') ? url : '',
      title: typeof title === 'string' && title.trim() ? title.trim() : null,
    };
  });
  const citations: ChatCitation[] = [];
  const seen = new Set<string>();
  for (const source of sources) {
    if (!source.url || seen.has(source.url)) continue;
    seen.add(source.url);
    citations.push(source);
  }
  return { content, citations, sources };
}

/** Perplexity models search the web on their own; the web plugin would only add a second, paid search. */
export const searchesNatively = (model: string) => model.startsWith('perplexity/');

/**
 * Image generation goes through chat completions with image output modality.
 * `images` (URLs or data URLs) are sent along as the source of an edit.
 * Returns a data URL (base64) the caller uploads to storage.
 */
export async function imageGeneration(options: {
  model: string;
  prompt: string;
  images?: string[];
  timeoutMs?: number;
  signal?: AbortSignal;
}): Promise<string> {
  const content = options.images?.length
    ? [
        { type: 'text', text: options.prompt },
        ...options.images.map((url) => ({ type: 'image_url', image_url: { url } })),
      ]
    : options.prompt;
  const response = await fetch(`${OPENROUTER_BASE}/chat/completions`, {
    method: 'POST',
    headers: headers(requireKey()),
    body: JSON.stringify({
      model: options.model,
      modalities: ['image', 'text'],
      messages: [{ role: 'user', content }],
    }),
    signal: options.signal
      ? AbortSignal.any([options.signal, AbortSignal.timeout(options.timeoutMs ?? 180_000)])
      : AbortSignal.timeout(options.timeoutMs ?? 180_000),
  });
  if (!response.ok) {
    const detail = await response.text().catch(() => '');
    throw new Error(
      `OpenRouter request failed (${response.status})${detail ? `: ${detail.slice(0, 300)}` : ''}`,
    );
  }
  const payload = (await response.json()) as {
    choices?: { message?: { images?: { image_url?: { url?: unknown } }[] } }[];
  };
  const url = payload.choices?.[0]?.message?.images?.[0]?.image_url?.url;
  if (typeof url !== 'string' || !url.startsWith('data:')) {
    throw new Error('The image model returned no image.');
  }
  return url;
}

export const isOpenRouterConfigured = () => Boolean(process.env.OPENROUTER_API_KEY);
