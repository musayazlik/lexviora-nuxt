<template>
<div>
<section class="page-heading">
<div class="container">
<nav class="breadcrumbs" aria-label="İçerik yolu">
<nuxt-link to="/tr/">Ana Sayfa</nuxt-link>
<svg class="icon " width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
<path d="m9 5 7 7-7 7"></path>
</svg>
<span aria-current="page">Aradığınız bilgiye ulaşın.</span>
</nav>
<h1>Aradığınız bilgiye ulaşın.</h1>
<p>Makalelerin başlıklarında, konularında ve kısa açıklamalarında arama yapın.</p>
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
<form class="search-form" action="/tr/search" method="get" role="search">
<label class="sr-only" for="search-field">Makale ara</label>
<input id="search-field" name="q" type="search" placeholder="Konu, kavram veya makale arayın…" maxlength="120">
<button type="submit" aria-label="Makalelerde ara">
<svg class="icon " width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
<circle cx="10.5" cy="10.5" r="6.5"></circle>
<path d="m16 16 5 5"></path>
</svg>
</button>
</form>
<h2 class="search-title spaced">Aramaya başlayın</h2>
<p class="search-status" role="status" aria-atomic="true">
</p>
<public-journal :limit="3"></public-journal>
<p class="empty-state" hidden="">Aramanıza uygun bir yazı bulunamadı. Farklı bir sözcük deneyin veya <nuxt-link to="/tr/blog">tüm makalelere göz atın.</nuxt-link>
</p>
</div>
</section>
</div>
</template>
