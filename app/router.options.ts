import type { RouterConfig } from '@nuxt/schema';
import type { RouteRecordRaw } from 'vue-router';
import reference from '#shared/data/reference.json';

function localizedRoute(route: RouteRecordRaw, root = true): RouteRecordRaw {
  return {
    ...route,
    name: route.name ? `content-${String(route.name)}` : undefined,
    path: root
      ? '/:contentLocale([a-z]{2,3}[-a-z0-9]*)' + (route.path === '/' ? '' : route.path)
      : route.path,
    // Vue Router names are global, including nested journal routes.
    children: route.children?.map((child) => localizedRoute(child, false)),
  } as RouteRecordRaw;
}

export default <RouterConfig>{
  routes: (routes) => {
    const catchAll = routes.find((route) => route.path.includes(':slug(.*)'));
    // Reference pages need explicit routes so /faq is not mistaken for a language.
    const staticRoutes = catchAll
      ? [...new Set(Object.values(reference).map((entry) => entry.en.route))]
          .filter(
            (path) =>
              !routes.some((route) => route.path === path) &&
              !/^\/(blog|attorneys|practice-areas)\//.test(path),
          )
          .map((path, index) => ({ ...catchAll, path, name: `reference-${index}` }))
      : [];
    const baseRoutes = [...routes, ...staticRoutes];
    const localized = baseRoutes
      .filter((route) => !route.path.startsWith('/admin'))
      .map((route) => localizedRoute(route));
    return [...baseRoutes, ...localized];
  },
};
