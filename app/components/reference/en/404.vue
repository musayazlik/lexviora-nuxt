<template>
  <div>
    <section class="not-found">
      <div class="container">
        <span class="error-code">404</span>
        <h1>This page seems to have lost its way.</h1>
        <p>
          The link may have changed or the page may have moved.<br />
          Start again from the homepage, or find a useful read in the journal.
        </p>
        <div class="hero-actions">
          <nuxt-link class="button" to="/"
            >Back to home<svg
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
          <nuxt-link class="button button-outline" to="/blog"
            >Explore the journal<svg
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
        </div>
        <form class="search-form" action="/search" method="get" role="search">
          <label class="sr-only" for="search-field">Search articles</label>
          <input
            id="search-field"
            name="q"
            type="search"
            placeholder="Search a topic, term or article…"
            maxlength="120"
          />
          <button type="submit" aria-label="Search the journal">
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
              <circle cx="10.5" cy="10.5" r="6.5"></circle>
              <path d="m16 16 5 5"></path>
            </svg>
          </button>
        </form>
      </div>
    </section>
  </div>
</template>
