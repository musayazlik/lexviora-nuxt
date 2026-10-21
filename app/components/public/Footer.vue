<script setup lang="ts">
const copy = usePublicCopy();
const localePath = useContentLocalePath();
</script>
<template>
  <footer class="site-footer">
    <div class="container">
      <div class="footer-main">
        <div class="footer-brand">
          <NuxtLink class="brand" :to="localePath('/')"
            ><picture class="brand-picture"
              ><img
                src="/assets/brand/lexviora-logo-navy.webp"
                alt="Lexviora"
                class="brand-image"
                width="2172"
                height="724" /></picture
          ></NuxtLink>
          <p>{{ copy.aboutDescription }}</p>
        </div>
        <div>
          <h2>{{ copy.about }}</h2>
          <NuxtLink :to="localePath('/about')">{{ copy.about }}</NuxtLink
          ><NuxtLink :to="localePath('/attorneys')">{{ copy.team }}</NuxtLink
          ><NuxtLink :to="localePath('/contact')">{{ copy.contact }}</NuxtLink>
        </div>
        <div>
          <h2>{{ copy.practice }}</h2>
          <NuxtLink :to="localePath('/practice-areas')">{{ copy.practice }}</NuxtLink
          ><NuxtLink :to="localePath('/blog')">{{ copy.journal }}</NuxtLink>
        </div>
        <div>
          <h2>{{ copy.faq }}</h2>
          <NuxtLink :to="localePath('/faq')">{{ copy.faq }}</NuxtLink
          ><NuxtLink :to="localePath('/glossary')">{{ copy.glossary }}</NuxtLink>
        </div>
      </div>
      <div class="footer-bottom">
        <span>© {{ new Date().getFullYear() }} Lexviora. {{ copy.footer }}</span
        ><a href="#top">Lexviora ↑</a>
      </div>
    </div>
  </footer>
</template>
