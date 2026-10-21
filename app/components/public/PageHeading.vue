<script setup lang="ts">
defineProps<{ title: string; description?: string }>();
const { locale } = useContentLanguage();
const copy = usePublicCopy();
const localePath = useContentLocalePath();
</script>
<template>
  <section class="page-heading">
    <div class="container">
      <nav class="breadcrumbs" :aria-label="copy.breadcrumb">
        <NuxtLink :to="localePath('/')">{{ copy.home }}</NuxtLink
        ><UIcon name="i-lucide-chevron-right" class="icon" /><span aria-current="page">{{
          title
        }}</span>
      </nav>
      <h1>{{ title }}</h1>
      <p v-if="description">{{ description }}</p>
    </div>
    <span class="heading-watermark" aria-hidden="true"
      ><UIcon name="i-lucide-scale" class="size-40"
    /></span>
  </section>
</template>
