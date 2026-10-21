<template>
  <div>
    <section class="editorial-hero">
      <div class="container">
        <div class="editorial-masthead">
          <span>Lexviora yayınları</span>
          <span>Ekim 2026</span>
        </div>
        <h1>Hukuk günlüğü.</h1>
        <p>Düşünmek, anlamak ve daha bilinçli adımlar atmak için.</p>
        <div class="editorial-feature">
          <div>
            <picture>
              <source srcset="/assets/images/article.webp" type="image/webp" />
              <img
                class=""
                src="/assets/images/article.png"
                alt="Hukuk günlüğü için terazi ve kitap fotoğrafı"
                width="1536"
                height="1024"
                fetchpriority="high"
                decoding="async"
              />
            </picture>
          </div>
          <article>
            <span class="section-kicker">Bu ayın okuması</span>
            <h2>
              <nuxt-link to="/tr/blog/sozlesme"
                >Bir sözleşmeyi imzalamadan önce nelere dikkat etmelisiniz?</nuxt-link
              >
            </h2>
            <p>
              Tarafların yükümlülükleri, sözleşmenin kapsamı ve açık bir dilin önemi üzerine bir
              okuma.
            </p>
            <div class="small-meta">
              <span>Av. Deniz Arslan</span>
              <span>16 Ekim 2026</span>
            </div>
            <nuxt-link class="text-link" to="/tr/blog/sozlesme"
              >Yazıyı okuyun<svg
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
        </div>
      </div>
    </section>
    <section class="section">
      <div class="container" data-live-filters="">
        <div class="section-head">
          <h2>Son yazılar</h2>
          <nuxt-link class="text-link" to="/tr/blog-list"
            >Liste görünümü<svg
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
        </div>

        <p class="filter-status sr-only" aria-live="polite" aria-atomic="true"></p>
        <public-journal :limit="3" :filterable="true"></public-journal>
        <p class="empty-state" hidden="">Bu kategoride henüz yazı yok.</p>
      </div>
    </section>
    <section class="resources section">
      <div class="container resources-inner">
        <div>
          <span class="section-kicker">Bilgiye erişim</span>
          <h2>
            Hukuku daha<br />
            anlaşılır kılıyoruz.
          </h2>
          <p>
            Terimler, temel rehberler ve güvenilir kaynaklar.<br />
            Aradığınız bilgiye bir adım daha yakın olun.
          </p>
          <nuxt-link class="button button-outline" to="/tr/legal-guides"
            >Hukuk rehberini keşfedin<svg
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
        <div class="resource-links">
          <nuxt-link to="/tr/legal-guides">
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
              <path
                d="M12 5c-3-2-6-2-10-1v15c4-1 7-1 10 1m0-15c3-2 6-2 10-1v15c-4-1-7-1-10 1V5Z"
              ></path>
            </svg>
            <span>Hukuk rehberleri<small>Hukuki süreçler için başlangıç noktaları</small> </span>
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
          <nuxt-link to="/tr/glossary">
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
              <path d="M14 2H5v20h14V7l-5-5Zm0 0v6h5M8 12h8M8 16h8"></path>
            </svg>
            <span>Hukuk sözlüğü<small>Hukuki kavramların sade açıklamaları</small> </span>
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
          <nuxt-link to="/tr/legal-guides#kaynaklar">
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
              <path d="M12 3v18M5 21h14M3 7h18M6 7 2 15h8L6 7Zm12 0-4 8h8l-4-8Z"></path>
            </svg>
            <span>Mevzuat kaynakları<small>Resmî ve güncel kaynaklara bağlantılar</small> </span>
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
        </div>
      </div>
    </section>
  </div>
</template>
