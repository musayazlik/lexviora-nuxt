<template>
<div>
<section class="page-heading">
<div class="container">
<nav class="breadcrumbs" aria-label="Breadcrumb">
<nuxt-link to="/">Home</nuxt-link>
<svg class="icon " width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
<path d="m9 5 7 7-7 7"></path>
</svg>
<span aria-current="page">Our practice areas</span>
</nav>
<h1>Our practice areas</h1>
<p>Legal perspectives for individuals and businesses, shaped around their needs.</p>
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
<public-practices></public-practices>
</div>
</section>
<section class="contact-section section" id="iletisim">
<div class="container contact-inner">
<div>
<span class="section-kicker">Contact</span>
<h2>Let’s talk<br> things through.</h2>
<p>Tell us you would like to meet.<br> We are here to understand your situation.</p>
<nuxt-link class="button " to="/contact">Get in touch<svg class="icon " width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
<path d="M6 18 18 6M6 6h12v12"></path>
</svg>
</nuxt-link>
</div>
<div class="contact-details">
<div>
<svg class="icon " width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
<path d="M19 10c0 5-7 11-7 11S5 15 5 10a7 7 0 1 1 14 0Z"></path>
<circle cx="12" cy="10" r="2"></circle>
</svg>
<div>
<h3>Our office</h3>
<p>City of London<br> London, United Kingdom</p>
<a href="https://www.google.com/maps/search/?api=1&amp;query=City+of+London" target="_blank" rel="noopener noreferrer">Explore the area <svg class="icon " width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
<path d="M6 18 18 6M6 6h12v12"></path>
</svg>
</a>
</div>
</div>
<div>
<svg class="icon " width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
<rect x="3" y="5" width="18" height="14" rx="1"></rect>
<path d="m3 6 9 7 9-7"></path>
</svg>
<div>
<h3>Write to us</h3>
<a href="mailto:hello@lexviora.example">hello@lexviora.example</a>
<p>Monday–Friday, 9 am–6 pm</p>
</div>
</div>
<p class="demo-note">Contact details are for demonstration purposes.</p>
</div>
</div>
</section>
</div>
</template>
