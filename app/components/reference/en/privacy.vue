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
          <span aria-current="page">Privacy notice</span>
        </nav>
        <h1>Privacy notice</h1>
        <p>How the template works and how information is handled.</p>
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
        <p class="info-note">
          This notice describes the technical behaviour of a sample HTML template. It is not a
          privacy policy prepared for a real data controller.
        </p>
        <h2>What information does this demo collect?</h2>
        <p>
          The template has no server-based form processing, membership system or analytics service.
          Contact form entries are processed in browser memory while the page is open. The form
          prepares an email draft for you to open or download.
        </p>
        <h2>Email drafts</h2>
        <p>
          Completing the form does not send a message. Drafts are prepared on your device, and
          sending remains under your control in your email app. Replace the sample recipient address
          before publishing.
        </p>
        <h2>External services</h2>
        <p>
          Official source links lead to external websites, which have their own privacy and use
          terms. The interactive map loads from Google Maps. Connection information, such as an IP
          address, may be shared with that service when the map is displayed.
        </p>
        <h2>Cookies and local storage</h2>
        <p>
          The template’s own code does not use cookies or localStorage. It contains no advertising,
          tracking pixels or analytics code. Fonts and images are served locally.
        </p>
        <h2>Before publishing</h2>
        <p>
          Replace this sample with a notice that reflects the actual firm, its identity and contact
          details, processing purposes, legal bases, retention, transfers and individual rights.
          Adapt it to the applicable jurisdictions and actual services used.
        </p>
        <nuxt-link class="text-link" to="/cookies"
          >Read the cookie notice<svg
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
        </nuxt-link>
      </article>
    </section>
  </div>
</template>
