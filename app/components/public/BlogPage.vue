<script setup lang="ts">
const { locale } = useI18n();
const route = useRoute();
const { data: categories } = await usePublicContent('categories');
const query = ref(String(route.query.q || ''));
const category = ref(String(route.query.category || ''));
watch(
  () => route.query,
  (value) => {
    query.value = String(value.q || '');
    category.value = String(value.category || '');
  },
);
const title = computed(() =>
  route.path.includes('search')
    ? locale.value === 'tr'
      ? 'Arama sonuçları'
      : 'Search results'
    : locale.value === 'tr'
      ? 'Hukuk günlüğü'
      : 'The legal journal',
);
usePageSeo(() => ({
  title: title.value + ' | Lexviora',
  description:
    locale.value === 'tr'
      ? 'Lexviora hukuk günlüğü: aile, ticaret, iş ve gayrimenkul hukuku üzerine makaleler, pratik rehberler ve güncel değerlendirmeler.'
      : 'The Lexviora legal journal: articles, practical guides and considered perspectives on family, corporate, employment and real estate law.',
}));
</script>
<template>
  <div>
    <PublicPageHeading
      :title="title"
      :description="
        locale === 'tr'
          ? 'Bilgiyle başlayan, özenle şekillenen bir bakış.'
          : 'Considered perspectives. A clearer understanding.'
      "
    />
    <section class="section">
      <div class="container">
        <form
          class="search-form"
          @submit.prevent="navigateTo({ path: route.path, query: { q: query, category } })"
        >
          <label class="sr-only" for="journal-search">{{
            locale === 'tr' ? 'Yazılarda ara' : 'Search articles'
          }}</label
          ><input
            id="journal-search"
            v-model="query"
            type="search"
            :placeholder="locale === 'tr' ? 'Bir konu veya anahtar kelime…' : 'A topic or keyword…'"
          /><button class="button" type="submit">{{ locale === 'tr' ? 'Ara' : 'Search' }}</button>
        </form>
        <div class="filter-bar">
          <button
            type="button"
            class="filter-chip"
            :class="{ active: !category }"
            :aria-pressed="!category"
            @click="category = ''"
          >
            {{ locale === 'tr' ? 'Tümü' : 'All' }}</button
          ><button
            v-for="item in categories"
            :key="item.id"
            type="button"
            class="filter-chip"
            :class="{ active: category === item.name }"
            :aria-pressed="category === item.name"
            @click="category = item.name || ''"
          >
            {{ item.name }}
          </button>
        </div>
        <PublicJournal
          :query="query"
          :category="category"
          :list="route.path.includes('blog-list')"
        />
      </div>
    </section>
  </div>
</template>
