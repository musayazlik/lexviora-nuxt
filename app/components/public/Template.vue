<script setup lang="ts">
import reference from '#shared/data/reference.json';
import { pageSeo, siteDescriptions } from '#shared/seo';
import type { Component } from 'vue';
const props = defineProps<{ name: string }>();
const { locale } = useContentLanguage();
const copy = usePublicCopy();
const { data: pages } = await usePublicContent('pages');
const page = computed(() =>
  pages.value.find((item) => item.slug === (props.name === 'index' ? 'home' : props.name)),
);
const modules = import.meta.glob('../reference/*/*.vue');
const view = computed(() => {
  const loader = modules[`../reference/${locale.value}/${props.name}.vue`];
  return loader ? defineAsyncComponent(loader as () => Promise<{ default: Component }>) : null;
});
const meta = computed(
  () =>
    (reference as Record<string, Record<string, { title: string; description: string }>>)[
      props.name
    ]?.[locale.value],
);
usePageSeo(() => {
  const lang = locale.value;
  const override = pageSeo[props.name]?.[lang];
  const labels: Record<string, string> = {
    index: copy.value.heroTitle,
    about: copy.value.about,
    'practice-areas': copy.value.practice,
    attorneys: copy.value.team,
    contact: copy.value.contact,
    faq: copy.value.faq,
    glossary: copy.value.glossary,
  };
  return {
    title: page.value?.title
      ? page.value.title + ' | Lexviora'
      : override?.title || meta.value?.title || (labels[props.name] || props.name) + ' | Lexviora',
    description:
      page.value?.excerpt ||
      override?.description ||
      siteDescriptions[lang] ||
      copy.value.aboutDescription,
  };
});
</script>
<template>
  <component :is="view" v-if="view && !page" /><PublicLocalizedPage
    v-else
    :name="name"
    :page="page"
  />
</template>
