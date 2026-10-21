export type AdminNavItem = {
  tr: string;
  en: string;
  to: string;
  icon: string;
  adminOnly?: boolean;
  children?: AdminNavItem[];
};
export const adminNavigation: { tr: string; en: string; items: AdminNavItem[] }[] = [
  {
    tr: 'Çalışma alanı',
    en: 'Workspace',
    items: [
      { tr: 'Genel bakış', en: 'Overview', to: '/admin', icon: 'layout-dashboard' },
      { tr: 'Gelen kutusu', en: 'Inbox', to: '/admin/messages', icon: 'inbox' },
    ],
  },
  {
    tr: 'İçerik yönetimi',
    en: 'Content',
    items: [
      { tr: 'Sayfalar', en: 'Pages', to: '/admin/pages', icon: 'panels-top-left' },
      {
        tr: 'Makaleler',
        en: 'Articles',
        to: '/admin/articles',
        icon: 'file-text',
        children: [
          { tr: 'Yazılar', en: 'Posts', to: '/admin/articles', icon: 'files' },
          { tr: 'Kategoriler', en: 'Categories', to: '/admin/categories', icon: 'folder-open' },
          { tr: 'Etiketler', en: 'Tags', to: '/admin/tags', icon: 'tags' },
          { tr: 'Yorumlar', en: 'Comments', to: '/admin/comments', icon: 'messages-square' },
        ],
      },
      { tr: 'Faaliyet alanları', en: 'Practice areas', to: '/admin/practice-areas', icon: 'scale' },
      { tr: 'Avukatlar', en: 'Attorneys', to: '/admin/attorneys', icon: 'users-round' },
      {
        tr: 'Sıkça sorulan sorular',
        en: 'FAQs',
        to: '/admin/faqs',
        icon: 'message-circle-question-mark',
      },
      { tr: 'Hukuk sözlüğü', en: 'Legal glossary', to: '/admin/glossary', icon: 'book-open' },
      { tr: 'Medya kütüphanesi', en: 'Media library', to: '/admin/media', icon: 'images' },
    ],
  },
  {
    tr: 'Yönetim',
    en: 'Administration',
    items: [
      { tr: 'Bülten', en: 'Newsletter', to: '/admin/newsletter', icon: 'mails', adminOnly: true },
      {
        tr: 'Entegrasyonlar',
        en: 'Integrations',
        to: '/admin/integrations',
        icon: 'plug',
        adminOnly: true,
      },
      { tr: 'Diller', en: 'Languages', to: '/admin/languages', icon: 'languages', adminOnly: true },
      {
        tr: 'Kullanıcılar',
        en: 'Users',
        to: '/admin/users',
        icon: 'shield-check',
        adminOnly: true,
      },
      { tr: 'Hesap ayarları', en: 'Account settings', to: '/admin/settings', icon: 'settings-2' },
    ],
  },
];
