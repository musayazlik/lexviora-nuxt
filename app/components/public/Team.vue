<script setup lang="ts">
const { data: items } = await usePublicContent('attorneys');
const { locale } = useI18n();
const localePath = useLocalePath();
</script>
<template>
  <div class="team-grid">
    <article v-for="item in items" :key="item.id" class="attorney-card">
      <NuxtLink
        class="portrait"
        :to="localePath('/attorneys/' + item.slug)"
        tabindex="-1"
        aria-hidden="true"
        ><img
          :src="item.photo || '/assets/images/deniz.webp'"
          alt=""
          width="1024"
          height="1536"
          loading="lazy"
      /></NuxtLink>
      <div class="attorney-info">
        <div>
          <p class="role">{{ item.role }}</p>
          <h3>
            <NuxtLink :to="localePath('/attorneys/' + item.slug)">{{ item.name }}</NuxtLink>
          </h3>
          <p>{{ item.area }}</p>
        </div>
        <NuxtLink
          :to="localePath('/attorneys/' + item.slug)"
          class="round-link"
          :aria-label="item.name + (locale === 'tr' ? ' profilini görüntüle' : ' view profile')"
          ><UIcon name="i-lucide-arrow-up-right" class="icon"
        /></NuxtLink>
      </div>
    </article>
  </div>
</template>
