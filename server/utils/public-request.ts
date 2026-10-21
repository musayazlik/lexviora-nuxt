import type { H3Event } from 'h3';
export function requirePublicOrigin(event: H3Event) {
  const origin = getHeader(event, 'origin');
  if (origin && ![process.env.NUXT_PUBLIC_SITE_URL, process.env.BETTER_AUTH_URL].includes(origin)) throw createError({ statusCode: 403, statusMessage: 'Invalid request origin.' });
}
