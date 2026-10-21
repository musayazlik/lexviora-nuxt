<script setup lang="ts">
import EnHeader from '~/components/reference/en/header.vue';
import TrHeader from '~/components/reference/tr/header.vue';
import EnFooter from '~/components/reference/en/footer.vue';
import TrFooter from '~/components/reference/tr/footer.vue';
const { locale, language } = useContentLanguage();
const copy = usePublicCopy();
useHead({ link: [{ rel: 'stylesheet', href: '/css/site.css' }] });
usePublicInteractions();
</script>
<template>
  <div id="top" class="public-site" :lang="locale" :dir="language?.direction || 'ltr'">
    <a href="#main" class="skip-link">{{ copy.skip }}</a>
    <component :is="locale === 'tr' ? TrHeader : EnHeader" v-if="['en', 'tr'].includes(locale)" />
    <PublicHeader v-else />
    <main id="main" tabindex="-1"><slot /></main>
    <PublicNewsletter v-if="!$route.path.includes('/newsletter/')" />
    <component :is="locale === 'tr' ? TrFooter : EnFooter" v-if="['en', 'tr'].includes(locale)" />
    <PublicFooter v-else />
  </div>
</template>
