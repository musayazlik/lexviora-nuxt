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
          <span aria-current="page">Lexviora dokümantasyonu</span>
        </nav>
        <h1>Lexviora dokümantasyonu</h1>
        <p>Kurulum, sayfalar, görseller ve özelleştirme rehberi.</p>
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
      <article class="container narrow prose">
        <h2>Hızlı başlangıç</h2>
        <p>
          Şablon, derleme veya framework gerektirmeyen statik HTML, CSS ve JavaScript dosyalarından
          oluşur. Ana sayfa için index.html dosyasını açın veya proje klasöründe
          <code>python -m http.server 3000</code> çalıştırın.
        </p>
        <h2>18 temel sayfa şablonu</h2>
        <ul class="template-list">
          <li>
            <nuxt-link to="/tr/">index.html</nuxt-link>
          </li>
          <li>
            <nuxt-link to="/tr/home-editorial">home-editorial.html</nuxt-link>
          </li>
          <li>
            <nuxt-link to="/tr/about">about.html</nuxt-link>
          </li>
          <li>
            <nuxt-link to="/tr/practice-areas">practice-areas.html</nuxt-link>
          </li>
          <li>
            <nuxt-link to="/tr/practice-areas/family">practice-detail.html</nuxt-link>
          </li>
          <li>
            <nuxt-link to="/tr/attorneys">attorneys.html</nuxt-link>
          </li>
          <li>
            <nuxt-link to="/tr/attorneys/deniz">attorney-detail.html</nuxt-link>
          </li>
          <li>
            <nuxt-link to="/tr/blog">blog.html</nuxt-link>
          </li>
          <li>
            <nuxt-link to="/tr/blog-list">blog-list.html</nuxt-link>
          </li>
          <li>
            <nuxt-link to="/tr/blog/sozlesme">blog-detail.html</nuxt-link>
          </li>
          <li>
            <nuxt-link to="/tr/blog-category">blog-category.html</nuxt-link>
          </li>
          <li>
            <nuxt-link to="/tr/search">search.html</nuxt-link>
          </li>
          <li>
            <nuxt-link to="/tr/legal-guides">legal-guides.html</nuxt-link>
          </li>
          <li>
            <nuxt-link to="/tr/glossary">glossary.html</nuxt-link>
          </li>
          <li>
            <nuxt-link to="/tr/faq">faq.html</nuxt-link>
          </li>
          <li>
            <nuxt-link to="/tr/contact">contact.html</nuxt-link>
          </li>
          <li>
            <nuxt-link to="/tr/privacy">privacy.html</nuxt-link>
          </li>
          <li>
            <nuxt-link to="/tr/404">404.html</nuxt-link>
          </li>
        </ul>
        <p>
          Ek olarak çerez açıklaması, bu dokümantasyon sayfası, faaliyet alanları, avukatlar ve
          makaleler için örnek detay sayfaları bulunur.
        </p>
        <h2>Renkler ve yazı karakterleri</h2>
        <p>
          css/style.css dosyasındaki :root bölümünden Midnight Navy, Ivory, Muted Gold ve Forest
          renklerini değiştirebilirsiniz. Başlıklarda Cormorant Garamond, gövde metinlerinde Manrope
          kullanılır. Fontlar assets/fonts klasöründedir.
        </p>
        <h2>İçerikleri değiştirme</h2>
        <p>
          HTML dosyalarını doğrudan düzenleyebilirsiniz. Ortak parçalar ve demo verileri
          scripts/build.mjs içindedir. Kaynağı değiştirip
          <code>node scripts/build.mjs</code> komutunu çalıştırırsanız HTML dosyaları yeniden
          oluşturulur. Manuel HTML düzenlemeleri yeniden üretimde değişir.
        </p>
        <h2>Görseller</h2>
        <p>
          assets/images klasöründe yapay zekâ ile üretilmiş PNG orijinalleri ve optimize WebP
          kopyaları yer alır. Fotoğraflar gerçek bir büroyu veya avukatları temsil etmez. Görsel
          istemleri ve üretim bilgileri IMAGE-CREDITS.md dosyasındadır. İkonlar tutarlı çizgi
          kalınlığında, erişilebilir SVG olarak hazırlanmıştır.
        </p>
        <h2>Etkileşimler</h2>
        <p>
          Mobil menü, kategori filtreleri, makale arama, sözlük arama, paylaşım bağlantısı
          kopyalama, yazdırma, sık sorulan sorular ve form doğrulaması js/main.js dosyasında
          yönetilir. Hareket azaltma tercihi desteklenir.
        </p>
        <h2>İletişim formu</h2>
        <p>
          Form veri kaydetmez veya göndermez. Geçerli bilgilerle bir mailto bağlantısı ve
          indirilebilir .eml dosyası oluşturur. Gerçek alıcı adresini js/main.js ve HTML
          kaynaklarında değiştirin. Sunucu üzerinden gönderim için bir form servisi veya backend
          entegrasyonu ayrıca gerekir.
        </p>
        <h2>Yayına hazırlık</h2>
        <p>
          İsimleri, mesleki bilgileri, görselleri, adres ve telefonları gerçek bilgilerle
          değiştirin. Gizlilik ve çerez açıklamalarını gerçek veri işleme süreçlerinize göre
          düzenleyin. Statik barındırma hizmetinizde 404.html dosyasını hata sayfası olarak
          tanımlayın.
        </p>
      </article>
    </section>
  </div>
</template>
