<template>
<div>
<section class="page-heading">
<div class="container">
<nav class="breadcrumbs" aria-label="İçerik yolu">
<nuxt-link to="/tr/">Ana Sayfa</nuxt-link>
<svg class="icon " width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
<path d="m9 5 7 7-7 7"></path>
</svg>
<span aria-current="page">Kategoriye göre okumalar</span>
</nav>
<h1>Kategoriye göre okumalar</h1>
<p>İlginizi çeken hukuk alanındaki yazıları keşfedin.</p>
</div>
<span class="heading-watermark" aria-hidden="true">
<svg class="brand-mark" viewBox="0 0 48 48" fill="none" aria-hidden="true">
<path d="M24 5v35M14 41h20M9 14h30M24 5l-4 5m4-5 4 5M13 14 5 29h16l-8-15Zm22 0-8 15h16l-8-15Z" stroke="currentColor" stroke-width="1.6"></path>
<path d="M5 29c1 8 15 8 16 0m6 0c1 8 15 8 16 0" stroke="currentColor" stroke-width="1.6"></path>
</svg>
</span>
</section>
<section class="section">
<div class="container">
<h2 class="category-title">Ticaret Hukuku</h2>
<div class="category-selector">
<nuxt-link to="/tr/blog-category?category=Aile%20Hukuku">Aile Hukuku</nuxt-link>
<nuxt-link to="/tr/blog-category?category=Ticaret%20Hukuku">Ticaret Hukuku</nuxt-link>
<nuxt-link to="/tr/blog-category?category=%C4%B0%C5%9F%20Hukuku">İş Hukuku</nuxt-link>
<nuxt-link to="/tr/blog-category?category=Ceza%20Hukuku">Ceza Hukuku</nuxt-link>
<nuxt-link to="/tr/blog-category?category=Miras%20Hukuku">Miras Hukuku</nuxt-link>
<nuxt-link to="/tr/blog-category?category=Gayrimenkul%20Hukuku">Gayrimenkul Hukuku</nuxt-link>
</div>
<public-journal :limit="3"></public-journal>
<p class="empty-state" hidden="">Bu kategoride henüz yazı yok. <nuxt-link to="/tr/blog">Tüm makaleleri görüntüleyin.</nuxt-link>
</p>
</div>
</section>
</div>
</template>
