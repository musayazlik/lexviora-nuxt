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
          <span aria-current="page">Find a clearer starting point.</span>
        </nav>
        <h1>Find a clearer starting point.</h1>
        <p>Search article titles, topics and descriptions.</p>
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
      <div class="container">
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
        <h2 class="search-title spaced">Start your search</h2>
        <p class="search-status" role="status" aria-atomic="true"></p>
        <public-journal :limit="3"></public-journal>
        <p class="empty-state" hidden="">
          No matching articles were found. Try a different term or
          <nuxt-link to="/blog">browse all articles.</nuxt-link>
        </p>
      </div>
    </section>
  </div>
</template>
