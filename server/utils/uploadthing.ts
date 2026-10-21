import { UTApi } from 'uploadthing/server';
import sharp from 'sharp';
import { getPool } from './db';
export const uploadthingConfigured = () =>
  Boolean(process.env.UPLOADTHING_TOKEN || process.env.NUXT_UPLOADTHING_TOKEN);
export function mediaType(data: Buffer): string | null {
  const hex = data.subarray(0, 12).toString('hex');
  if (hex.startsWith('89504e470d0a1a0a')) return 'image/png';
  if (hex.startsWith('ffd8ff')) return 'image/jpeg';
  if (hex.startsWith('474946383761') || hex.startsWith('474946383961')) return 'image/gif';
  if (data.subarray(0, 4).toString() === 'RIFF' && data.subarray(8, 12).toString() === 'WEBP')
    return 'image/webp';
  if (hex.startsWith('1a45dfa3')) return 'video/webm';
  if (
    data.subarray(4, 8).toString() === 'ftyp' &&
    /^(isom|iso[2-9]|mp4[12]|avc1|M4V )$/.test(data.subarray(8, 12).toString())
  )
    return 'video/mp4';
  return null;
}
export async function uploadMedia(data: Buffer, name: string, userId: string, alt = '') {
  let mime = mediaType(data);
  if (!mime)
    throw createError({
      statusCode: 400,
      statusMessage: 'Choose a PNG, JPEG, WebP, GIF, MP4 or WebM file.',
    });
  const max = mime.startsWith('image/') ? 8 : 64;
  if (data.length > max * 1024 * 1024)
    throw createError({
      statusCode: 413,
      statusMessage: `This file must be no larger than ${max} MB.`,
    });
  if (!uploadthingConfigured())
    throw createError({
      statusCode: 503,
      statusMessage: 'UploadThing is not configured. Set UPLOADTHING_TOKEN on the server.',
    });
  if (mime.startsWith('image/')) {
    try {
      data = await sharp(data, { limitInputPixels: 40_000_000 })
        .rotate()
        .resize({ width: 2400, height: 2400, fit: 'inside', withoutEnlargement: true })
        .webp({ quality: 86 })
        .toBuffer();
    } catch {
      throw createError({ statusCode: 400, statusMessage: 'The image could not be decoded.' });
    }
    mime = 'image/webp';
    name = name.replace(/\.[^.]+$/, '') + '.webp';
  }
  const utapi = new UTApi({
    token: process.env.UPLOADTHING_TOKEN || process.env.NUXT_UPLOADTHING_TOKEN,
  });
  const uploaded = await utapi.uploadFiles(
    new File([new Uint8Array(data)], name.slice(0, 200), { type: mime }),
  );
  if (uploaded.error || !uploaded.data)
    throw createError({
      statusCode: 502,
      statusMessage: 'UploadThing could not store the file. Please try again.',
    });
  const file = uploaded.data;
  const { rows } = await getPool().query(
    'INSERT INTO media_assets (key,url,name,mime,size,alt,uploaded_by) VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING id,key,url,name,mime,size,alt,created_at AS "createdAt"',
    [file.key, file.ufsUrl, file.name, mime, file.size, alt.slice(0, 500), userId],
  );
  return { ...rows[0], assetId: rows[0].id, bundled: false };
}
