<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    limit?: number;
    query?: string;
    category?: string;
    list?: boolean;
    filterable?: boolean;
  }>(),
  { limit: 100 },
);
const { locale } = useContentLanguage();
const copy = usePublicCopy();
const localePath = useContentLocalePath();
const { data: articles, error } = await usePublicContent('articles');
const selection = ref('');
const categories = computed(() => [
  ...new Set(articles.value.map((a) => a.categoryName).filter(Boolean)),
]);
const selectedCategory = computed(() => (props.filterable ? selection.value : props.category));
const filtered = computed(() =>
  articles.value
    .filter(
      (a) =>
        (!selectedCategory.value || a.categoryName === selectedCategory.value) &&
        (!props.query ||
          `${a.title} ${a.excerpt} ${a.categoryName}`
            .toLocaleLowerCase(locale.value)
            .includes(props.query.toLocaleLowerCase(locale.value))),
    )
    .slice(0, props.limit),
);
const formatDate = (value?: string | null) =>
  value
    ? new Intl.DateTimeFormat(locale.value, {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      }).format(new Date(value))
    : '';
</script>
<template>
  <div v-if="filterable" class="filter-row" role="group" :aria-label="copy.journal">
    <button
      class="filter-chip"
      :class="{ active: !selection }"
      :aria-pressed="!selection"
      @click="selection = ''"
    >
      {{ copy.all }}</button
    ><button
      v-for="categoryName in categories"
      :key="categoryName"
      class="filter-chip"
      :class="{ active: selection === categoryName }"
      :aria-pressed="selection === categoryName"
      @click="selection = categoryName || ''"
    >
      {{ categoryName }}
    </button>
  </div>
  <div :class="list ? 'journal-list' : 'article-grid'">
    <article v-for="article in filtered" :key="article.id" class="article-card">
      <NuxtLink
        :to="localePath('/blog/' + article.slug)"
        class="article-image"
        tabindex="-1"
        aria-hidden="true"
        ><img
          :src="article.coverImage || '/assets/images/article.webp'"
          alt=""
          width="1536"
          height="1024"
          loading="lazy"
      /></NuxtLink>
      <div class="article-meta">
        <NuxtLink
          :to="{ path: localePath('/blog-category'), query: { category: article.categoryName } }"
          >{{ article.categoryName }}</NuxtLink
        ><span>{{ article.readingMinutes || 5 }} {{ copy.minutes }}</span>
      </div>
      <h3>
        <NuxtLink :to="localePath('/blog/' + article.slug)">{{ article.title }}</NuxtLink>
      </h3>
      <p>{{ article.excerpt }}</p>
      <div class="article-byline">
        <span>{{ article.attorneyName }}</span
        ><time :datetime="article.publishedAt || ''">{{ formatDate(article.publishedAt) }}</time>
      </div>
    </article>
    <p v-if="!filtered.length" role="status" class="empty-state">
      {{ error ? copy.loadError : copy.empty }}
    </p>
  </div>
</template>
