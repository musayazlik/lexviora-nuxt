import { readdir, stat } from 'node:fs/promises';
import { resolve } from 'node:path';
import { requireStaff } from '../../utils/admin';
import { getPool } from '../../utils/db';
import { uploadMedia } from '../../utils/uploadthing';
export const mediaDirectory = () => resolve(process.env.MEDIA_DIR || '.data/media');
export default defineEventHandler(async (event) => {
  const session = await requireStaff(event);
  if (event.method === 'GET') {
    const { rows } = await getPool().query(
      'SELECT id,key,url,name,mime,size,alt,created_at AS "createdAt" FROM media_assets ORDER BY created_at DESC LIMIT 1000',
    );
    const files = await readdir(mediaDirectory()).catch(() => []);
    const legacy = await Promise.all(
      files
        .filter((name) => /^[\w-]+\.(png|jpg|webp|gif)$/.test(name))
        .map(async (name) => ({
          name,
          url: '/media/' + name,
          mime: 'image/' + name.split('.').pop(),
          size: (await stat(resolve(mediaDirectory(), name))).size,
          bundled: false,
        })),
    );
    return [
      ...rows,
      ...legacy,
      ...['hero', 'office', 'article', 'deniz', 'selin', 'emre'].map((name) => ({
        name: name + '.webp',
        url: '/assets/images/' + name + '.webp',
        mime: 'image/webp',
        size: 0,
        bundled: true,
      })),
    ];
  }
  if (event.method !== 'POST') throw createError({ statusCode: 405 });
  if (Number(getHeader(event, 'content-length') || 0) > 65 * 1024 * 1024)
    throw createError({ statusCode: 413, statusMessage: 'Upload request is too large.' });
  const parts = await readMultipartFormData(event);
  const file = parts?.find((part) => part.name === 'file');
  if (!file || !file.filename)
    throw createError({ statusCode: 400, statusMessage: 'Choose a file to upload.' });
  return uploadMedia(file.data, file.filename, session.user.id);
});
