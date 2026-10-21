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
          <nuxt-link to="/tr/practice-areas">Faaliyet Alanları</nuxt-link>
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
          <span aria-current="page">Ceza Hukuku</span>
        </nav>
        <h1>Ceza Hukuku</h1>
        <p>Soruşturma ve yargılama süreçlerinde savunma hakkına odaklanan hukuki destek.</p>
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
      <div class="container detail-layout">
        <article class="prose">
          <div class="detail-icon">
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
              <path d="m12 2 9 4v6c0 5-9 10-9 10S3 17 3 12V6l9-4Z"></path>
              <path d="m8 12 3 3 5-6"></path>
            </svg>
          </div>
          <h2>Her ayrıntıyı birlikte değerlendirelim.</h2>
          <p class="lead">
            Ceza hukukunda her dosyanın kendine özgü koşulları vardır. Sürecin aşamalarını, mevcut
            belgeleri ve başvuru yollarını dikkatle ele alırız.
          </p>
          <h3>Ele aldığımız konular</h3>
          <ul>
            <li>Soruşturma sürecinde destek</li>
            <li>Ceza yargılaması</li>
            <li>Şikâyet ve savunma hazırlığı</li>
          </ul>
          <h3>Çalışma yaklaşımımız</h3>
          <p>
            Öncelikle konunuzu ve beklentilerinizi dinleriz. Mevcut belgeleri inceler, ihtiyaç
            duyulabilecek ek bilgileri belirleriz. Ardından seçenekleri ve çalışma kapsamını sizinle
            birlikte değerlendiririz.
          </p>
          <h3>Görüşme öncesinde</h3>
          <p>
            Konuyla ilgili sözleşme, yazışma, bildirim ve diğer belgelerin tarih sırasıyla
            hazırlanması faydalıdır. İlk iletişimde genel bir konu özeti paylaşmanız yeterlidir.
          </p>
          <aside class="info-note">
            Bu sayfa, şablon kapsamında hazırlanmış bir faaliyet alanı tanıtımıdır. Somut bir konuya
            ilişkin hukuki görüş içermez.
          </aside>
        </article>
        <aside class="detail-sidebar">
          <div class="sidebar-panel">
            <h2>Faaliyet alanları</h2>
            <nuxt-link to="/tr/practice-areas/family"
              >Aile Hukuku<svg
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
            </nuxt-link>
            <nuxt-link to="/tr/practice-areas/commerce"
              >Ticaret Hukuku<svg
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
            </nuxt-link>
            <nuxt-link to="/tr/practice-areas/employment"
              >İş Hukuku<svg
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
            </nuxt-link>
            <nuxt-link to="/tr/practice-areas/criminal"
              >Ceza Hukuku<svg
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
            </nuxt-link>
            <nuxt-link to="/tr/practice-areas/inheritance"
              >Miras Hukuku<svg
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
            </nuxt-link>
            <nuxt-link to="/tr/practice-areas/realestate"
              >Gayrimenkul Hukuku<svg
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
            </nuxt-link>
          </div>
          <div class="sidebar-contact">
            <h2>Bir sorunuz mu var?</h2>
            <p>Konunuzu birlikte değerlendirmek için iletişim kurun.</p>
            <nuxt-link class="button" to="/tr/contact"
              >Görüşme talebi<svg
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
        </aside>
      </div>
    </section>
    <section class="section surface">
      <div class="container">
        <div class="section-head">
          <h2>İlgili okumalar</h2>
          <nuxt-link class="text-link" to="/tr/blog"
            >Tüm makaleler<svg
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
        <public-journal :limit="3"></public-journal>
      </div>
    </section>
  </div>
</template>
