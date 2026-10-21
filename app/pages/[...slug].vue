<script setup lang="ts">
import reference from '#shared/data/reference.json';
const route = useRoute();
const name = computed(() => {
  const path = '/' + (Array.isArray(route.params.slug) ? route.params.slug.join('/') : route.params.slug || '');
  return Object.entries(reference).find(([, entry]) => entry.en.route === path)?.[0];
});
if (!name.value) throw createError({ statusCode: 404, statusMessage: 'Page not found' });
</script>
<template><PublicTemplate v-if="name" :name="name" /></template>
