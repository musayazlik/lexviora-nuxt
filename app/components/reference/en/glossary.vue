<template>
<div>
<section class="page-heading">
<div class="container">
<nav class="breadcrumbs" aria-label="Breadcrumb">
<nuxt-link to="/">Home</nuxt-link>
<svg class="icon " width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
<path d="m9 5 7 7-7 7"></path>
</svg>
<span aria-current="page">Understanding the language of law.</span>
</nav>
<h1>Understanding the language of law.</h1>
<p>Short, plain-language explanations of common legal terms.</p>
</div>
<span class="heading-watermark" aria-hidden="true">
<svg class="brand-mark" viewBox="0 0 48 48" fill="none" aria-hidden="true">
<path d="M24 5v35M14 41h20M9 14h30M24 5l-4 5m4-5 4 5M13 14 5 29h16l-8-15Zm22 0-8 15h16l-8-15Z" stroke="currentColor" stroke-width="1.6"></path>
<path d="M5 29c1 8 15 8 16 0m6 0c1 8 15 8 16 0" stroke="currentColor" stroke-width="1.6"></path>
</svg>
</span>
</section>
<section class="section">
<div class="container narrow">
<label class="field-label" for="glossary-search">Find a term</label>
<input class="text-input" id="glossary-search" type="search" placeholder="For example: mediation">
<p class="glossary-status sr-only" role="status">
</p>
<public-glossary></public-glossary>
<p class="empty-state" hidden="">No matching term was found. Try another word.</p>
<p class="demo-note">These are introductory explanations. The meaning and effect of a term may vary by jurisdiction and the circumstances of the matter.</p>
</div>
</section>
</div>
</template>
