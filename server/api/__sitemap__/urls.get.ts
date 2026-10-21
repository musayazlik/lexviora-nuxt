import reference from '../../../shared/data/reference.json';
import {
  availableContentLocales,
  canonicalPath,
  isIndexablePath,
  sitemapEntries,
} from '../../../shared/seo';
import type { SeoSitemapUrl } from '../../../shared/seo';
import { listContent } from '../../utils/content';

export default defineSitemapEventHandler(async () => {
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
  const urls: SeoSitemapUrl[] = [...paths].flatMap((path) => sitemapEntries(path));
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
        (resource === 'articles' && row.status !== 'published')
      )
        continue;
      const path = `/${resource === 'articles' ? 'blog' : resource}/${row.slug}`;
      urls.push(...sitemapEntries(path, availableContentLocales(row), row.updatedAt));
    }
  }
  return urls;
});
