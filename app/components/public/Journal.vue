<script setup lang="ts">
const props = withDefaults(defineProps<{ limit?: number; query?: string; category?: string; list?: boolean }>(), { limit: 100 });
const { locale } = useI18n();
const localePath = useLocalePath();
const { data: articles, error } = await usePublicContent('articles');
const filtered = computed(() => articles.value.filter(a => (!props.category || a.categoryName === props.category) && (!props.query || `${a.title} ${a.excerpt} ${a.categoryName}`.toLocaleLowerCase(locale.value).includes(props.query.toLocaleLowerCase(locale.value)))).slice(0, props.limit));
const formatDate = (value?: string | null) => value ? new Intl.DateTimeFormat(locale.value, { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(value)) : '';
</script>
<template>
  <div :class="list ? 'journal-list' : 'article-grid'">
    <article v-for="article in filtered" :key="article.id" class="article-card">
      <NuxtLink :to="localePath('/blog/' + article.slug)" class="article-image" tabindex="-1" aria-hidden="true"><img :src="article.coverImage || '/assets/images/article.webp'" alt="" width="1536" height="1024" loading="lazy" /></NuxtLink>
      <div class="article-meta"><NuxtLink :to="{ path: localePath('/blog-category'), query: { category: article.categoryName } }">{{ article.categoryName }}</NuxtLink><span>{{ article.readingMinutes || 5 }} {{ locale === 'tr' ? 'dk okuma' : 'min read' }}</span></div>
      <h3><NuxtLink :to="localePath('/blog/' + article.slug)">{{ article.title }}</NuxtLink></h3>
      <p>{{ article.excerpt }}</p><div class="article-byline"><span>{{ article.attorneyName }}</span><time :datetime="article.publishedAt || ''">{{ formatDate(article.publishedAt) }}</time></div>
    </article>
    <p v-if="!filtered.length" role="status" class="empty-state">{{ error ? (locale === 'tr' ? 'Yazılar yüklenemedi. Lütfen tekrar deneyin.' : 'Articles could not be loaded. Please try again.') : (locale === 'tr' ? 'Bu aramaya uygun yazı bulunamadı.' : 'No articles match your search.') }}</p>
  </div>
</template>
