<template>
  <div>
    <section class="hero">
      <div class="hero-visual">
        <picture>
          <source srcset="/assets/images/hero.webp" type="image/webp" />
          <img
            class=""
            src="/assets/images/hero.png"
            alt="İstanbul manzarasına açılan, güneş ışığı alan sütunlu ofis mimarisi"
            width="1536"
            height="1024"
            fetchpriority="high"
            decoding="async"
          />
        </picture>
      </div>
      <div class="hero-shade"></div>
      <div class="container hero-inner">
        <div class="hero-copy">
          <div class="hero-intro"><span> </span> Lexviora Hukuk &amp; Danışmanlık</div>
          <h1>
            Hukuka özen.<br />
            Geleceğe güven.
          </h1>
          <p>
            Her hukuki meselenin ardında bir insan hikâyesi var.<br />
            Haklarınızı anlamanız, seçeneklerinizi görmeniz<br />
            ve güvenle ilerlemeniz için yanınızdayız.
          </p>
          <div class="hero-actions">
            <nuxt-link class="button" to="/tr/practice-areas"
              >Faaliyet alanlarımız<svg
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
            <nuxt-link class="button button-outline" to="/tr/blog"
              >Makaleleri keşfedin<svg
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
          <div class="hero-location">
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
              <path d="M19 10c0 5-7 11-7 11S5 15 5 10a7 7 0 1 1 14 0Z"></path>
              <circle cx="12" cy="10" r="2"></circle>
            </svg>
            İstanbul merkezli, insan odaklı.
          </div>
        </div>
        <nuxt-link class="hero-seal" aria-label="Lexviora yaklaşımını keşfedin" to="/tr/about">
          <svg viewBox="0 0 120 120" aria-hidden="true">
            <defs>
              <path id="sealPath" d="M60 12a48 48 0 1 1-.1 0"></path>
            </defs>
            <text>
              <textPath href="#sealPath" textLength="293">Hukuka özen · İnsana saygı ·</textPath>
            </text>
          </svg>
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
        </nuxt-link>
      </div>
      <div class="hero-bottom">
        <span>Her adımda açıklık, her ilişkide güven.</span>
        <a href="#faaliyetler">Keşfet <span>↓</span> </a>
      </div>
    </section>
    <div class="principles">
      <div class="container principles-inner">
        <div>
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
            <rect x="5" y="10" width="14" height="11" rx="1"></rect>
            <path d="M8 10V6a4 4 0 0 1 8 0v4m-4 5v2"></path>
          </svg>
          <span>Gizliliğe saygı<small>Bilginizi özenle koruruz.</small> </span>
        </div>
        <div>
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
            <path d="M21 11a8 8 0 0 1-8 8H8l-5 3V7a5 5 0 0 1 5-5h8a5 5 0 0 1 5 5v4Z"></path>
            <path d="M7 8h10M7 12h7"></path>
          </svg>
          <span>Açık iletişim<small>Hukuku anlaşılır kılarız.</small> </span>
        </div>
        <div>
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
          <span>Bağımsız yaklaşım<small>Her konuyu dikkatle değerlendiririz.</small> </span>
        </div>
      </div>
    </div>
    <section class="section practice-section" id="faaliyetler">
      <div class="container">
        <div class="section-head">
          <div>
            <span class="section-kicker">Faaliyet alanlarımız</span>
            <h2>
              Hayatın her alanında,<br />
              hukukun yanında.
            </h2>
          </div>
          <div>
            <p>
              Bireylerin ve kurumların hukuki ihtiyaçlarını,<br />
              her konunun kendine özgü koşullarıyla ele alıyoruz.
            </p>
            <nuxt-link class="text-link" to="/tr/practice-areas"
              >Tüm faaliyet alanları<svg
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
        </div>
        <public-practices></public-practices>
      </div>
    </section>
    <section class="about-section section" id="hakkimizda">
      <div class="container about-grid">
        <div class="about-image">
          <picture>
            <source srcset="/assets/images/office.webp" type="image/webp" />
            <img
              class=""
              src="/assets/images/office.png"
              alt="Avukat ve danışanın aydınlık ofiste görüşmesi"
              width="1536"
              height="1024"
              loading="lazy"
              decoding="async"
            />
          </picture>
          <div class="image-caption">Birlikte düşünür, özenle ilerleriz.</div>
          <span class="image-line" aria-hidden="true"> </span>
        </div>
        <div class="about-copy">
          <span class="section-kicker">Bizi tanıyın</span>
          <h2>
            Önce dinleriz.<br />
            Sonra birlikte<br />
            yol alırız.
          </h2>
          <p>
            Lexviora’da hukuku yalnızca kurallar bütünü olarak değil, insanların hayatına dokunan
            bir sorumluluk olarak görüyoruz.
          </p>
          <p>
            Her dosyaya dikkatle, her iletişime açıklıkla yaklaşıyoruz. İhtiyaçlarınızı anlamak,
            seçeneklerinizi birlikte değerlendirmek ve süreç boyunca sizi bilgilendirmek çalışma
            anlayışımızın temelini oluşturuyor.
          </p>
          <div class="about-values">
            <span>
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
              Mesleki özen</span
            >
            <span>
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
                <path d="M21 11a8 8 0 0 1-8 8H8l-5 3V7a5 5 0 0 1 5-5h8a5 5 0 0 1 5 5v4Z"></path>
                <path d="M7 8h10M7 12h7"></path>
              </svg>
              Anlaşılır iletişim</span
            >
          </div>
          <nuxt-link class="text-link" to="/tr/about"
            >Yaklaşımımızı tanıyın<svg
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
      </div>
    </section>
    <section class="section featured-section">
      <div class="container">
        <div class="section-head">
          <div>
            <span class="section-kicker">Öne çıkan makaleler</span>
            <h2>
              Bilgi, doğru bir<br />
              başlangıçtır.
            </h2>
          </div>
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
        <public-featured-journal></public-featured-journal>
      </div>
    </section>
    <section class="section insights-section">
      <div class="container" data-live-filters="">
        <div class="section-head">
          <div>
            <span class="section-kicker">Hukuki içerikler</span>
            <h2>Hukuka dair güncel okumalar.</h2>
          </div>
          <nuxt-link class="text-link" to="/tr/home-editorial"
            >Hukuk günlüğü<svg
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
        <p class="empty-state" hidden="">
          Bu kategoride görüntülenen yazı yok.
          <nuxt-link to="/tr/blog">Tüm makalelere göz atın.</nuxt-link>
        </p>
      </div>
    </section>
    <section class="section team-section">
      <div class="container">
        <div class="section-head">
          <div>
            <span class="section-kicker">Avukatlarımız</span>
            <h2>
              Aynı ilkelerde buluşan,<br />
              farklı bakış açıları.
            </h2>
          </div>
          <div>
            <p>
              Özen, bilgi ve sorumluluğu<br />
              ortak bir çalışma anlayışında birleştiriyoruz.
            </p>
            <nuxt-link class="text-link" to="/tr/attorneys"
              >Ekibimizi tanıyın<svg
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
        </div>
        <public-team></public-team>
      </div>
    </section>
    <section class="section approach-section">
      <div class="container">
        <div class="section-head">
          <div>
            <span class="section-kicker">Çalışma yaklaşımımız</span>
            <h2>Her aşamada ne bekleyeceğinizi bilin.</h2>
          </div>
          <p>
            İlk iletişimden süreç takibine,<br />
            açık ve düzenli bir çalışma.
          </p>
        </div>
        <div class="steps">
          <div class="step">
            <span class="step-number">01</span>
            <h3>İlk iletişim</h3>
            <p>
              Konunuzu dinler, görüşmenin kapsamını ve ihtiyaç duyulabilecek belgeleri birlikte
              belirleriz.
            </p>
          </div>
          <div class="step">
            <span class="step-number">02</span>
            <h3>Hukuki değerlendirme</h3>
            <p>
              Belgeleri ve koşulları inceler, izlenebilecek yollar hakkında anlaşılır bilgi sunarız.
            </p>
          </div>
          <div class="step">
            <span class="step-number">03</span>
            <h3>Süreç ve bilgilendirme</h3>
            <p>
              Kararlaştırılan çalışma kapsamında gelişmeleri paylaşır, sorularınızı düzenli olarak
              ele alırız.
            </p>
          </div>
        </div>
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
    <section class="section faq-section">
      <div class="container faq-grid">
        <div>
          <span class="section-kicker">Sık sorulan sorular</span>
          <h2>
            Aklınızdaki<br />
            sorular için.
          </h2>
          <p>
            İlk adımı atmadan önce<br />
            bilmek isteyebilecekleriniz.
          </p>
          <nuxt-link class="text-link" to="/tr/faq"
            >Tüm soruları inceleyin<svg
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
        <public-faqs></public-faqs>
      </div>
    </section>
    <section class="contact-section section" id="iletisim">
      <div class="container contact-inner">
        <div>
          <span class="section-kicker">İletişim</span>
          <h2>
            Birlikte<br />
            değerlendirelim.
          </h2>
          <p>
            Görüşme talebinizi paylaşın.<br />
            Konunuzu dinlemek için buradayız.
          </p>
          <nuxt-link class="button" to="/tr/contact"
            >İletişime geçin<svg
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
        <div class="contact-details">
          <div>
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
              <path d="M19 10c0 5-7 11-7 11S5 15 5 10a7 7 0 1 1 14 0Z"></path>
              <circle cx="12" cy="10" r="2"></circle>
            </svg>
            <div>
              <h3>Ofisimiz</h3>
              <p>
                Levent, Büyükdere Caddesi<br />
                Beşiktaş, İstanbul
              </p>
              <a
                href="https://www.google.com/maps/search/?api=1&amp;query=Levent+Istanbul"
                target="_blank"
                rel="noopener noreferrer"
                >Bölgeyi haritada görün
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
              </a>
            </div>
          </div>
          <div>
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
              <rect x="3" y="5" width="18" height="14" rx="1"></rect>
              <path d="m3 6 9 7 9-7"></path>
            </svg>
            <div>
              <h3>Bize yazın</h3>
              <a href="mailto:merhaba@lexviora.example">merhaba@lexviora.example</a>
              <p>Hafta içi 09.00 – 18.00</p>
            </div>
          </div>
          <p class="demo-note">İletişim bilgileri şablon gösterimi içindir.</p>
        </div>
      </div>
    </section>
  </div>
</template>
