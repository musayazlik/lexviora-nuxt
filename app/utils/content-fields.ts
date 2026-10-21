import type { Resource } from '#shared/types/content';
export type ContentField = { key: string; tr: string; en: string; type?: 'textarea' | 'rich' };
export const contentDefinitions: Record<
  Resource,
  { tr: string; en: string; descriptionTr: string; descriptionEn: string; fields: ContentField[] }
> = {
  articles: {
    tr: 'Makaleler',
    en: 'Articles',
    descriptionTr: 'Düşünceli bir bakış açısıyla hazırlanan hukuk yazılarınız.',
    descriptionEn: 'Considered perspectives, written with care.',
    fields: [
      { key: 'title', tr: 'Makale başlığı', en: 'Article title' },
      { key: 'excerpt', tr: 'Kısa açıklama', en: 'Excerpt', type: 'textarea' },
      { key: 'body', tr: 'Makale içeriği', en: 'Article content', type: 'rich' },
    ],
  },
  categories: {
    tr: 'Kategoriler',
    en: 'Categories',
    descriptionTr: 'Yazılarınızı anlaşılır konu başlıkları altında düzenleyin.',
    descriptionEn: 'Organize your journal by the subjects that matter.',
    fields: [{ key: 'name', tr: 'Kategori adı', en: 'Category name' }],
  },
  'practice-areas': {
    tr: 'Faaliyet alanları',
    en: 'Practice areas',
    descriptionTr: 'Uzmanlığınızı ve çalışma yaklaşımınızı anlatın.',
    descriptionEn: 'Present your expertise and your approach to practice.',
    fields: [
      { key: 'title', tr: 'Alan adı', en: 'Practice name' },
      { key: 'excerpt', tr: 'Kısa açıklama', en: 'Short description', type: 'textarea' },
      { key: 'body', tr: 'Detaylı içerik', en: 'Detailed content', type: 'rich' },
    ],
  },
  attorneys: {
    tr: 'Avukatlar',
    en: 'Attorneys',
    descriptionTr: 'Ekibinizin deneyimini ve uzmanlıklarını paylaşın.',
    descriptionEn: 'Introduce the people and expertise behind your practice.',
    fields: [
      { key: 'role', tr: 'Unvan', en: 'Professional title' },
      { key: 'area', tr: 'Uzmanlık alanları', en: 'Areas of focus' },
      { key: 'bio', tr: 'Biyografi', en: 'Biography', type: 'rich' },
    ],
  },
  faqs: {
    tr: 'Sıkça sorulan sorular',
    en: 'Frequently asked questions',
    descriptionTr: 'İlk görüşmeden önce merak edilenlere açık yanıtlar.',
    descriptionEn: 'Clear answers before the first conversation.',
    fields: [
      { key: 'question', tr: 'Soru', en: 'Question' },
      { key: 'answer', tr: 'Yanıt', en: 'Answer', type: 'rich' },
    ],
  },
  glossary: {
    tr: 'Hukuk sözlüğü',
    en: 'Legal glossary',
    descriptionTr: 'Hukuki kavramları herkes için anlaşılır kılın.',
    descriptionEn: 'Make legal language easier to understand.',
    fields: [
      { key: 'term', tr: 'Kavram', en: 'Term' },
      { key: 'definition', tr: 'Tanım', en: 'Definition', type: 'textarea' },
    ],
  },
};
