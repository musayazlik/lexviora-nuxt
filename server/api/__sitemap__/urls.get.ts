import reference from '../../../shared/data/reference.json';
import {
  availableContentLocales,
  canonicalPath,
  isIndexablePath,
  sitemapEntries,
} from '../../../shared/seo';
import type { SeoSitemapUrl } from '../../../shared/seo';
import { listContent } from '../../utils/content';
import { listLanguages } from '../../utils/languages';

export default defineSitemapEventHandler(async () => {
  const enabled = (await listLanguages()).filter((item) => item.enabled).map((item) => item.code);
  const paths = new Set(
    Object.values(reference)
      .map((entry) => entry.en.route)
      .filter(
        (path) =>
          isIndexablePath(path) &&
          canonicalPath(path, 'en') === path &&
          !/^\/(?:blog|attorneys|practice-areas)\//.test(path),
      ),
  );
  const urls: SeoSitemapUrl[] = [...paths].flatMap((path) => sitemapEntries(path, enabled));
  // Read live published records: removed pages and drafts must never be indexed.
  // Let database errors fail the request instead of caching a misleading partial sitemap.
  const resources = ['articles', 'practice-areas', 'attorneys'] as const;
  const collections = await Promise.all(resources.map((resource) => listContent(resource)));
  for (const [index, rows] of collections.entries()) {
    const resource = resources[index]!;
    for (const row of rows) {
      if (
        !row.slug ||
        row.active === false ||
        (resource === 'articles' && (row.status !== 'published' || (row.scheduledAt && new Date(row.scheduledAt).getTime() > Date.now())))
      )
        continue;
      const path = `/${resource === 'articles' ? 'blog' : resource}/${row.slug}`;
      urls.push(
        ...sitemapEntries(
          path,
          availableContentLocales(row).filter((code) => enabled.includes(code)),
          row.updatedAt,
        ),
      );
    }
  }
  for (const page of await listContent('pages')) {
    const path = page.slug === 'home' ? '/' : '/' + page.slug;
    if (page.active !== false && !paths.has(path) && isIndexablePath(path))
      urls.push(
        ...sitemapEntries(
          path,
          availableContentLocales(page).filter((code) => enabled.includes(code)),
        ),
      );
  }
  return urls;
});
