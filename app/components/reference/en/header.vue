<template>
  <div>
    <div class="topbar" role="region" aria-label="Office contact information">
      <div class="container topbar-inner">
        <span>
          <svg
            class="icon"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
            aria-hidden="true"
          >
            <path d="M19 10c0 5-7 11-7 11S5 15 5 10a7 7 0 1 1 14 0Z"></path>
            <circle cx="12" cy="10" r="2"></circle>
          </svg>
          London, United Kingdom</span
        >
        <span>Considered counsel. A personal approach.</span>
        <a href="mailto:hello@lexviora.example">
          <svg
            class="icon"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
            aria-hidden="true"
          >
            <rect x="3" y="5" width="18" height="14" rx="1"></rect>
            <path d="m3 6 9 7 9-7"></path>
          </svg>
          hello@lexviora.example</a
        >
      </div>
    </div>
    <header class="site-header">
      <div class="container header-inner">
        <nuxt-link class="brand" aria-label="Lexviora home" to="/">
          <picture class="brand-picture">
            <source srcset="/assets/brand/lexviora-logo-navy.webp" type="image/webp" />
            <img
              class="brand-image"
              src="/assets/brand/lexviora-logo-navy.png"
              width="2172"
              height="724"
              alt="Lexviora Legal &amp; Advisory"
              decoding="async"
            />
          </picture>
        </nuxt-link>
        <button
          class="menu-toggle"
          aria-label="Open menu"
          aria-expanded="false"
          aria-controls="main-nav"
        >
          <span> </span>
          <span> </span>
        </button>
        <nav class="main-nav" id="main-nav" aria-label="Main navigation">
          <nuxt-link to="/">Home</nuxt-link>
          <nuxt-link to="/about">About Us</nuxt-link>
          <nuxt-link to="/practice-areas">Practice Areas</nuxt-link>
          <nuxt-link to="/attorneys">Our Lawyers</nuxt-link>
          <nuxt-link to="/blog">Journal</nuxt-link>
          <nuxt-link to="/legal-guides">Legal Resources</nuxt-link>
          <nuxt-link class="nav-contact" to="/contact"
            >Contact
            <svg
              class="icon"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
              aria-hidden="true"
            >
              <path d="M6 18 18 6M6 6h12v12"></path>
            </svg>
          </nuxt-link>
        </nav>
        <nuxt-link class="header-contact" to="/contact"
          >Contact
          <svg
            class="icon"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
            aria-hidden="true"
          >
            <path d="M6 18 18 6M6 6h12v12"></path>
          </svg>
        </nuxt-link>
        <PublicLanguageSelect />
      </div>
    </header>
  </div>
</template>
