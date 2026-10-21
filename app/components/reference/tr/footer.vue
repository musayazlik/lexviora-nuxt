<script setup lang="ts">
const switchLocalePath = useContentSwitchLocalePath();
</script>
<template>
  <div>
    <footer class="site-footer">
      <div class="container">
        <div class="footer-main">
          <div class="footer-brand">
            <nuxt-link class="brand" aria-label="Lexviora ana sayfa" to="/tr/">
              <picture class="brand-picture">
                <source srcset="/assets/brand/lexviora-logo-navy.webp" type="image/webp" />
                <img
                  class="brand-image"
                  src="/assets/brand/lexviora-logo-navy.png"
                  width="2172"
                  height="724"
                  alt="Lexviora Legal &amp; Advisory"
                  decoding="async"
                />
              </picture>
            </nuxt-link>
            <p>
              Her hukuki meselenin ardında<br />
              bir insan, her adımda özen.
            </p>
            <span>İstanbul, Türkiye</span>
          </div>
          <div>
            <h2>Keşfedin</h2>
            <nuxt-link to="/tr/about">Hakkımızda</nuxt-link>
            <nuxt-link to="/tr/attorneys">Avukatlarımız</nuxt-link>
            <nuxt-link to="/tr/blog">Makaleler</nuxt-link>
            <nuxt-link to="/tr/home-editorial">Hukuk günlüğü</nuxt-link>
            <nuxt-link to="/tr/contact">İletişim</nuxt-link>
          </div>
          <div>
            <h2>Faaliyet alanları</h2>
            <nuxt-link to="/tr/practice-areas/family">Aile Hukuku</nuxt-link>
            <nuxt-link to="/tr/practice-areas/commerce">Ticaret Hukuku</nuxt-link>
            <nuxt-link to="/tr/practice-areas/employment">İş Hukuku</nuxt-link>
            <nuxt-link to="/tr/practice-areas/criminal">Ceza Hukuku</nuxt-link>
            <nuxt-link to="/tr/practice-areas/inheritance">Miras Hukuku</nuxt-link>
            <nuxt-link to="/tr/practice-areas/realestate">Gayrimenkul Hukuku</nuxt-link>
          </div>
          <div>
            <h2>Bilgi &amp; kaynaklar</h2>
            <nuxt-link to="/tr/legal-guides">Hukuk rehberi</nuxt-link>
            <nuxt-link to="/tr/glossary">Hukuk sözlüğü</nuxt-link>
            <nuxt-link to="/tr/faq">Sık sorulan sorular</nuxt-link>
            <nuxt-link to="/tr/privacy">Gizlilik politikası</nuxt-link>
            <nuxt-link to="/tr/cookies">Çerez politikası</nuxt-link>
            <nuxt-link to="/tr/documentation">Şablon dokümantasyonu</nuxt-link>
          </div>
        </div>
        <div class="footer-bottom">
          <span>© <span data-year="">2026</span> Lexviora. Tüm hakları saklıdır.</span>
          <a href="#top"
            >Yukarı dön
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
              <path d="M5 12h14m-6-6 6 6-6 6"></path>
            </svg>
          </a>
        </div>
        <p class="legal-note">
          Bu site bir HTML şablon demosudur. İsimler, fotoğraflar ve büro bilgileri örnektir.
          İçerikler genel bilgilendirme amaçlıdır; kişisel hukuki görüş oluşturmaz.
        </p>
      </div>
    </footer>
  </div>
</template>
