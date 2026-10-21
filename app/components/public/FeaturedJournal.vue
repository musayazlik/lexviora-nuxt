<script setup lang="ts">
const { data: articles } = await usePublicContent('articles');
const { locale } = useI18n();
const localePath = useLocalePath();
const ordered = computed(() =>
  [...articles.value].sort((a, b) => Number(b.featured) - Number(a.featured)),
);
const featured = computed(() => ordered.value[0]);
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
  <div v-if="featured" class="featured-layout">
    <article class="featured-article">
      <NuxtLink class="featured-image" :to="localePath('/blog/' + featured.slug)"
        ><img
          :src="featured.coverImage || '/assets/images/article.webp'"
          alt=""
          width="1536"
          height="1024"
          loading="lazy"
        /><span class="image-tag">{{
          locale === 'tr' ? 'Editörün seçimi' : 'Editor’s choice'
        }}</span></NuxtLink
      >
      <div class="article-meta">
        <NuxtLink
          :to="{ path: localePath('/blog-category'), query: { category: featured.categoryName } }"
          >{{ featured.categoryName }}</NuxtLink
        ><span>{{ formatDate(featured.publishedAt) }}</span>
      </div>
      <h3>
        <NuxtLink :to="localePath('/blog/' + featured.slug)">{{ featured.title }}</NuxtLink>
      </h3>
      <p>{{ featured.excerpt }}</p>
      <NuxtLink class="text-link" :to="localePath('/blog/' + featured.slug)"
        >{{ locale === 'tr' ? 'Makaleyi oku' : 'Read the article'
        }}<UIcon name="i-lucide-arrow-right" class="icon"
      /></NuxtLink>
    </article>
    <div class="featured-list">
      <article v-for="article in ordered.slice(1, 4)" :key="article.id">
        <div>
          <div class="article-meta">
            <span>{{ article.categoryName }}</span>
          </div>
          <h3>
            <NuxtLink :to="localePath('/blog/' + article.slug)">{{ article.title }}</NuxtLink>
          </h3>
          <div class="small-meta">
            <time :datetime="article.publishedAt || ''">{{ formatDate(article.publishedAt) }}</time
            ><span
              >{{ article.readingMinutes || 5 }}
              {{ locale === 'tr' ? 'dk okuma' : 'min read' }}</span
            >
          </div>
        </div>
        <NuxtLink
          class="small-article-image"
          :to="localePath('/blog/' + article.slug)"
          tabindex="-1"
          aria-hidden="true"
          ><img
            :src="article.coverImage || '/assets/images/article.webp'"
            alt=""
            width="1536"
            height="1024"
            loading="lazy"
        /></NuxtLink>
      </article>
    </div>
  </div>
</template>
