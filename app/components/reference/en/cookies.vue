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
          <span aria-current="page">Cookie notice</span>
        </nav>
        <h1>Cookie notice</h1>
        <p>Browser storage and external services in this template.</p>
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
        <h2>Use of cookies</h2>
        <p>
          The template’s own code does not use cookies or persistent browser storage. Filters,
          search and accordions run within the page.
        </p>
        <h2>Maps and fonts</h2>
        <p>
          Fonts and images load from local files. The contact page embeds a Google Map. Google
          determines the privacy and cookie terms of this external service, and connection
          information may be shared when the map is displayed.
        </p>
        <h2>Adding other services</h2>
        <p>
          If analytics, advertising, live chat or other external services are added, review their
          storage behaviour and update this notice and any consent mechanism to reflect the actual
          implementation.
        </p>
        <nuxt-link class="text-link" to="/privacy"
          >Back to the privacy notice<svg
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
