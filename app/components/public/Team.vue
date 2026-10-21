<script setup lang="ts">
const { data: items } = await usePublicContent('attorneys');
const localePath = useLocalePath();
</script>
<template><div class="team-grid"><article v-for="item in items" :key="item.id" class="team-card"><NuxtLink :to="localePath('/attorneys/' + item.slug)"><div class="team-photo"><img :src="item.photo || '/assets/images/deniz.webp'" :alt="item.name || ''" width="1024" height="1536" loading="lazy" /></div><span class="team-role">{{ item.role }}</span><h3>{{ item.name }}</h3><p>{{ item.area }}</p></NuxtLink></article></div></template>
