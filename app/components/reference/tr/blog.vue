<template>
  <div>
    <section class="page-heading">
      <div class="container">
        <nav class="breadcrumbs" aria-label="İçerik yolu">
          <nuxt-link to="/tr/">Ana Sayfa</nuxt-link>
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
          <span aria-current="page">Hukuka dair düşünceler.</span>
        </nav>
        <h1>Hukuka dair düşünceler.</h1>
        <p>Günlük hayatı ve iş dünyasını ilgilendiren konulara anlaşılır bir bakış.</p>
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
      <div class="container" data-live-filters="">
        <div class="blog-toolbar">
          <form class="search-form" action="/tr/search" method="get" role="search">
            <label class="sr-only" for="search-field">Makale ara</label>
            <input
              id="search-field"
              name="q"
              type="search"
              placeholder="Konu, kavram veya makale arayın…"
              maxlength="120"
            />
            <button type="submit" aria-label="Makalelerde ara">
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
          <div class="view-switch" aria-label="Görünüm">
            <nuxt-link to="/tr/blog">Grid</nuxt-link>
            <nuxt-link to="/tr/blog-list">Liste</nuxt-link>
          </div>
        </div>

        <p class="filter-status sr-only" aria-live="polite" aria-atomic="true"></p>
        <h2 class="sr-only">Tüm makaleler</h2>
        <public-journal :limit="3" :filterable="true"></public-journal>
        <p class="empty-state" hidden="">
          Bu kategoride henüz yazı yok. Başka bir kategori seçebilirsiniz.
        </p>
      </div>
    </section>
  </div>
</template>
