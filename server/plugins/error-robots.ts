import { getResponseStatus, setHeader } from 'h3';

export default defineNitroPlugin((nitroApp) => {
  // JSON error responses do not render the error page's robots metadata.
  nitroApp.hooks.hook('error', (_error, { event }) => {
    if (event) setHeader(event, 'X-Robots-Tag', 'noindex, nofollow');
  });
  nitroApp.hooks.hook('beforeResponse', (event) => {
    if (getResponseStatus(event) >= 400) setHeader(event, 'X-Robots-Tag', 'noindex, nofollow');
  });
});
