<script setup lang="ts">
const route = useRoute();
const { locale } = useI18n();
const localePath = useLocalePath();
const { data: items } = await usePublicContent('practice-areas');
const item = computed(() => items.value.find(i => i.slug === route.params.slug));
if (!item.value) throw createError({ statusCode: 404, statusMessage: 'Practice area not found' });
useSeoMeta({ title: () => item.value?.title + ' | Lexviora', description: () => item.value?.excerpt });
</script>
<template><div v-if="item"><PublicPageHeading :title="item.title" :description="item.excerpt" /><section class="section"><div class="container detail-layout"><article class="prose" v-html="item.body" /><aside class="detail-sidebar"><div class="sidebar-panel"><h2>{{ locale === 'tr' ? 'Faaliyet alanları' : 'Practice areas' }}</h2><NuxtLink v-for="area in items" :key="area.id" :to="localePath('/practice-areas/' + area.slug)">{{ area.title }}<UIcon name="i-lucide-chevron-right" class="icon" /></NuxtLink></div><div class="sidebar-contact"><h3>{{ locale === 'tr' ? 'Birlikte değerlendirelim.' : 'Let’s talk it through.' }}</h3><NuxtLink :to="localePath('/contact')" class="button">{{ locale === 'tr' ? 'Görüşme talep edin' : 'Request a conversation' }}</NuxtLink></div></aside></div></section></div></template>
