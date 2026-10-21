# Lexviora App

Nuxt 4 tabanlı Lexviora web sitesi + yönetim paneli. `lexviora-html-template/` içindeki
tasarımın uygulamaya dönüştürülmüş hali.

## Stack

| Katman | Teknoloji |
|---|---|
| Framework | Nuxt 4 (Vue 3, TypeScript) |
| UI | Nuxt UI v4 + Tailwind CSS v4 (Lexviora paleti ile) |
| Auth | Better Auth (admin / editor rolleri) |
| Veritabanı | PostgreSQL + Drizzle ORM |
| i18n | @nuxtjs/i18n (EN varsayılan, TR `/tr`) |
| SEO | @nuxtjs/seo + @nuxt/image |
| Deploy | Docker image → Dokploy |

## Geliştirme

```sh
# 1. Bağımlılıklar
npm install

# 2. PostgreSQL (docker compose ile)
docker compose up db -d

# 3. Migration oluştur ve uygula
npm run db:generate   # şema değişince
npm run db:migrate

# 4. İlk admin kullanıcısı
npm run admin:create -- admin@lexviora.com "GucluBirSifre" "Ad Soyad"

# 5. Çalıştır
npm run dev
```

- Site: http://localhost:3000 (EN), http://localhost:3000/tr (TR)
- Admin: http://localhost:3000/admin (giriş: `/admin/login`)

## Komutlar

| Komut | Açıklama |
|---|---|
| `npm run dev` | Geliştirme sunucusu |
| `npm run build` | Production build (`.output/`) |
| `npm run db:generate` | Şemadan SQL migration üretir |
| `npm run db:migrate` | Migration'ları uygular |
| `npm run db:studio` | Drizzle Studio (DB görsel arayüz) |
| `npm run admin:create` | Admin kullanıcı oluşturur |

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

> Not: Şema değişikliklerinde `npm run db:generate` ile migration üretilip
> repoya commit edilmeli — image build sırasında migration üretimi yapılmaz.

## KVKK notları

İletişim formu, çerez ve gizlilik sayfaları static siteden taşınacak. Canlıya
alınmadan önce formun e-posta gönderimi ve log saklama politikaları netleşmeli.
