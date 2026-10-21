<script setup lang="ts">
import reference from '#shared/data/reference.json';
import { unlocalizedPath } from '#shared/seo';
const route = useRoute();
const name = computed(() => {
  const path = unlocalizedPath(route.path);
  return Object.entries(reference).find(([, entry]) => entry.en.route === path)?.[0];
});
const { data: pages } = await usePublicContent('pages');
const customPage = computed(() => pages.value.find((page) => '/' + page.slug === unlocalizedPath(route.path)));
if ((!name.value || name.value === '404') && !customPage.value)
  throw createError({ statusCode: 404, statusMessage: 'Page not found' });
</script>
<template><PublicTemplate :name="name || customPage?.slug || ''" /></template>
