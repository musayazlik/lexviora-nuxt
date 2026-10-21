<script setup lang="ts">
defineProps<{ title: string; description?: string }>();
const { locale } = useI18n();
const localePath = useLocalePath();
</script>
<template><section class="page-heading"><div class="container"><nav class="breadcrumbs" :aria-label="locale === 'tr' ? 'Sayfa yolu' : 'Breadcrumb'"><NuxtLink :to="localePath('/')">{{ locale === 'tr' ? 'Ana sayfa' : 'Home' }}</NuxtLink><UIcon name="i-lucide-chevron-right" class="icon" /><span aria-current="page">{{ title }}</span></nav><h1>{{ title }}</h1><p v-if="description">{{ description }}</p></div><span class="heading-watermark" aria-hidden="true"><UIcon name="i-lucide-scale" class="size-40" /></span></section></template>
