<script setup lang="ts">
import EnHeader from '~/components/reference/en/header.vue';
import TrHeader from '~/components/reference/tr/header.vue';
import EnFooter from '~/components/reference/en/footer.vue';
import TrFooter from '~/components/reference/tr/footer.vue';
const { locale } = useI18n();
useHead({ link: [{ rel: 'stylesheet', href: '/css/site.css' }], htmlAttrs: { lang: locale } });
usePublicInteractions();
</script>
<template>
  <div id="top" class="public-site" :lang="locale">
    <a href="#main" class="skip-link">{{ locale === 'tr' ? 'İçeriğe geç' : 'Skip to content' }}</a>
    <component :is="locale === 'tr' ? TrHeader : EnHeader" />
    <main id="main" tabindex="-1"><slot /></main>
    <component :is="locale === 'tr' ? TrFooter : EnFooter" />
  </div>
</template>
