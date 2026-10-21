<script setup lang="ts">
const route = useRoute();
const { locale } = useI18n();
const localePath = useLocalePath();
const { data: articles } = await usePublicContent('articles');
const article = computed(() => articles.value.find((a) => a.slug === route.params.slug));
if (!article.value) throw createError({ statusCode: 404, statusMessage: 'Article not found' });
usePageSeo(() => ({
  title: article.value?.title + ' | Lexviora',
  description: article.value?.excerpt || article.value?.body,
  image: article.value?.coverImage,
  imageAlt: article.value?.title,
  type: 'article',
  publishedAt: article.value?.publishedAt,
  updatedAt: article.value?.updatedAt,
  author: article.value?.attorneyName,
  category: article.value?.categoryName,
  availableLocales: article.value?.availableLocales,
}));
const headings = computed(() =>
  [...(article.value?.body || '').matchAll(/<h[23][^>]*>(.*?)<\/h[23]>/g)].map((m) =>
    m[1]?.replace(/<[^>]+>/g, ''),
  ),
);
const copied = ref(false);
async function share() {
  try {
    await navigator.clipboard.writeText(location.href);
    copied.value = true;
  } catch {
    copied.value = false;
  }
}
</script>
<template>
  <div v-if="article">
    <section class="article-heading">
      <div class="container narrow">
        <nav class="breadcrumbs" aria-label="Breadcrumb">
          <NuxtLink :to="localePath('/')">{{ locale === 'tr' ? 'Ana sayfa' : 'Home' }}</NuxtLink
          ><UIcon name="i-lucide-chevron-right" class="icon" /><NuxtLink
            :to="localePath('/blog')"
            >{{ locale === 'tr' ? 'Makaleler' : 'Journal' }}</NuxtLink
          >
        </nav>
        <span class="article-category">{{ article.categoryName }}</span>
        <h1>{{ article.title }}</h1>
        <p>{{ article.excerpt }}</p>
        <div class="article-author">
          <span>{{ article.attorneyName }}</span
          ><span
            >{{ article.readingMinutes || 5 }} {{ locale === 'tr' ? 'dk okuma' : 'min read' }}</span
          ><button class="text-link" type="button" @click="share">
            {{
              copied
                ? locale === 'tr'
                  ? 'Kopyalandı'
                  : 'Copied'
                : locale === 'tr'
                  ? 'Bağlantıyı kopyala'
                  : 'Copy link'
            }}
          </button>
        </div>
      </div>
    </section>
    <div class="container article-cover">
      <img
        :src="article.coverImage || '/assets/images/article.webp'"
        alt=""
        width="1536"
        height="1024"
      />
    </div>
    <section class="section">
      <div class="container article-layout">
        <aside class="article-toc">
          <h2>{{ locale === 'tr' ? 'Bu makalede' : 'In this article' }}</h2>
          <p v-for="heading in headings" :key="heading">{{ heading }}</p>
        </aside>
        <article class="prose" v-html="article.body" />
      </div>
    </section>
    <section class="section section-ivory">
      <div class="container">
        <div class="section-heading">
          <h2>{{ locale === 'tr' ? 'Diğer yazılar' : 'Further reading' }}</h2>
        </div>
        <PublicJournal :limit="3" />
      </div>
    </section>
  </div>
</template>
