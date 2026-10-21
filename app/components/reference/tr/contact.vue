<template>
<div>
<section class="page-heading">
<div class="container">
<nav class="breadcrumbs" aria-label="İçerik yolu">
<nuxt-link to="/tr/">Ana Sayfa</nuxt-link>
<svg class="icon " width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
<path d="m9 5 7 7-7 7"></path>
</svg>
<span aria-current="page">Tanışmak için bir ilk adım.</span>
</nav>
<h1>Tanışmak için bir ilk adım.</h1>
<p>Görüşme talebinizi paylaşın, konunuzu birlikte değerlendirelim.</p>
</div>
<span class="heading-watermark" aria-hidden="true">
<svg class="brand-mark" viewBox="0 0 48 48" fill="none" aria-hidden="true">
<path d="M24 5v35M14 41h20M9 14h30M24 5l-4 5m4-5 4 5M13 14 5 29h16l-8-15Zm22 0-8 15h16l-8-15Z" stroke="currentColor" stroke-width="1.6"></path>
<path d="M5 29c1 8 15 8 16 0m6 0c1 8 15 8 16 0" stroke="currentColor" stroke-width="1.6"></path>
</svg>
</span>
</section>
<section class="section">
<div class="container contact-page-grid">
<div>
<h2>Bize ulaşın.</h2>
<p>İlk iletişimde konunuzu genel hatlarıyla paylaşabilirsiniz. Hassas bilgi ve belgeler için güvenli iletişim yöntemi belirlenmesini bekleyin.</p>
<div class="contact-info-list">
<div>
<svg class="icon " width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
<path d="M19 10c0 5-7 11-7 11S5 15 5 10a7 7 0 1 1 14 0Z"></path>
<circle cx="12" cy="10" r="2"></circle>
</svg>
<span>
<strong>Ofis</strong>Levent, Büyükdere Caddesi<br> Beşiktaş, İstanbul</span>
</div>
<div>
<svg class="icon " width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
<path d="m8 3 3 5-3 3c1.5 3 3.5 5 6.5 6.5l3-3 4.5 3c0 3-2 4-4 3.5C9 19 5 15 3 7 2.5 5 4 3 8 3Z"></path>
</svg>
<span>
<strong>Telefon</strong>
<span>+90 (212) 000 00 00</span>
<small>Örnek numara — aktif değildir</small>
</span>
</div>
<div>
<svg class="icon " width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
<rect x="3" y="5" width="18" height="14" rx="1"></rect>
<path d="m3 6 9 7 9-7"></path>
</svg>
<span>
<strong>E-posta</strong>
<a href="mailto:merhaba@lexviora.example">merhaba@lexviora.example</a>
<small>Örnek adres — aktif değildir</small>
</span>
</div>
<div>
<svg class="icon " width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
<circle cx="12" cy="12" r="9"></circle>
<path d="M12 7v5l3 2"></path>
</svg>
<span>
<strong>Çalışma saatleri</strong>Hafta içi 09.00 – 18.00</span>
</div>
</div>
</div>
<form class="contact-form" id="contact-form" novalidate="" data-contact-form="">
<h2>Görüşme talebi</h2>
<p>Talebinizi iletin; görüşme için sizinle iletişime geçelim.</p>
<div class="form-errors" role="alert" tabindex="-1" hidden="">
</div>
<div class="form-row">
<div>
<label for="name">Adınız soyadınız</label>
<input id="name" name="name" autocomplete="name" required="" maxlength="100">
<span class="field-error" id="name-error">
</span>
</div>
<div>
<label for="email">E-posta adresiniz</label>
<input id="email" name="email" type="email" autocomplete="email" required="" maxlength="200">
<span class="field-error" id="email-error">
</span>
</div>
</div>
<label for="subject">Görüşme konusu</label>
<select id="subject" name="subject">
<option value="Genel görüşme">Bir konu seçin</option>Genel görüşme
<option>Aile Hukuku</option>
<option>Ticaret Hukuku</option>
<option>İş Hukuku</option>
<option>Ceza Hukuku</option>
<option>Miras Hukuku</option>
<option>Gayrimenkul Hukuku</option>
</select>
<label for="message">Kısaca konunuz</label>
<textarea id="message" name="message" rows="5" required="" minlength="10" maxlength="2000" aria-describedby="message-hint message-error"></textarea>
<small id="message-hint">En az 10 karakter. Hassas kişisel veri veya belge paylaşmayın.</small>
<span class="field-error" id="message-error">
</span>
<label class="checkbox-label">
<input id="consent" type="checkbox" required="">
<span><a href="/tr/privacy">Gizlilik bildirimini</a> okudum ve iletişim kurulmasını kabul ediyorum.</span>
</label>
<span class="field-error" id="consent-error">
</span>
<button class="button" type="submit">Mesajı gönder</button>
<p class="form-status" role="status" aria-atomic="true">
</p>



</form>
</div>
</section>
<section class="map-section map-fullwidth" aria-label="İstanbul Levent bölgesi haritası">
<iframe class="location-map" title="Google Maps üzerinde İstanbul Levent bölgesi" src="https://maps.google.com/maps?q=Levent%2C%20Istanbul&amp;z=14&amp;output=embed" width="1920" height="540" loading="lazy" referrerpolicy="no-referrer-when-downgrade" allowfullscreen="">
</iframe>
<div class="map-location-card">
<span class="map-card-icon">
<svg class="icon " width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
<path d="M19 10c0 5-7 11-7 11S5 15 5 10a7 7 0 1 1 14 0Z"></path>
<circle cx="12" cy="10" r="2"></circle>
</svg>
</span>
<div>
<span class="map-card-label">Bizi nerede bulabilirsiniz?</span>
<h2>İstanbul, Levent</h2>
<p>Büyükdere Caddesi, Beşiktaş<br>Örnek ofis bölgesi</p>
<a href="https://www.google.com/maps/search/?api=1&amp;query=Levent+Istanbul" target="_blank" rel="noopener noreferrer">Google Maps’te açın <svg class="icon " width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
<path d="M6 18 18 6M6 6h12v12"></path>
</svg>
</a>
</div>
</div>
<div class="map-region-note">Harita bölgeyi gösterir; kesin ofis konumu değildir.</div>
</section>
</div>
</template>
