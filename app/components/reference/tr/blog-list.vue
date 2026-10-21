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
          <span aria-current="page">Makaleler</span>
        </nav>
        <h1>Makaleler</h1>
        <p>Geniş bir bakış için, sade bir okuma listesi.</p>
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
          <div class="view-switch">
            <nuxt-link to="/tr/blog">Grid</nuxt-link>
            <nuxt-link to="/tr/blog-list">Liste</nuxt-link>
          </div>
        </div>

        <p class="filter-status sr-only" aria-live="polite" aria-atomic="true"></p>
        <h2 class="sr-only">Tüm makaleler</h2>
        <div class="article-list" data-filter-grid="">
          <article
            class="article-card"
            data-category="Ticaret Hukuku"
            data-title="Bir sözleşmeyi imzalamadan önce nelere dikkat etmelisiniz?"
          >
            <nuxt-link
              class="article-image"
              tabindex="-1"
              aria-hidden="true"
              to="/tr/blog/sozlesme"
            >
              <picture>
                <source srcset="/assets/images/article.webp" type="image/webp" />
                <img
                  class=""
                  src="/assets/images/article.png"
                  alt=""
                  width="1536"
                  height="1024"
                  loading="lazy"
                  decoding="async"
                />
              </picture>
            </nuxt-link>
            <div class="article-meta">
              <nuxt-link to="/tr/blog-category?category=Ticaret%20Hukuku">Ticaret Hukuku</nuxt-link>
              <span>6 dk okuma</span>
            </div>
            <h3>
              <nuxt-link to="/tr/blog/sozlesme"
                >Bir sözleşmeyi imzalamadan önce nelere dikkat etmelisiniz?</nuxt-link
              >
            </h3>
            <p>
              Tarafların yükümlülükleri, sözleşmenin kapsamı ve açık bir dilin önemi üzerine bir
              okuma.
            </p>
            <div class="article-byline">
              <span>Av. Deniz Arslan</span>
              <time datetime="2026-10-16">16 Ekim 2026</time>
            </div>
          </article>
          <article
            class="article-card"
            data-category="Gayrimenkul Hukuku"
            data-title="Kira sözleşmelerinde açık ve anlaşılır bir dilin önemi"
          >
            <nuxt-link class="article-image" tabindex="-1" aria-hidden="true" to="/tr/blog/kira">
              <picture>
                <source srcset="/assets/images/hero.webp" type="image/webp" />
                <img
                  class=""
                  src="/assets/images/hero.png"
                  alt=""
                  width="1536"
                  height="1024"
                  loading="lazy"
                  decoding="async"
                />
              </picture>
            </nuxt-link>
            <div class="article-meta">
              <nuxt-link to="/tr/blog-category?category=Gayrimenkul%20Hukuku"
                >Gayrimenkul Hukuku</nuxt-link
              >
              <span>5 dk okuma</span>
            </div>
            <h3>
              <nuxt-link to="/tr/blog/kira"
                >Kira sözleşmelerinde açık ve anlaşılır bir dilin önemi</nuxt-link
              >
            </h3>
            <p>
              Bir kira ilişkisinde belgelerin düzenli tutulması ve koşulların açıkça yazılması neden
              önemlidir?
            </p>
            <div class="article-byline">
              <span>Av. Emre Aydın</span>
              <time datetime="2026-10-12">12 Ekim 2026</time>
            </div>
          </article>
          <article
            class="article-card"
            data-category="Aile Hukuku"
            data-title="Aile hukukunda ilk görüşmeye nasıl hazırlanabilirsiniz?"
          >
            <nuxt-link class="article-image" tabindex="-1" aria-hidden="true" to="/tr/blog/aile">
              <picture>
                <source srcset="/assets/images/office.webp" type="image/webp" />
                <img
                  class=""
                  src="/assets/images/office.png"
                  alt=""
                  width="1536"
                  height="1024"
                  loading="lazy"
                  decoding="async"
                />
              </picture>
            </nuxt-link>
            <div class="article-meta">
              <nuxt-link to="/tr/blog-category?category=Aile%20Hukuku">Aile Hukuku</nuxt-link>
              <span>4 dk okuma</span>
            </div>
            <h3>
              <nuxt-link to="/tr/blog/aile"
                >Aile hukukunda ilk görüşmeye nasıl hazırlanabilirsiniz?</nuxt-link
              >
            </h3>
            <p>
              İlk görüşmede konuyu daha açık aktarabilmek için belgeleri ve soruları düzenlemeye
              yönelik öneriler.
            </p>
            <div class="article-byline">
              <span>Av. Selin Yılmaz</span>
              <time datetime="2026-10-08">8 Ekim 2026</time>
            </div>
          </article>
          <article
            class="article-card"
            data-category="İş Hukuku"
            data-title="İş ilişkilerinde yazılı kayıt tutmanın önemi"
          >
            <nuxt-link class="article-image" tabindex="-1" aria-hidden="true" to="/tr/blog/is">
              <picture>
                <source srcset="/assets/images/article.webp" type="image/webp" />
                <img
                  class=""
                  src="/assets/images/article.png"
                  alt=""
                  width="1536"
                  height="1024"
                  loading="lazy"
                  decoding="async"
                />
              </picture>
            </nuxt-link>
            <div class="article-meta">
              <nuxt-link to="/tr/blog-category?category=%C4%B0%C5%9F%20Hukuku">İş Hukuku</nuxt-link>
              <span>5 dk okuma</span>
            </div>
            <h3>
              <nuxt-link to="/tr/blog/is">İş ilişkilerinde yazılı kayıt tutmanın önemi</nuxt-link>
            </h3>
            <p>
              İş ilişkisini ilgilendiren belgelerin düzenlenmesi ve saklanmasına genel bir bakış.
            </p>
            <div class="article-byline">
              <span>Av. Emre Aydın</span>
              <time datetime="2026-10-05">5 Ekim 2026</time>
            </div>
          </article>
          <article
            class="article-card"
            data-category="Miras Hukuku"
            data-title="Miras planlaması hakkında konuşmaya nereden başlamalı?"
          >
            <nuxt-link class="article-image" tabindex="-1" aria-hidden="true" to="/tr/blog/miras">
              <picture>
                <source srcset="/assets/images/hero.webp" type="image/webp" />
                <img
                  class=""
                  src="/assets/images/hero.png"
                  alt=""
                  width="1536"
                  height="1024"
                  loading="lazy"
                  decoding="async"
                />
              </picture>
            </nuxt-link>
            <div class="article-meta">
              <nuxt-link to="/tr/blog-category?category=Miras%20Hukuku">Miras Hukuku</nuxt-link>
              <span>7 dk okuma</span>
            </div>
            <h3>
              <nuxt-link to="/tr/blog/miras"
                >Miras planlaması hakkında konuşmaya nereden başlamalı?</nuxt-link
              >
            </h3>
            <p>
              Miras planlamasında kişisel koşulların ve mevcut belgelerin birlikte ele alınması.
            </p>
            <div class="article-byline">
              <span>Av. Deniz Arslan</span>
              <time datetime="2026-10-01">1 Ekim 2026</time>
            </div>
          </article>
          <article
            class="article-card"
            data-category="Ceza Hukuku"
            data-title="Hukuki bir süreçte doğru bilgiye ulaşmak"
          >
            <nuxt-link class="article-image" tabindex="-1" aria-hidden="true" to="/tr/blog/ceza">
              <picture>
                <source srcset="/assets/images/office.webp" type="image/webp" />
                <img
                  class=""
                  src="/assets/images/office.png"
                  alt=""
                  width="1536"
                  height="1024"
                  loading="lazy"
                  decoding="async"
                />
              </picture>
            </nuxt-link>
            <div class="article-meta">
              <nuxt-link to="/tr/blog-category?category=Ceza%20Hukuku">Ceza Hukuku</nuxt-link>
              <span>4 dk okuma</span>
            </div>
            <h3>
              <nuxt-link to="/tr/blog/ceza">Hukuki bir süreçte doğru bilgiye ulaşmak</nuxt-link>
            </h3>
            <p>
              Kaynağın güvenilirliğini, güncelliğini ve konuya uygunluğunu değerlendirmek üzerine.
            </p>
            <div class="article-byline">
              <span>Av. Selin Yılmaz</span>
              <time datetime="2026-09-25">25 Eylül 2026</time>
            </div>
          </article>
          <article
            class="article-card"
            data-category="Hukuk Rehberi"
            data-title="Arabuluculuk görüşmesine hazırlık: sorular ve belgeler"
          >
            <nuxt-link
              class="article-image"
              tabindex="-1"
              aria-hidden="true"
              to="/tr/blog/arabuluculuk"
            >
              <picture>
                <source srcset="/assets/images/article.webp" type="image/webp" />
                <img
                  class=""
                  src="/assets/images/article.png"
                  alt=""
                  width="1536"
                  height="1024"
                  loading="lazy"
                  decoding="async"
                />
              </picture>
            </nuxt-link>
            <div class="article-meta">
              <nuxt-link to="/tr/blog-category?category=Hukuk%20Rehberi">Hukuk Rehberi</nuxt-link>
              <span>6 dk okuma</span>
            </div>
            <h3>
              <nuxt-link to="/tr/blog/arabuluculuk"
                >Arabuluculuk görüşmesine hazırlık: sorular ve belgeler</nuxt-link
              >
            </h3>
            <p>
              Görüşmeye giderken beklentilerinizi ve mevcut belgelerinizi nasıl düzenleyebilirsiniz?
            </p>
            <div class="article-byline">
              <span>Av. Selin Yılmaz</span>
              <time datetime="2026-09-21">21 Eylül 2026</time>
            </div>
          </article>
          <article
            class="article-card"
            data-category="Ticaret Hukuku"
            data-title="Dijital belgelerinizi düzenlemek için bir başlangıç"
          >
            <nuxt-link class="article-image" tabindex="-1" aria-hidden="true" to="/tr/blog/dijital">
              <picture>
                <source srcset="/assets/images/hero.webp" type="image/webp" />
                <img
                  class=""
                  src="/assets/images/hero.png"
                  alt=""
                  width="1536"
                  height="1024"
                  loading="lazy"
                  decoding="async"
                />
              </picture>
            </nuxt-link>
            <div class="article-meta">
              <nuxt-link to="/tr/blog-category?category=Ticaret%20Hukuku">Ticaret Hukuku</nuxt-link>
              <span>3 dk okuma</span>
            </div>
            <h3>
              <nuxt-link to="/tr/blog/dijital"
                >Dijital belgelerinizi düzenlemek için bir başlangıç</nuxt-link
              >
            </h3>
            <p>Dosyaları tarih, konu ve kaynak bilgisiyle saklamak için pratik bir yaklaşım.</p>
            <div class="article-byline">
              <span>Av. Deniz Arslan</span>
              <time datetime="2026-09-15">15 Eylül 2026</time>
            </div>
          </article>
        </div>
        <p class="empty-state" hidden="">Bu kategoride henüz yazı yok.</p>
      </div>
    </section>
  </div>
</template>
