<template>
<div>
<section class="page-heading">
<div class="container">
<nav class="breadcrumbs" aria-label="Breadcrumb">
<nuxt-link to="/">Home</nuxt-link>
<svg class="icon " width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
<path d="m9 5 7 7-7 7"></path>
</svg>
<span aria-current="page">Perspectives on the law.</span>
</nav>
<h1>Perspectives on the law.</h1>
<p>An accessible view of the legal questions that shape everyday life and business.</p>
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
<div class="blog-toolbar">
<form class="search-form" action="/search" method="get" role="search">
<label class="sr-only" for="search-field">Search articles</label>
<input id="search-field" name="q" type="search" placeholder="Search a topic, term or article…" maxlength="120">
<button type="submit" aria-label="Search the journal">
<svg class="icon " width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
<circle cx="10.5" cy="10.5" r="6.5"></circle>
<path d="m16 16 5 5"></path>
</svg>
</button>
</form>
<div class="view-switch" aria-label="View">
<nuxt-link to="/blog">Grid</nuxt-link>
<nuxt-link to="/blog-list">List</nuxt-link>
</div>
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
<h2 class="sr-only">View all articles</h2>
<public-journal :limit="3"></public-journal>
<p class="empty-state" hidden="">There are no articles in this category yet. Try another category.</p>
</div>
</section>
</div>
</template>
