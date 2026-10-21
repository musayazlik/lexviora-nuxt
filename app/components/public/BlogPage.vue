<script setup lang="ts">
const { locale } = useContentLanguage();
const copy = usePublicCopy();
const { data: pages } = await usePublicContent('pages');
const page = computed(() => pages.value.find((item) => item.slug === 'blog'));
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
    : page.value?.title || copy.value.journal,
);
usePageSeo(() => ({
  title: title.value + ' | Lexviora',
  description:
    page.value?.excerpt ||
    (locale.value === 'tr'
      ? 'Lexviora hukuk günlüğü: aile, ticaret, iş ve gayrimenkul hukuku üzerine makaleler, pratik rehberler ve güncel değerlendirmeler.'
      : copy.value.aboutDescription),
}));
</script>
<template>
  <div>
    <PublicPageHeading :title="title" :description="page?.excerpt || copy.aboutDescription" />
    <section class="section">
      <div class="container">
        <form
          class="search-form"
          @submit.prevent="navigateTo({ path: route.path, query: { q: query, category } })"
        >
          <label class="sr-only" for="journal-search">{{ copy.search }}</label
          ><input
            id="journal-search"
            v-model="query"
            type="search"
            :placeholder="copy.searchPlaceholder"
          /><button class="button" type="submit">{{ copy.search }}</button>
        </form>
        <div class="filter-bar">
          <button
            type="button"
            class="filter-chip"
            :class="{ active: !category }"
            :aria-pressed="!category"
            @click="category = ''"
          >
            {{ copy.all }}</button
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
