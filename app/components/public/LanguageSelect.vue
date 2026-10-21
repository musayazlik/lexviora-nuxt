<script setup lang="ts">
const { locale, languages } = useContentLanguage();
const switchPath = useContentSwitchLocalePath();
const copy = usePublicCopy();
const route = useRoute();
const pageLanguages = useState<{ path: string; locales: string[] } | null>(
  'page-languages',
  () => null,
);
const open = ref(false);
function target(code: string) {
  return pageLanguages.value?.path === route.path && !pageLanguages.value.locales.includes(code)
    ? code === 'en'
      ? '/'
      : '/' + code
    : switchPath(code);
}
watch(
  () => route.fullPath,
  () => {
    open.value = false;
  },
);
</script>
<template>
  <details
    class="language-switch"
    :open="open"
    @toggle="open = ($event.target as HTMLDetailsElement).open"
    @keydown.esc="open = false"
  >
    <summary :aria-label="copy.language">
      <UIcon name="i-lucide-globe" class="icon" /><span>{{ locale.toUpperCase() }}</span
      ><UIcon name="i-lucide-chevron-down" class="size-3" />
    </summary>
    <div class="language-options">
      <NuxtLink
        v-for="item in languages"
        :key="item.code"
        :to="target(item.code)"
        :lang="item.code"
        :hreflang="item.code"
        :data-language="item.code"
        :aria-current="item.code === locale ? 'true' : undefined"
        ><span>{{ item.nativeName }}</span
        ><span v-if="item.code === locale" aria-hidden="true">✓</span></NuxtLink
      >
    </div>
  </details>
</template>
