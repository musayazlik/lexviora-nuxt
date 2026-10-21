<script setup lang="ts">
const copy = usePublicCopy();
const localePath = useContentLocalePath();
const route = useRoute();
const open = ref(false);
watch(
  () => route.fullPath,
  () => {
    open.value = false;
  },
);
const links = computed(() => [
  { label: copy.value.about, path: '/about' },
  { label: copy.value.practice, path: '/practice-areas' },
  { label: copy.value.team, path: '/attorneys' },
  { label: copy.value.journal, path: '/blog' },
]);
</script>
<template>
  <div>
    <div class="topbar">
      <div class="container topbar-inner">
        <span>Lexviora</span><span>{{ copy.footer }}</span
        ><a href="mailto:hello@lexviora.example">hello@lexviora.example</a>
      </div>
    </div>
    <header class="site-header">
      <div class="container header-inner">
        <NuxtLink class="brand" :to="localePath('/')" :aria-label="'Lexviora · ' + copy.home"
          ><picture class="brand-picture"
            ><img
              class="brand-image"
              src="/assets/brand/lexviora-logo-navy.webp"
              alt="Lexviora"
              width="2172"
              height="724" /></picture
        ></NuxtLink>
        <button
          class="localized-menu-toggle"
          :aria-label="open ? copy.close : copy.menu"
          :aria-expanded="open"
          aria-controls="localized-nav"
          @click="open = !open"
        >
          <UIcon :name="open ? 'i-lucide-x' : 'i-lucide-menu'" class="icon" />
        </button>
        <nav
          id="localized-nav"
          class="main-nav"
          :class="{ 'is-open': open }"
          @keydown.esc="open = false"
        >
          <NuxtLink v-for="item in links" :key="item.path" :to="localePath(item.path)">{{
            item.label
          }}</NuxtLink>
        </nav>
        <NuxtLink class="button header-cta" :to="localePath('/contact')"
          >{{ copy.contact }}<UIcon name="i-lucide-arrow-up-right" class="icon"
        /></NuxtLink>
        <PublicLanguageSelect />
      </div>
    </header>
  </div>
</template>
