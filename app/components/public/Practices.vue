<script setup lang="ts">
const { data: items } = await usePublicContent('practice-areas');
const localePath = useLocalePath();
const icons: Record<string, string> = { family: 'users-round', commerce: 'briefcase-business', employment: 'building-2', criminal: 'shield-check', inheritance: 'git-branch', realestate: 'house' };
</script>
<template><div class="practice-grid"><NuxtLink v-for="(item, index) in items" :key="item.id" :to="localePath('/practice-areas/' + item.slug)" class="practice-card"><span class="practice-number">{{ String(index + 1).padStart(2, '0') }}</span><UIcon :name="'i-lucide-' + (icons[item.slug || ''] || 'scale')" class="icon size-8" /><h3>{{ item.title }}</h3><p>{{ item.excerpt }}</p><UIcon name="i-lucide-arrow-up-right" class="icon practice-arrow" /></NuxtLink></div></template>
