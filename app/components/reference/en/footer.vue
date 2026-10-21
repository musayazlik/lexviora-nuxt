<script setup lang="ts">
const switchLocalePath = useSwitchLocalePath();
</script>
<template>
  <div>
    <footer class="site-footer">
      <div class="container">
        <div class="footer-main">
          <div class="footer-brand">
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
            <p>
              Behind every legal matter,<br />
              a person. At every step, care.
            </p>
            <span>London, United Kingdom</span>
          </div>
          <div>
            <h2>Explore</h2>
            <nuxt-link to="/about">About Us</nuxt-link>
            <nuxt-link to="/attorneys">Our Lawyers</nuxt-link>
            <nuxt-link to="/blog">Journal</nuxt-link>
            <nuxt-link to="/home-editorial">The legal journal</nuxt-link>
            <nuxt-link to="/contact">Contact</nuxt-link>
          </div>
          <div>
            <h2>Practice areas</h2>
            <nuxt-link to="/practice-areas/family">Family Law</nuxt-link>
            <nuxt-link to="/practice-areas/commerce">Corporate Law</nuxt-link>
            <nuxt-link to="/practice-areas/employment">Employment Law</nuxt-link>
            <nuxt-link to="/practice-areas/criminal">Criminal Law</nuxt-link>
            <nuxt-link to="/practice-areas/inheritance">Inheritance Law</nuxt-link>
            <nuxt-link to="/practice-areas/realestate">Real Estate Law</nuxt-link>
          </div>
          <div>
            <h2>Knowledge &amp; resources</h2>
            <nuxt-link to="/legal-guides">Legal resources</nuxt-link>
            <nuxt-link to="/glossary">Legal glossary</nuxt-link>
            <nuxt-link to="/faq">Frequently asked questions</nuxt-link>
            <nuxt-link to="/privacy">Privacy policy</nuxt-link>
            <nuxt-link to="/cookies">Cookie policy</nuxt-link>
            <nuxt-link to="/documentation">Template documentation</nuxt-link>
          </div>
        </div>
        <div class="footer-bottom">
          <span>© <span data-year="">2026</span> Lexviora. All rights reserved.</span>
          <a href="#top"
            >Back to top
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
              <path d="M5 12h14m-6-6 6 6-6 6"></path>
            </svg>
          </a>
        </div>
        <p class="legal-note">
          This is an HTML template demonstration. Names, images and office details are illustrative.
          Content is general information and does not constitute legal advice.
        </p>
      </div>
    </footer>
  </div>
</template>
