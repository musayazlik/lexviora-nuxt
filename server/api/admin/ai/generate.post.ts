import { z } from 'zod';
import { requireStaff } from '../../../utils/admin';
import { requireContentLanguage } from '../../../utils/languages';
import { getAiSettings } from '../../../utils/settings';
import {
  imageGeneration,
  isOpenRouterConfigured,
  listTextAndImageModels as listModels,
} from '../../../utils/openrouter';
import { writePost, insertInlineImages, markdownToHtml } from '../../../utils/ai-writer';
import { uploadMedia } from '../../../utils/uploadthing';
import { cleanHtml } from '../../../utils/content';
import { AI_DEPTHS, AI_STYLES } from '../../../../shared/ai';
const running = new Set<string>();
const schema = z.object({
  topic: z.string().trim().min(3).max(4000),
  language: z.string().max(35),
  style: z.enum(AI_STYLES),
  depth: z.enum(AI_DEPTHS),
  webSearch: z.boolean(),
  model: z.string().min(1).max(120),
  imageModel: z.string().max(120),
  fields: z.object({
    title: z.boolean(),
    description: z.boolean(),
    content: z.boolean(),
    contentImages: z.boolean(),
    cover: z.boolean(),
    category: z.boolean(),
    tags: z.boolean(),
  }),
  categories: z.array(z.string().max(200)).max(200),
  tags: z.array(z.string().max(200)).max(300),
  current: z
    .object({
      title: z.string().max(250),
      excerpt: z.string().max(5000),
      content: z.string().max(100000),
    })
    .optional(),
});
export default defineEventHandler(async (event) => {
  const session = await requireStaff(event);
  if (!isOpenRouterConfigured())
    throw createError({
      statusCode: 503,
      statusMessage: 'Add OPENROUTER_API_KEY to enable the writing assistant.',
    });
  const parsed = schema.safeParse(await readBody(event));
  if (!parsed.success || !Object.values(parsed.data?.fields || {}).some(Boolean))
    throw createError({ statusCode: 400, statusMessage: 'Choose fields and enter a topic.' });
  const input = parsed.data;
  await requireContentLanguage(input.language);
  if (input.fields.contentImages && !input.fields.content)
    throw createError({
      statusCode: 400,
      statusMessage: 'Article images require article content.',
    });
  if (running.has(session.user.id))
    throw createError({ statusCode: 429, statusMessage: 'A generation is already running.' });
  running.add(session.user.id);
  const controller = new AbortController();
  const onClose = () => {
    if (!event.node.res.writableEnded) controller.abort();
  };
  event.node.res.once('close', onClose);
  const timer = setTimeout(() => controller.abort(), 540000);
  try {
    const models = await listModels();
    if (
      !models.text.some((m) => m.id === input.model) ||
      ((input.fields.cover || input.fields.contentImages) &&
        !models.image.some((m) => m.id === input.imageModel))
    )
      throw createError({ statusCode: 400, statusMessage: 'Choose an available model.' });
    const defaults = await getAiSettings();
    const result = await writePost(
      {
        ...input,
        researchModel: defaults.researchModel,
        inlineCitations: defaults.inlineCitations,
      },
      controller.signal,
    );
    let cover = null;
    const images: { url: string; alt: string }[] = [];
    async function generateImage(prompt: string, name: string) {
      const raw = await imageGeneration({
        model: input.imageModel,
        prompt: `${prompt}. Editorial image for Lexviora, a legal and advisory publication. Refined navy and warm gold palette, natural light, no text, no logos.`,
        signal: controller.signal,
      });
      const match = /^data:(image\/(?:png|jpeg|webp));base64,([A-Za-z0-9+/=]+)$/.exec(raw);
      if (!match || match[2]!.length > 12_000_000) throw new Error('Invalid generated image.');
      return uploadMedia(Buffer.from(match[2]!, 'base64'), name + '.png', session.user.id);
    }
    if (input.fields.contentImages)
      for (const [i, prompt] of result.imagePrompts.slice(0, 2).entries()) {
        try {
          const image = await generateImage(prompt, 'article-illustration-' + (i + 1));
          images.push({ url: image.url, alt: prompt.slice(0, 200) });
        } catch {
          if (controller.signal.aborted) throw new Error('Generation cancelled.');
          result.warnings.push(
            `Article image ${i + 1} could not be created or uploaded. Text is available.`,
          );
        }
      }
    if (input.fields.cover) {
      try {
        const image = await generateImage(
          `Wide cover photograph illustrating: ${result.title || input.topic}`,
          'article-cover',
        );
        cover = { assetId: image.assetId, url: image.url, name: image.name };
      } catch {
        if (controller.signal.aborted) throw new Error('Generation cancelled.');
        result.warnings.push(
          'The cover could not be created or uploaded. Choose one from the media library.',
        );
      }
    }
    const content = result.content ? insertInlineImages(result.content, images) : undefined;
    return {
      ...result,
      content,
      contentHtml: content ? cleanHtml(markdownToHtml(content)) : undefined,
      cover,
      language: input.language,
    };
  } catch (error) {
    if (controller.signal.aborted)
      throw createError({ statusCode: 499, statusMessage: 'Generation cancelled or timed out.' });
    if (error && typeof error === 'object' && 'statusCode' in error) throw error;
    console.error(
      '[blog-ai]',
      error instanceof Error ? error.message.slice(0, 400) : 'Generation failed',
    );
    throw createError({
      statusCode: 502,
      statusMessage:
        'The writing service could not complete this request. Check the model and try again.',
    });
  } finally {
    clearTimeout(timer);
    event.node.res.off('close', onClose);
    running.delete(session.user.id);
  }
});
