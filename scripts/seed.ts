import 'dotenv/config';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { load } from 'cheerio';
import { Pool } from 'pg';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const source = new URL('../../lexviora-html-template/', import.meta.url);
const html = async (name: string, locale: string) => load(await readFile(new URL(`${locale === 'tr' ? 'tr/' : ''}${name}.html`, source), 'utf8'));
async function insert(table: string, values: Record<string, unknown>, unique = 'slug') {
  const keys = Object.keys(values);
  const result = await pool.query(`INSERT INTO ${table} (${keys.join(',')}) VALUES (${keys.map((_, i) => '$' + (i + 1)).join(',')}) ON CONFLICT DO NOTHING RETURNING id`, Object.values(values));
  if (result.rows[0]) return result.rows[0].id as number;
  return (await pool.query(`SELECT id FROM ${table} WHERE ${unique} = $1`, [values[unique]])).rows[0]?.id as number;
}
async function translation(table: string, values: Record<string, unknown>) {
  const keys = Object.keys(values);
  await pool.query(`INSERT INTO ${table} (${keys.join(',')}) VALUES (${keys.map((_, i) => '$' + (i + 1)).join(',')}) ON CONFLICT DO NOTHING`, Object.values(values));
}
try {
  const categoryIds: Record<string, number> = {};
  const areas = { family: 'practice-detail', commerce: 'practice-ticaret', employment: 'practice-is', criminal: 'practice-ceza', inheritance: 'practice-miras', realestate: 'practice-gayrimenkul' };
  for (const [slug, page] of Object.entries(areas)) {
    categoryIds[slug] = await insert('categories', { slug });
    const id = await insert('practice_areas', { slug, icon: 'scale' });
    for (const locale of ['en', 'tr']) {
      const $ = await html(page, locale);
      const title = $('h1').text().trim();
      await translation('category_translations', { category_id: categoryIds[slug], locale, name: title });
      await translation('practice_area_translations', { area_id: id, locale, title, excerpt: $('.page-heading p').text().trim(), body: $('.detail-layout .prose').html(), topics: JSON.stringify($('.prose li').map((_, el) => $(el).text()).get()) });
    }
  }
  const attorneyIds: Record<string, number> = {};
  for (const [slug, page] of Object.entries({ deniz: 'attorney-detail', selin: 'attorney-selin', emre: 'attorney-emre' })) {
    const en = await html(page, 'en');
    const id = await insert('attorneys', { slug, name: en('.profile-layout h2').first().text().trim(), photo: `/assets/images/${slug}.webp` });
    attorneyIds[slug] = id;
    for (const locale of ['en', 'tr']) {
      const $ = await html(page, locale);
      const prose = $('.profile-layout .prose');
      await translation('attorney_translations', { attorney_id: id, locale, role: prose.find('.section-kicker').text().trim(), area: prose.find('h3').first().next('p').text().trim(), bio: prose.find('p.lead').toString() + prose.find('h3').eq(1).toString() + prose.find('h3').eq(1).next('p').toString() });
    }
  }
  const articleCategories: Record<string, string> = { sozlesme: 'commerce', kira: 'realestate', aile: 'family', is: 'employment', ceza: 'criminal', miras: 'inheritance', dijital: 'commerce', arabuluculuk: 'employment' };
  for (const [slug, category] of Object.entries(articleCategories)) {
    const page = slug === 'sozlesme' ? 'blog-detail' : 'article-' + slug;
    const en = await html(page, 'en');
    const id = await insert('articles', { slug, status: 'published', featured: ['sozlesme', 'kira', 'aile'].includes(slug), category_id: categoryIds[category], attorney_id: attorneyIds[slug === 'aile' ? 'selin' : slug === 'is' ? 'emre' : 'deniz'], cover_image: `/assets/images/${slug === 'kira' ? 'hero' : slug === 'aile' ? 'office' : 'article'}.webp`, reading_minutes: 6, published_at: en('time').first().attr('datetime') || '2026-10-16' });
    for (const locale of ['en', 'tr']) {
      const $ = await html(page, locale);
      await translation('article_translations', { article_id: id, locale, title: $('h1').text().trim(), excerpt: $('.article-heading .container > p').first().text().trim(), body: $('.prose').first().html() });
    }
  }
  const enFaq = await html('faq', 'en');
  const trFaq = await html('faq', 'tr');
  for (let i = 0; i < enFaq('.faq-list details').length; i++) {
    if ((await pool.query('SELECT id FROM faqs WHERE sort = $1', [i])).rowCount) continue;
    const id = (await pool.query('INSERT INTO faqs (sort) VALUES ($1) RETURNING id', [i])).rows[0].id;
    for (const [locale, $] of [['en', enFaq], ['tr', trFaq]] as const) {
      const detail = $('.faq-list details').eq(i);
      await translation('faq_translations', { faq_id: id, locale, question: detail.find('summary').text().trim(), answer: detail.find('.faq-answer').html() });
    }
  }
  const enTerms = await html('glossary', 'en');
  const trTerms = await html('glossary', 'tr');
  for (let i = 0; i < enTerms('[data-term]').length; i++) {
    const slug = enTerms('[data-term]').eq(i).find('h2').text().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    const id = await insert('glossary_terms', { slug, sort: i });
    for (const [locale, $] of [['en', enTerms], ['tr', trTerms]] as const) {
      const el = $('[data-term]').eq(i);
      await translation('glossary_term_translations', { term_id: id, locale, term: el.find('h2').text().trim(), definition: el.find('p').text().trim() });
    }
  }
  console.log('Reference content seeded. Existing records and translations were preserved.');
} finally { await pool.end(); }
