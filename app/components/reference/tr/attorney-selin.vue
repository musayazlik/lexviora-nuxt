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
          <nuxt-link to="/tr/attorneys">Avukatlarımız</nuxt-link>
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
          <span aria-current="page">Av. Selin Yılmaz</span>
        </nav>
        <h1>Av. Selin Yılmaz</h1>
        <p>Aile &amp; Ceza Hukuku</p>
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
      <div class="container profile-layout">
        <div class="profile-photo">
          <picture>
            <source srcset="/assets/images/selin.webp" type="image/webp" />
            <img
              class=""
              src="/assets/images/selin.png"
              alt="Av. Selin Yılmaz için oluşturulan temsili portre"
              width="1024"
              height="1536"
              loading="lazy"
              decoding="async"
            />
          </picture>
        </div>
        <article class="prose">
          <span class="section-kicker">Ortak Avukat</span>
          <h2>Av. Selin Yılmaz</h2>
          <p class="lead">
            Aile ilişkilerinden doğan uyuşmazlıklar ve ceza hukuku alanlarında; mahremiyet, dikkatli
            dinleme ve düzenli bilgilendirmeye önem verir.
          </p>
          <h3>Çalışma alanları</h3>
          <p>Aile &amp; Ceza Hukuku</p>
          <h3>Yaklaşımı</h3>
          <p>
            Her konunun kişisel ve kurumsal bağlamını anlamaya önem verir. İlk görüşmeden itibaren
            çalışma kapsamının, beklentilerin ve iletişim yönteminin açıkça belirlenmesini gözetir.
          </p>
          <h3>Diller</h3>
          <p>Türkçe, İngilizce</p>
          <nuxt-link class="button" to="/tr/contact"
            >Görüşme talebi oluşturun<svg
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
          <p class="demo-note spaced">
            Bu profil kurgusaldır. Portre yapay zekâ ile oluşturulmuştur. Yayından önce gerçek
            avukatın mesleki bilgileriyle değiştirin.
          </p>
        </article>
      </div>
    </section>
  </div>
</template>
