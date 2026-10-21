<template>
  <div>
    <section class="page-heading">
      <div class="container">
        <nav class="breadcrumbs" aria-label="Breadcrumb">
          <nuxt-link to="/">Home</nuxt-link>
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
            <path d="m9 5 7 7-7 7"></path>
          </svg>
          <span aria-current="page">Lexviora documentation</span>
        </nav>
        <h1>Lexviora documentation</h1>
        <p>Setup, pages, images and customisation.</p>
      </div>
      <span class="heading-watermark" aria-hidden="true">
        <svg class="brand-mark" viewBox="0 0 48 48" fill="none" aria-hidden="true">
          <path
            d="M24 5v35M14 41h20M9 14h30M24 5l-4 5m4-5 4 5M13 14 5 29h16l-8-15Zm22 0-8 15h16l-8-15Z"
            stroke="currentColor"
            stroke-width="1.6"
          ></path>
          <path
            d="M5 29c1 8 15 8 16 0m6 0c1 8 15 8 16 0"
            stroke="currentColor"
            stroke-width="1.6"
          ></path>
        </svg>
      </span>
    </section>
    <section class="section">
      <article class="container narrow prose">
        <h2>Quick start</h2>
        <p>
          The template uses static HTML, CSS and JavaScript. No framework or build is required. Open
          index.html directly, or run this command in the project folder:
          <code>python -m http.server 3000</code> to start the local preview.
        </p>
        <h2>18 core page templates</h2>
        <ul class="template-list">
          <li>
            <nuxt-link to="/">index.html</nuxt-link>
          </li>
          <li>
            <nuxt-link to="/home-editorial">home-editorial.html</nuxt-link>
          </li>
          <li>
            <nuxt-link to="/about">about.html</nuxt-link>
          </li>
          <li>
            <nuxt-link to="/practice-areas">practice-areas.html</nuxt-link>
          </li>
          <li>
            <nuxt-link to="/practice-areas/family">practice-detail.html</nuxt-link>
          </li>
          <li>
            <nuxt-link to="/attorneys">attorneys.html</nuxt-link>
          </li>
          <li>
            <nuxt-link to="/attorneys/deniz">attorney-detail.html</nuxt-link>
          </li>
          <li>
            <nuxt-link to="/blog">blog.html</nuxt-link>
          </li>
          <li>
            <nuxt-link to="/blog-list">blog-list.html</nuxt-link>
          </li>
          <li>
            <nuxt-link to="/blog/sozlesme">blog-detail.html</nuxt-link>
          </li>
          <li>
            <nuxt-link to="/blog-category">blog-category.html</nuxt-link>
          </li>
          <li>
            <nuxt-link to="/search">search.html</nuxt-link>
          </li>
          <li>
            <nuxt-link to="/legal-guides">legal-guides.html</nuxt-link>
          </li>
          <li>
            <nuxt-link to="/glossary">glossary.html</nuxt-link>
          </li>
          <li>
            <nuxt-link to="/faq">faq.html</nuxt-link>
          </li>
          <li>
            <nuxt-link to="/contact">contact.html</nuxt-link>
          </li>
          <li>
            <nuxt-link to="/privacy">privacy.html</nuxt-link>
          </li>
          <li>
            <nuxt-link to="/404">404.html</nuxt-link>
          </li>
        </ul>
        <p>
          Additional pages include a cookie notice, this documentation and individual sample
          practice, lawyer and article pages. Both English and Turkish versions are included.
        </p>
        <h2>Colours and typography</h2>
        <p>
          Edit the :root tokens in css/style.css to change Midnight Navy, Ivory, Muted Gold and
          Forest. Headings use Cormorant Garamond; body text uses Manrope. Font files are bundled in
          assets/fonts.
        </p>
        <h2>Editing content</h2>
        <p>
          Edit the HTML directly, or update the shared source in scripts/build.mjs. English phrases
          are maintained in locales/en.mjs. To regenerate both languages, run
          <code>node scripts/build.mjs</code> The command regenerates all English and Turkish pages.
          Direct HTML changes will be overwritten. The header language menu opens the equivalent
          page in the other language.
        </p>
        <h2>Images</h2>
        <p>
          assets/images contains AI-generated PNG originals and optimised WebP copies. Images do not
          depict a real firm or its lawyers. Prompts and generation notes are in IMAGE-CREDITS.md.
          Icons are accessible SVGs with a consistent stroke weight.
        </p>
        <h2>Interactions</h2>
        <p>
          js/main.js handles navigation, language switching, filters, search, glossary search, link
          copying, printing, accordions and form validation. Interface messages follow the document
          language. Reduced motion preferences are respected.
        </p>
        <h2>Contact form</h2>
        <p>
          The form does not store or send data. Valid entries prepare a mailto link and a
          downloadable .eml draft. Replace the recipient in js/main.js and the HTML source. A form
          service or backend is needed for server-based delivery.
        </p>
        <h2>Before launch</h2>
        <p>
          Replace names, professional credentials, images, addresses and contact details with
          verified information. Adapt the privacy and cookie notices to actual processing and
          applicable jurisdictions. Configure 404.html as the error page on your static host.
        </p>
      </article>
    </section>
  </div>
</template>
