import { readdir, mkdir, writeFile, stat } from 'node:fs/promises';
import { resolve } from 'node:path';
import { randomUUID } from 'node:crypto';
import { requireStaff } from '../../utils/admin';
export const mediaDirectory = () => resolve(process.env.MEDIA_DIR || '.data/media');
export default defineEventHandler(async (event) => {
  await requireStaff(event);
  const dir = mediaDirectory();
  await mkdir(dir, { recursive: true });
  if (event.method === 'GET') {
    const files = await readdir(dir);
    const uploads = await Promise.all(
      files
        .filter((name) => /\.(png|jpg|webp|gif)$/.test(name))
        .map(async (name) => ({
          name,
          url: '/media/' + name,
          size: (await stat(resolve(dir, name))).size,
          bundled: false,
        })),
    );
    return [
      ...uploads,
      ...['hero', 'office', 'article', 'deniz', 'selin', 'emre'].map((name) => ({
        name: name + '.webp',
        url: '/assets/images/' + name + '.webp',
        size: 0,
        bundled: true,
      })),
    ];
  }
  if (event.method !== 'POST') throw createError({ statusCode: 405 });
  if (Number(getHeader(event, 'content-length') || 0) > 6 * 1024 * 1024)
    throw createError({ statusCode: 413, statusMessage: 'Görsel en fazla 5 MB olabilir.' });
  const parts = await readMultipartFormData(event);
  const file = parts?.find((part) => part.name === 'file');
  if (!file || file.data.length > 5 * 1024 * 1024)
    throw createError({
      statusCode: 400,
      statusMessage: 'En fazla 5 MB boyutunda bir görsel seçin.',
    });
  const hex = file.data.subarray(0, 12).toString('hex');
  const ext = hex.startsWith('89504e470d0a1a0a')
    ? 'png'
    : hex.startsWith('ffd8ff')
      ? 'jpg'
      : hex.startsWith('474946383761') || hex.startsWith('474946383961')
        ? 'gif'
        : file.data.subarray(0, 4).toString() === 'RIFF' &&
            file.data.subarray(8, 12).toString() === 'WEBP'
          ? 'webp'
          : null;
  if (!ext)
    throw createError({
      statusCode: 400,
      statusMessage: 'PNG, JPEG, WebP veya GIF görseli yükleyin.',
    });
  const name = randomUUID() + '.' + ext;
  await writeFile(resolve(dir, name), file.data, { flag: 'wx' });
  return { name, url: '/media/' + name, size: file.data.length, bundled: false };
});
