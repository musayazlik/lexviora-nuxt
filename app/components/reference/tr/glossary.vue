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
          <span aria-current="page">Hukukun dilini anlamak.</span>
        </nav>
        <h1>Hukukun dilini anlamak.</h1>
        <p>Sık karşılaşılan kavramlar için kısa ve sade açıklamalar.</p>
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
      <div class="container narrow">
        <label class="field-label" for="glossary-search">Kavram arayın</label>
        <input
          class="text-input"
          id="glossary-search"
          type="search"
          placeholder="Örneğin: arabuluculuk"
        />

        <public-glossary></public-glossary>
        <p class="empty-state" hidden="">Bu kavram bulunamadı. Başka bir sözcük deneyin.</p>
        <p class="demo-note">
          Tanımlar temel bilgilendirme içindir; her kavramın kapsamı, ilgili düzenlemeye ve somut
          olaya göre değişebilir.
        </p>
      </div>
    </section>
  </div>
</template>
