<script setup lang="ts">
import reference from '#shared/data/reference.json';
import type { Component } from 'vue';
const props = defineProps<{ name: string }>();
const { locale } = useI18n();
const modules = import.meta.glob('../reference/*/*.vue');
const view = computed(() => {
  const loader = modules[`../reference/${locale.value}/${props.name}.vue`];
  return loader ? defineAsyncComponent(loader as () => Promise<{ default: Component }>) : null;
});
const meta = computed(() => (reference as Record<string, Record<string, { title: string; description: string }>>)[props.name]?.[locale.value]);
useSeoMeta({ title: () => meta.value?.title, description: () => meta.value?.description, ogTitle: () => meta.value?.title, ogDescription: () => meta.value?.description });
</script>
<template><component :is="view" v-if="view" /></template>
