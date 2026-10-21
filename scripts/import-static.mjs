import { readFile, writeFile, mkdir, readdir, cp } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { resolve, dirname } from 'node:path';
import { load } from 'cheerio';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const source = resolve(root, '../lexviora-html-template');
const aliases = {
  index: '',
  'blog-list': 'blog-list',
  'blog-category': 'blog-category',
  'blog-detail': 'blog/sozlesme',
  'article-kira': 'blog/kira',
  'article-aile': 'blog/aile',
  'article-is': 'blog/is',
  'article-ceza': 'blog/ceza',
  'article-miras': 'blog/miras',
  'article-dijital': 'blog/dijital',
  'article-arabuluculuk': 'blog/arabuluculuk',
  'practice-detail': 'practice-areas/family',
  'practice-ticaret': 'practice-areas/commerce',
  'practice-is': 'practice-areas/employment',
  'practice-ceza': 'practice-areas/criminal',
  'practice-miras': 'practice-areas/inheritance',
  'practice-gayrimenkul': 'practice-areas/realestate',
  'attorney-detail': 'attorneys/deniz',
  'attorney-selin': 'attorneys/selin',
  'attorney-emre': 'attorneys/emre',
};
const manifest = {};
const seed = { en: {}, tr: {} };
const records = { en: {}, tr: {} };

function routeFor(href, locale) {
  if (/^(https?:|mailto:|tel:|#|data:)/.test(href)) return href;
  let lang = locale;
  let value = href.replace(/^\.\//, '');
  if (value.startsWith('../')) {
    value = value.slice(3);
    lang = 'en';
  }
  if (value.startsWith('tr/')) {
    value = value.slice(3);
    lang = 'tr';
  }
  if (value.startsWith('assets/')) return '/' + value;
  const [path, suffix = ''] = value.split(/(?=[?#])/s);
  const key = path.replace(/\.html$/, '');
  return `${lang === 'tr' ? '/tr' : ''}/${aliases[key] ?? key}${suffix}`;
}

for (const locale of ['en', 'tr']) {
  const dir = resolve(source, locale === 'en' ? '.' : 'tr');
  await mkdir(resolve(root, 'app/components/reference', locale), { recursive: true });
  for (const file of (await readdir(dir)).filter((p) => p.endsWith('.html'))) {
    const key = file.replace('.html', '');
    const $ = load(await readFile(resolve(dir, file), 'utf8'));
    $('script').remove();
    $('[src], [srcset], [poster]').each((_, node) => {
      for (const attr of ['src', 'srcset', 'poster']) {
        const value = $(node).attr(attr);
        if (value && /^(\.\.\/)?assets\//.test(value))
          $(node).attr(attr, value.replace(/^(\.\.\/)?assets\//, '/assets/'));
      }
    });
    $('a[href], form[action]').each((_, node) => {
      const attr = node.tagName === 'form' ? 'action' : 'href';
      const value = $(node).attr(attr);
      if (value) $(node).attr(attr, routeFor(value, locale));
      if (node.tagName === 'a' && $(node).attr('href')?.startsWith('/')) {
        node.tagName = 'nuxt-link';
        $(node).attr('to', $(node).attr('href')).removeAttr('href');
      }
    });
    $('a[aria-current], nuxt-link[aria-current]').removeAttr('aria-current');
    // Contact requests are persisted by the Nuxt API, replacing the static mail draft.
    $('#contact-form').attr('data-contact-form', '');
    $('#contact-form button[type=submit]').text(locale === 'tr' ? 'Mesajı gönder' : 'Send message');
    $('.form-note')
      .filter((_, el) => /mailto|\.eml|draft|taslak|gönderilmez|does not send/i.test($(el).text()))
      .text(
        locale === 'tr'
          ? 'Mesajınız güvenli biçimde ofisimize iletilir.'
          : 'Your message is securely delivered to our office.',
      );
    $('.practice-grid').replaceWith('<public-practices></public-practices>');
    $('.team-grid').replaceWith('<public-team></public-team>');
    $('.filter-row').each((_, el) => {
      $(el).parent().attr('data-live-filters', '');
      $(el).remove();
    });
    $('.article-grid').each((_, el) => {
      const filterable = $(el).parent().is('[data-live-filters]');
      $(el).replaceWith(
        `<public-journal :limit="3"${filterable ? ' filterable' : ''}></public-journal>`,
      );
    });
    $('.featured-layout').replaceWith('<public-featured-journal></public-featured-journal>');
    $('.faq-list').replaceWith('<public-faqs></public-faqs>');
    if (key === 'glossary') {
      $('#glossary-search').closest('.search-form').remove();
      $('.glossary-status').remove();
      $('.glossary-list').replaceWith('<public-glossary></public-glossary>');
    }
    $('#contact-form > p')
      .first()
      .text(
        locale === 'tr'
          ? 'Talebinizi iletin; görüşme için sizinle iletişime geçelim.'
          : 'Send your enquiry and we will get in touch to arrange a conversation.',
      );
    $('#contact-form .checkbox-label span').html(
      locale === 'tr'
        ? '<a href="/tr/privacy">Gizlilik bildirimini</a> okudum ve iletişim kurulmasını kabul ediyorum.'
        : 'I have read the <a href="/privacy">privacy notice</a> and agree to be contacted.',
    );
    $('#contact-form .demo-note, .mail-client-link, .draft-link').remove();
    const main = $('main').html() || '';
    const title = $('title').text();
    const description = $('meta[name=description]').attr('content') || '';
    manifest[key] ??= {};
    manifest[key][locale] = {
      title,
      description,
      route: '/' + (aliases[key] ?? key),
      bodyClass: $('body').attr('class') || '',
    };
    records[locale][key] = { title, description };
    await writeFile(
      resolve(root, `app/components/reference/${locale}/${key}.vue`),
      `<template>\n<div>${main}</div>\n</template>\n`,
    );
    if (key === 'index') {
      const header = $('.topbar').toString() + $('header.site-header').toString();
      const footer = $('footer.site-footer').toString();
      for (const [name, html] of Object.entries({ header, footer })) {
        const fragment = load(html, {}, false);
        fragment('[data-language]').each((_, el) =>
          fragment(el)
            .removeAttr('to')
            .attr(':to', `switchLocalePath('${fragment(el).attr('data-language')}')`),
        );
        await writeFile(
          resolve(root, `app/components/reference/${locale}/${name}.vue`),
          `<script setup lang="ts">\nconst switchLocalePath = useSwitchLocalePath();\n</script>\n<template>\n<div>${fragment.html()}</div>\n</template>\n`,
        );
      }
    }
    if (key.startsWith('article-') || key === 'blog-detail') {
      seed[locale][aliases[key].split('/').pop()] = {
        title: $('h1').text().trim(),
        excerpt:
          $('.article-heading .lead, .article-heading .intro, .article-lead')
            .first()
            .text()
            .trim() || description,
        body: $('.article-content, .article-body, .prose').first().html() || '',
        category: $('.article-heading .category, .article-heading .eyebrow, .article-category')
          .first()
          .text()
          .trim(),
      };
    }
  }
}
await mkdir(resolve(root, 'shared/data'), { recursive: true });
await writeFile(resolve(root, 'shared/data/reference.json'), JSON.stringify(manifest, null, 2));
await writeFile(resolve(root, 'shared/data/articles.json'), JSON.stringify(seed, null, 2));
await cp(resolve(source, 'assets/fonts'), resolve(root, 'public/assets/fonts'), {
  recursive: true,
});
await mkdir(resolve(root, 'public/css'), { recursive: true });
await writeFile(
  resolve(root, 'public/css/site.css'),
  await readFile(resolve(source, 'css/style.css'), 'utf8'),
);
console.log(`Imported ${Object.keys(manifest).length} templates in two languages.`);
