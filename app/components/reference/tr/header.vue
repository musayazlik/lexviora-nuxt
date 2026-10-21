<script setup lang="ts">
const switchLocalePath = useSwitchLocalePath();
const route = useRoute();
const queryAndHash = computed(() => { const q = new URLSearchParams(Object.entries(route.query).map(([k,v]) => [k, String(v ?? '')])).toString(); return (q ? '?' + q : '') + route.hash; });
</script>
<template>
<div><div class="topbar" role="region" aria-label="Büro iletişim bilgileri">
<div class="container topbar-inner">
<span>
<svg class="icon " width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
<path d="M19 10c0 5-7 11-7 11S5 15 5 10a7 7 0 1 1 14 0Z"></path>
<circle cx="12" cy="10" r="2"></circle>
</svg> İstanbul, Türkiye</span>
<span>Hukuka özen. İnsana saygı.</span>
<a href="mailto:merhaba@lexviora.example">
<svg class="icon " width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
<rect x="3" y="5" width="18" height="14" rx="1"></rect>
<path d="m3 6 9 7 9-7"></path>
</svg> merhaba@lexviora.example</a>
</div>
</div><header class="site-header">
<div class="container header-inner">
<nuxt-link class="brand" aria-label="Lexviora ana sayfa" to="/tr/">
<picture class="brand-picture">
<source srcset="/assets/brand/lexviora-logo-navy.webp" type="image/webp">
<img class="brand-image" src="/assets/brand/lexviora-logo-navy.png" width="2172" height="724" alt="Lexviora Legal &amp; Advisory" decoding="async">
</picture>
</nuxt-link>
<button class="menu-toggle" aria-label="Menüyü aç" aria-expanded="false" aria-controls="main-nav">
<span>
</span>
<span>
</span>
</button>
<nav class="main-nav" id="main-nav" aria-label="Ana menü">
<nuxt-link to="/tr/">Ana Sayfa</nuxt-link>
<nuxt-link to="/tr/about">Hakkımızda</nuxt-link>
<nuxt-link to="/tr/practice-areas">Faaliyet Alanları</nuxt-link>
<nuxt-link to="/tr/attorneys">Avukatlarımız</nuxt-link>
<nuxt-link to="/tr/blog">Makaleler</nuxt-link>
<nuxt-link to="/tr/legal-guides">Hukuk Rehberi</nuxt-link>
<nuxt-link class="nav-contact" to="/tr/contact">İletişim <svg class="icon " width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
<path d="M6 18 18 6M6 6h12v12"></path>
</svg>
</nuxt-link>
</nav>
<nuxt-link class="header-contact" to="/tr/contact">İletişim <svg class="icon " width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
<path d="M6 18 18 6M6 6h12v12"></path>
</svg>
</nuxt-link>
<details class="language-switch">
<summary aria-label="Dili değiştir">
<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true">
<circle cx="12" cy="12" r="9"></circle>
<path d="M3 12h18M12 3a18 18 0 0 1 0 18 18 18 0 0 1 0-18Z"></path>
</svg>
<span>TR</span>
<svg class="language-chevron" width="10" height="10" viewBox="0 0 12 12" fill="none" stroke="currentColor" aria-hidden="true">
<path d="m2 4 4 4 4-4"></path>
</svg>
</summary>
<div class="language-options">
<nuxt-link lang="en" hreflang="en" data-language="en" :to="switchLocalePath('en') + queryAndHash">English<span aria-hidden="true">
</span>
</nuxt-link>
<nuxt-link lang="tr" hreflang="tr" data-language="tr" :to="switchLocalePath('tr') + queryAndHash">Türkçe<span aria-hidden="true">✓</span>
</nuxt-link>
</div>
</details>
</div>
</header></div>
</template>
