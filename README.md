# Lexviora App

Nuxt 4 tabanlı Lexviora web sitesi + yönetim paneli. `lexviora-html-template/` içindeki
tasarımın uygulamaya dönüştürülmüş hali.

## Stack

| Katman      | Teknoloji                                                              |
| ----------- | ---------------------------------------------------------------------- |
| Framework   | Nuxt 4 (Vue 3, TypeScript)                                             |
| UI          | Nuxt UI v4 + Tailwind CSS v4 (Lexviora paleti ile)                     |
| Auth        | Better Auth (admin / editor rolleri)                                   |
| Veritabanı  | PostgreSQL + Drizzle ORM                                               |
| İçerik dili | Veritabanından yönetilen diller; EN varsayılan, diğer diller `/{code}` |
| SEO         | @nuxtjs/seo + @nuxt/image                                              |
| Deploy      | Docker image → Dokploy                                                 |

## Geliştirme

```sh
# 1. Bağımlılıklar
pnpm install

# 2. PostgreSQL (docker compose ile)
docker compose up db -d

# 3. Migration oluştur ve uygula
pnpm run db:generate   # şema değişince
pnpm run db:migrate

# 4. İlk admin kullanıcısı
pnpm run admin:create -- admin@lexviora.com "GucluBirSifre" "Ad Soyad"

# 5. Çalıştır
pnpm run dev
```

- Site: http://localhost:3000 (EN), http://localhost:3000/tr (TR)
- Admin: http://localhost:3000/admin (giriş: `/admin/login`)

Panel arayüzü İngilizcedir. **Languages** bölümünde Çince (`zh`), İspanyolca (`es`), İngilizce (`en`), Hintçe (`hi`), Arapça (`ar`), Rusça (`ru`), Japonca (`ja`), Almanca (`de`) ve Türkçe (`tr`) hazırdır. Yeni BCP 47 dil kodları panelden eklenebilir; public dil yolları için yeniden derleme gerekmez. Bir dili gizlemek çevirileri silmez. İngilizce varsayılan public dil olarak etkin kalır.

İçerik editörü tüm çevirileri tek API yanıtıyla alır. **Content language** seçimi yalnızca yerel taslağı değiştirir; farklı dillerdeki kaydedilmemiş alanlar korunur. AI çevirisinde kaynak dil ayrıca seçilir. **Pages** bölümündeki `home` ana sayfayı, diğer slug değerleri ilgili public sayfayı düzenler. İngilizce/Türkçe referans şablonlar, ilgili sayfa için kaydedilmiş bir içerik yoksa kullanılmaya devam eder. Diğer hazır dillerin public gezinme metinleri yerelleştirilmiştir; yeni eklenen dillerde arayüz metinleri İngilizceye döner ve içerik seçilen dilde düzenlenir. Mevcut makaleler kendiliğinden çevrilmez; eksik çeviriler başka bir dilde içerik gibi sunulmaz. Arapça ve sağdan sola ayarlanmış ek diller RTL destekler.

## Komutlar

| Komut                   | Açıklama                          |
| ----------------------- | --------------------------------- |
| `pnpm run dev`          | Geliştirme sunucusu               |
| `pnpm run build`        | Production build (`.output/`)     |
| `pnpm run db:generate`  | Şemadan SQL migration üretir      |
| `pnpm run db:migrate`   | Migration'ları uygular            |
| `pnpm run db:studio`    | Drizzle Studio (DB görsel arayüz) |
| `pnpm run admin:create` | Admin kullanıcı oluşturur         |

## Yapı

```
app/                 Ön yüz (Nuxt 4 app dizini)
  layouts/           default (site) + admin (panel)
  pages/             / (site) + /admin (panel)
  middleware/auth.ts Admin oturum kontrolü
server/
  api/auth/          Better Auth handler (/api/auth/*)
  api/admin/         Panel API'leri (rol korumalı)
  database/          Drizzle şeması + migration'lar
  utils/             auth.ts (Better Auth), db.ts (Drizzle)
  plugins/migrate.ts Sunucu başlarken migration (Docker için)
shared/              Sunucu + istemci paylaşılan kod (roller)
i18n/locales/        EN/TR arayüz metinleri
```

## Roller

- **admin**: her şey + kullanıcı yönetimi
- **editor**: içerik oluşturma/düzenleme (publish ve delete yok)

Rol tanımları `shared/permissions.ts` içinde; sunucu ve istemci aynı dosyayı
kullanır. Yeni korumalı API'ler için bkz. `server/api/admin/stats.get.ts`.

## Deploy (Dokploy)

1. Dokploy'da **PostgreSQL** servis oluştur (veya aşağıdaki compose'u kullan).
2. Yeni **Application** oluştur, bu klasörü git repo'suna bağla.
3. Build type: **Dockerfile**.
4. Environment variables:
   - `DATABASE_URL` = `postgres://<user>:<pass>@<db-host>:5432/<db>`
   - `BETTER_AUTH_SECRET` = uzun rastgele bir değer
   - `BETTER_AUTH_URL` = `https://sitedomaininiz.com`
   - `NUXT_PUBLIC_SITE_URL` = `https://sitedomaininiz.com`
   - `RUN_MIGRATIONS=true` (container açılışında migration otomatik uygulanır)
5. Domain bağla (Dokploy reverse proxy + Let's Encrypt).

Docker image migration'ları `MIGRATIONS_DIR=/app/migrations` altında taşır;
`server/plugins/migrate.ts` açılışta uygular.

> Not: Şema değişikliklerinde `pnpm run db:generate` ile migration üretilip
> repoya commit edilmeli — image build sırasında migration üretimi yapılmaz.

## KVKK notları

İletişim formu, çerez ve gizlilik sayfaları static siteden taşınacak. Canlıya
alınmadan önce formun e-posta gönderimi ve log saklama politikaları netleşmeli.

## SEO ve sosyal medya paylaşımı

Her herkese açık sayfa ilk sunucu HTML yanıtında başlık, açıklama, canonical,
EN/TR hreflang, Open Graph ve Twitter/X `summary_large_image` etiketleri üretir.
Dil bazında 1200×630 marka kartları `public/assets/social/` altındadır. Makaleler
kendi kapaklarını, kapaksız içerikler marka kartını kullanır. Sayfa açıklamaları
ve ortak SEO yardımcıları `shared/seo.ts`, meta etiketleri ve JSON-LD
`app/composables/use-page-seo.ts` içindedir.

`LegalService`, `WebSite`, `WebPage`, breadcrumb ve makale `BlogPosting` verileri
yalnızca mevcut içerikten üretilir. `/sitemap.xml` yayınlanmış makaleleri, aktif
avukatları ve faaliyet alanlarını veritabanından okur; yalnızca mevcut çevirilere
bağlantı verir. Sitemap önbelleği en fazla 5 dakikadır. Yönetim, arama, şablon
dokümantasyonu ve hata sayfaları indekslenmez. Günlüğün liste/kategori görünümleri
aynı `/blog` canonical adresini kullanır; arama/filtre sonuçları `noindex` alır.

Canlı ortamda Dokploy **runtime environment** içinde `NUXT_PUBLIC_SITE_URL`
değerini gerçek HTTPS alan adı olarak ayarlayın (ör. `https://sitedomaininiz.com`).
Bu değer meta etiketlerine, robots.txt ve sitemap adreslerine çalışma anında
uygulanır; Docker build sırasında localhost kullanılmasına bağımlı değildir.
Alan adının ve `/assets/social/*.jpg` dosyalarının giriş gerektirmeden erişilebilir
olması gerekir. Yayından sonra `/robots.txt`, `/sitemap.xml` ve sayfa kaynak
kodunu kontrol edin. Sosyal ağda eski önizleme kalırsa Facebook Sharing Debugger
veya LinkedIn Post Inspector ile bağlantıyı yeniden taratın.

Bir test/staging ortamının taranmasını kapatmak için runtime ortamında
`NUXT_SITE_ENV=staging` kullanın; varsayılan production ortamı taramaya açıktır.

```sh
pnpm run test:seo
# Çalışan uygulamaya karşı salt okunur HTML, görsel ve sitemap kontrolleri:
TEST_BASE_URL=http://localhost:3000 TEST_SITE_URL=https://sitedomaininiz.com pnpm run test:seo:integration
```

Geliştirme sunucusu robots.txt üzerinden taramayı bilerek kapatır; robots.txt
yayın kuralları production build üzerinde doğrulanmalıdır.

Boş yerel test veritabanında `SEO_TEST_FIXTURES=true` ile entegrasyon kontrolü
çalıştırılabilir; bu mod test makalesi, avukat ve faaliyet alanı oluşturup test
sonunda siler. Bu değişkeni canlı ortamda kullanmayın.

## Blog, medya ve e-posta

`cmsmotive` blog oluşturma akışı Nuxt/Vue'ya uyarlandı. Articles menüsünde Posts,
Categories, Tags ve Comments bulunur. Panel İngilizcedir; içerik dilini seçmek
aynı kaydın bellekteki çevirisini değiştirir. Dil değişiminde tekrar API isteği
yapılmaz. Etiketler ve kategoriler editör içinden de oluşturulabilir. Yayın
tarihi gelecekte olan yazılar o tarihe kadar public API ve sitemap'te görünmez.

Tiptap editörü tablo, görev listesi, hizalama, renk, alt/üst simge, Markdown
yapıştırma, HTML kaynak görünümü, tam ekran, boyutlandırılabilir görseller,
yerel video ve YouTube desteği içerir. Görsel/video yapıştırma ve sürükleme
UploadThing'e yükler. Sunucu, dosya imzasını kontrol eder; görselleri en fazla
2400 piksele indirip WebP'ye dönüştürür. Yeni yüklemeler için yerel disk yedeği
yoktur; eski `/media` dosyaları okunmaya devam eder.

Sunucunun `.env` / Dokploy runtime değişkenleri:

```dotenv
OPENROUTER_API_KEY=
UPLOADTHING_TOKEN=
PLUNK_SECRET_KEY=
PLUNK_FROM_EMAIL=
PLUNK_CONTACT_TO_EMAIL=
PLUNK_WEBHOOK_SECRET=
```

Anahtarlar yalnızca sunucuda kullanılır. Admin → Integrations bağlantı durumunu,
AI varsayılanlarını, bildirim alıcısını ve gönderen adını yönetir. Plunk'ta
`PLUNK_FROM_EMAIL` alanının domaini doğrulanmış olmalıdır.

AI, OpenRouter kataloğundan yazı/görsel modeli seçer. Web araştırması açıksa
önce kaynaklı araştırma yapar, ardından metni ve kaynakçayı üretir. Kaynaksız
araştırma yazıya dönüştürülmez. Başlık, özet, içerik, kategori, etiket, iki ara
görsel ve kapak ayrı seçilebilir. Görseller UploadThing'e kaydedilir; görsel
başarısızsa yazı sonucu ve uyarı korunur. Sonuç seçilen içerik diline uygulanır
ve taslak olarak kaydedilir. Mevcut yazı yeniden yazılırken de durum taslağa
döner. Yayına almak ayrı bir yönetici işlemidir.

Bülten formu dokuz yerleşik dilde görünür. Açık onay alınır, 24 saat geçerli
bir e-posta onay bağlantısı gönderilir. Link sayfasındaki düğme aboneliği
doğrular; e-posta tarayıcılarının GET isteği aboneliği etkinleştirmez. Tokenlar
abone tablosunda SHA-256 özeti olarak saklanır. Onaylanan okuyucular Plunk'a
`subscribed: true`, diğerleri `false` olarak eşitlenir; `locale`, `name` ve
`source` kişi alanları aktarılır. Kampanyaları Plunk'ta oluşturup `locale` ile
hedefleyin. Gönderim günlüğü, hata ve yeniden deneme işlemleri Newsletter
sayfasındadır. Yarım kalan gönderim beş dakika sonra yeniden denenebilir.

Plunk'ta `contact.unsubscribed` olayına bir workflow oluşturun. Webhook adımı:

- URL: `https://alanadiniz.com/api/webhooks/plunk`
- Method: `POST`
- Header: `Authorization: Bearer <PLUNK_WEBHOOK_SECRET ile aynı değer>`
- Body: boş bırakın (Plunk'ın standart `contact` payload'ı kullanılır).

Bu akış, Plunk üzerinden çıkışları ve bounce/complaint nedeniyle kapanan
abonelikleri yerel tabloya yansıtır. Alıcı tekrar Plunk'a istek göndermez.
İletişim formu da Plunk üzerinden ekip bildirimi ve ziyaretçi alındısı
gönderebilir; mesaj veritabanına kaydedildikten sonra e-posta işlenir.

Şema: `pnpm db:migrate`. Çalışan geliştirme sunucusuna karşı kontroller:

```sh
pnpm typecheck
pnpm test:integration
pnpm test:blog
pnpm test:seo
```

`pnpm build` sonrasında `pnpm test:providers`, üretim sunucusunu boş bir yerel
portta başlatıp AI üretim → taslak kaydı, bülten formu → Türkçe onay e-postası
→ abonelikten çıkış ve Plunk webhook akışlarını taklit sağlayıcılarla doğrular.
Canlı servis anahtarları bu test sürecinde yerel test değerleriyle değiştirilir.

Blog testleri geçici kullanıcı/içerik oluşturup temizler. AI ve mail sağlayıcı
testleri yerel taklit servislere gider; canlı AI çağrısı, e-posta ve UploadThing
yüklemesi testlerde yapılmaz. Gerçek anahtarlar eksikken arayüz bağlantı
durumunu ve yapılandırma hatasını gösterir.
