import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
export default defineEventHandler(async (event) => {
  const file = getRouterParam(event, 'file') || '';
  if (!/^[a-f0-9-]{36}\.(png|jpg|webp|gif)$/.test(file)) throw createError({ statusCode: 404 });
  let buffer;
  try {
    buffer = await readFile(resolve(process.env.MEDIA_DIR || '.data/media', file));
  } catch {
    throw createError({ statusCode: 404 });
  }
  const mime: Record<string, string> = {
    png: 'image/png',
    jpg: 'image/jpeg',
    webp: 'image/webp',
    gif: 'image/gif',
  };
  setHeader(event, 'Content-Type', mime[file.split('.').pop()!]!);
  setHeader(event, 'X-Content-Type-Options', 'nosniff');
  setHeader(event, 'Cache-Control', 'public, max-age=31536000, immutable');
  return buffer;
});
