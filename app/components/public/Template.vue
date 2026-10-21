<script setup lang="ts">
import reference from '#shared/data/reference.json';
import { pageSeo, siteDescriptions } from '#shared/seo';
import type { Component } from 'vue';
const props = defineProps<{ name: string }>();
const { locale } = useI18n();
const modules = import.meta.glob('../reference/*/*.vue');
const view = computed(() => {
  const loader = modules[`../reference/${locale.value}/${props.name}.vue`];
  return loader ? defineAsyncComponent(loader as () => Promise<{ default: Component }>) : null;
});
const meta = computed(
  () =>
    (reference as Record<string, Record<string, { title: string; description: string }>>)[
      props.name
    ]?.[locale.value],
);
usePageSeo(() => {
  const lang = locale.value === 'tr' ? 'tr' : 'en';
  const override = pageSeo[props.name]?.[lang];
  return {
    title: override?.title || meta.value?.title,
    description: override?.description || siteDescriptions[lang],
  };
});
</script>
<template><component :is="view" v-if="view" /></template>
