<script setup lang="ts">
const route = useRoute();
const { locale } = useContentLanguage();
const localePath = useContentLocalePath();
const { data: items } = await usePublicContent('attorneys');
const item = computed(() => items.value.find((i) => i.slug === route.params.slug));
if (!item.value) throw createError({ statusCode: 404, statusMessage: 'Attorney not found' });
usePageSeo(() => ({
  title: item.value?.name + ' | Lexviora',
  description: [item.value?.role, item.value?.area, item.value?.bio].filter(Boolean).join('. '),
  image: item.value?.photo,
  imageAlt: item.value?.name,
  type: 'profile',
  availableLocales: item.value?.availableLocales,
}));
</script>
<template>
  <div v-if="item">
    <PublicPageHeading :title="item.name || ''" :description="item.role" />
    <section class="section">
      <div class="container profile-layout">
        <div class="profile-photo">
          <img
            :src="item.photo || '/assets/images/deniz.webp'"
            :alt="item.name || ''"
            width="1024"
            height="1536"
          />
        </div>
        <article class="prose">
          <span class="section-kicker">{{ item.role }}</span>
          <h2>{{ item.name }}</h2>
          <div v-html="item.bio" />
          <h3>{{ locale === 'tr' ? 'Uzmanlık alanları' : 'Areas of focus' }}</h3>
          <p>{{ item.area }}</p>
          <NuxtLink :to="localePath('/contact')" class="button">{{
            locale === 'tr' ? 'Görüşme talep edin' : 'Request a consultation'
          }}</NuxtLink>
        </article>
      </div>
    </section>
  </div>
</template>
