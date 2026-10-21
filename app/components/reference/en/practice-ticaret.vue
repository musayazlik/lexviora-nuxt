<template>
<div>
<section class="page-heading">
<div class="container">
<nav class="breadcrumbs" aria-label="Breadcrumb">
<nuxt-link to="/">Home</nuxt-link>
<svg class="icon " width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
<path d="m9 5 7 7-7 7"></path>
</svg>
<nuxt-link to="/practice-areas">Practice Areas</nuxt-link>
<svg class="icon " width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
<path d="m9 5 7 7-7 7"></path>
</svg>
<span aria-current="page">Corporate Law</span>
</nav>
<h1>Corporate Law</h1>
<p>A sound legal foundation for your business, today and tomorrow.</p>
</div>
<span class="heading-watermark" aria-hidden="true">
<svg class="brand-mark" viewBox="0 0 48 48" fill="none" aria-hidden="true">
<path d="M24 5v35M14 41h20M9 14h30M24 5l-4 5m4-5 4 5M13 14 5 29h16l-8-15Zm22 0-8 15h16l-8-15Z" stroke="currentColor" stroke-width="1.6"></path>
<path d="M5 29c1 8 15 8 16 0m6 0c1 8 15 8 16 0" stroke="currentColor" stroke-width="1.6"></path>
</svg>
</span>
</section>
<section class="section">
<div class="container detail-layout">
<article class="prose">
<div class="detail-icon">
<svg class="icon " width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
<rect x="3" y="7" width="18" height="14" rx="1"></rect>
<path d="M8 7V3h8v4M3 12h18M10 12v3h4v-3"></path>
</svg>
</div>
<h2>Every detail deserves consideration.</h2>
<p class="lead">We consider the legal implications of business decisions together. From company formation to commercial relationships, our approach takes the wider picture into account.</p>
<h3>Areas we can help with</h3>
<ul>
<li>Companies and partnerships</li>
<li>Commercial contracts</li>
<li>Business disputes</li>
</ul>
<h3>How we work</h3>
<p>We begin by listening to your concerns and expectations. We review the available documents, identify any further information needed and discuss the options and scope of work together.</p>
<h3>Before your consultation</h3>
<p>It helps to arrange relevant agreements, correspondence and notices in date order. A brief overview of your situation is enough for an initial enquiry.</p>
<aside class="info-note">This practice overview is sample template content. It is not advice on any specific matter or jurisdiction.</aside>
</article>
<aside class="detail-sidebar">
<div class="sidebar-panel">
<h2>Practice areas</h2>
<nuxt-link to="/practice-areas/family">Family Law<svg class="icon " width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
<path d="m9 5 7 7-7 7"></path>
</svg>
</nuxt-link>
<nuxt-link to="/practice-areas/commerce">Corporate Law<svg class="icon " width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
<path d="m9 5 7 7-7 7"></path>
</svg>
</nuxt-link>
<nuxt-link to="/practice-areas/employment">Employment Law<svg class="icon " width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
<path d="m9 5 7 7-7 7"></path>
</svg>
</nuxt-link>
<nuxt-link to="/practice-areas/criminal">Criminal Law<svg class="icon " width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
<path d="m9 5 7 7-7 7"></path>
</svg>
</nuxt-link>
<nuxt-link to="/practice-areas/inheritance">Inheritance Law<svg class="icon " width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
<path d="m9 5 7 7-7 7"></path>
</svg>
</nuxt-link>
<nuxt-link to="/practice-areas/realestate">Real Estate Law<svg class="icon " width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
<path d="m9 5 7 7-7 7"></path>
</svg>
</nuxt-link>
</div>
<div class="sidebar-contact">
<h2>Have a question?</h2>
<p>Get in touch to discuss your situation.</p>
<nuxt-link class="button " to="/contact">Request a conversation<svg class="icon " width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
<path d="M6 18 18 6M6 6h12v12"></path>
</svg>
</nuxt-link>
</div>
</aside>
</div>
</section>
<section class="section surface">
<div class="container">
<div class="section-head">
<h2>Related perspectives</h2>
<nuxt-link class="text-link" to="/blog">View all articles<svg class="icon " width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
<path d="M5 12h14m-6-6 6 6-6 6"></path>
</svg>
</nuxt-link>
</div>
<public-journal :limit="3"></public-journal>
</div>
</section>
</div>
</template>
