<template>
<div>
<section class="editorial-hero">
<div class="container">
<div class="editorial-masthead">
<span>Published by Lexviora</span>
<span>October 2026</span>
</div>
<h1>The legal journal.</h1>
<p>For thoughtful reading, a clearer understanding and more informed decisions.</p>
<div class="editorial-feature">
<div>
<picture>
<source srcset="/assets/images/article.webp" type="image/webp">
<img class="" src="/assets/images/article.png" alt="Scales and a book for the legal journal" width="1536" height="1024" fetchpriority="high" decoding="async">
</picture>
</div>
<article>
<span class="section-kicker">This month’s reading</span>
<h2>
<nuxt-link to="/blog/sozlesme">What should you consider before signing a contract?</nuxt-link>
</h2>
<p>A closer look at responsibilities, scope and the importance of clear contractual language.</p>
<div class="small-meta">
<span>Daniel Arden</span>
<span>16 October 2026</span>
</div>
<nuxt-link class="text-link" to="/blog/sozlesme">Read the story<svg class="icon " width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
<path d="M5 12h14m-6-6 6 6-6 6"></path>
</svg>
</nuxt-link>
</article>
</div>
</div>
</section>
<section class="section">
<div class="container">
<div class="section-head">
<h2>Latest articles</h2>
<nuxt-link class="text-link" to="/blog-list">List view<svg class="icon " width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
<path d="M5 12h14m-6-6 6 6-6 6"></path>
</svg>
</nuxt-link>
</div>
<div class="filter-row" role="group" aria-label="Article categories">
<button class="filter-chip active" data-filter="All" aria-pressed="true">All</button>
<button class="filter-chip " data-filter="Family Law" aria-pressed="false">Family Law</button>
<button class="filter-chip " data-filter="Corporate Law" aria-pressed="false">Corporate Law</button>
<button class="filter-chip " data-filter="Employment Law" aria-pressed="false">Employment Law</button>
<button class="filter-chip " data-filter="Criminal Law" aria-pressed="false">Criminal Law</button>
<button class="filter-chip " data-filter="Inheritance Law" aria-pressed="false">Inheritance Law</button>
<button class="filter-chip " data-filter="Real Estate Law" aria-pressed="false">Real Estate Law</button>
<button class="filter-chip " data-filter="Legal Resources" aria-pressed="false">Legal Resources</button>
</div>
<p class="filter-status sr-only" aria-live="polite" aria-atomic="true">
</p>
<public-journal :limit="3"></public-journal>
<p class="empty-state" hidden="">No articles in this category yet.</p>
</div>
</section>
<section class="resources section">
<div class="container resources-inner">
<div>
<span class="section-kicker">Knowledge, made accessible</span>
<h2>Making the law<br> more approachable.</h2>
<p>Plain-language definitions, practical guides and trusted sources.<br> A clearer starting point for the questions that matter.</p>
<nuxt-link class="button button-outline" to="/legal-guides">Explore legal resources<svg class="icon " width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
<path d="M6 18 18 6M6 6h12v12"></path>
</svg>
</nuxt-link>
</div>
<div class="resource-links">
<nuxt-link to="/legal-guides">
<svg class="icon " width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
<path d="M12 5c-3-2-6-2-10-1v15c4-1 7-1 10 1m0-15c3-2 6-2 10-1v15c-4-1-7-1-10 1V5Z"></path>
</svg>
<span>Practical guides<small>A starting point for understanding legal processes</small>
</span>
<svg class="icon " width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
<path d="M6 18 18 6M6 6h12v12"></path>
</svg>
</nuxt-link>
<nuxt-link to="/glossary">
<svg class="icon " width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
<path d="M14 2H5v20h14V7l-5-5Zm0 0v6h5M8 12h8M8 16h8"></path>
</svg>
<span>Legal glossary<small>Legal terminology, simply explained</small>
</span>
<svg class="icon " width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
<path d="M6 18 18 6M6 6h12v12"></path>
</svg>
</nuxt-link>
<nuxt-link to="/legal-guides#kaynaklar">
<svg class="icon " width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
<path d="M12 3v18M5 21h14M3 7h18M6 7 2 15h8L6 7Zm12 0-4 8h8l-4-8Z"></path>
</svg>
<span>Official sources<small>Links to primary legal information</small>
</span>
<svg class="icon " width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
<path d="M6 18 18 6M6 6h12v12"></path>
</svg>
</nuxt-link>
</div>
</div>
</section>
</div>
</template>
