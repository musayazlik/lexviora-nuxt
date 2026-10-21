import reference from '../../shared/data/reference.json';
export default defineEventHandler((event) => {
  const url = getRequestURL(event);
  const match = url.pathname.match(/^\/(tr\/)?([a-z0-9-]+)\.html$/);
  if (!match) return;
  const entry = (reference as Record<string, { en: { route: string } }>)[match[2]!];
  if (entry)
    return sendRedirect(
      event,
      `${match[1] ? '/tr' : ''}${entry.en.route}${url.search}${url.hash}`,
      301,
    );
});
