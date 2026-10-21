<template>
<div>
<section class="page-heading">
<div class="container">
<nav class="breadcrumbs" aria-label="Breadcrumb">
<nuxt-link to="/">Home</nuxt-link>
<svg class="icon " width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
<path d="m9 5 7 7-7 7"></path>
</svg>
<span aria-current="page">Explore by topic</span>
</nav>
<h1>Explore by topic</h1>
<p>Discover perspectives in the areas that interest you.</p>
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
<h2 class="category-title">Corporate Law</h2>
<div class="category-selector">
<nuxt-link to="/blog-category?category=Family%20Law">Family Law</nuxt-link>
<nuxt-link to="/blog-category?category=Corporate%20Law">Corporate Law</nuxt-link>
<nuxt-link to="/blog-category?category=Employment%20Law">Employment Law</nuxt-link>
<nuxt-link to="/blog-category?category=Criminal%20Law">Criminal Law</nuxt-link>
<nuxt-link to="/blog-category?category=Inheritance%20Hukuku">Inheritance Law</nuxt-link>
<nuxt-link to="/blog-category?category=Real%20Estate%20Law">Real Estate Law</nuxt-link>
</div>
<public-journal :limit="3"></public-journal>
<p class="empty-state" hidden="">No articles in this category yet. <nuxt-link to="/blog">View the full journal.</nuxt-link>
</p>
</div>
</section>
</div>
</template>
