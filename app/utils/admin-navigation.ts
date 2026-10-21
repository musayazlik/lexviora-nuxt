export const adminNavigation = [
  { tr: 'Çalışma alanı', en: 'Workspace', items: [
    { tr: 'Genel bakış', en: 'Overview', to: '/admin', icon: 'layout-dashboard' },
    { tr: 'Gelen kutusu', en: 'Inbox', to: '/admin/messages', icon: 'inbox' },
  ] },
  { tr: 'İçerik yönetimi', en: 'Content', items: [
    { tr: 'Makaleler', en: 'Articles', to: '/admin/articles', icon: 'file-text' },
    { tr: 'Kategoriler', en: 'Categories', to: '/admin/categories', icon: 'folder-open' },
    { tr: 'Faaliyet alanları', en: 'Practice areas', to: '/admin/practice-areas', icon: 'scale' },
    { tr: 'Avukatlar', en: 'Attorneys', to: '/admin/attorneys', icon: 'users-round' },
    { tr: 'Sıkça sorulan sorular', en: 'FAQs', to: '/admin/faqs', icon: 'message-circle-question-mark' },
    { tr: 'Hukuk sözlüğü', en: 'Legal glossary', to: '/admin/glossary', icon: 'book-open' },
    { tr: 'Medya kütüphanesi', en: 'Media library', to: '/admin/media', icon: 'images' },
  ] },
  { tr: 'Yönetim', en: 'Administration', items: [
    { tr: 'Kullanıcılar', en: 'Users', to: '/admin/users', icon: 'shield-check', adminOnly: true },
    { tr: 'Hesap ayarları', en: 'Account settings', to: '/admin/settings', icon: 'settings-2' },
  ] },
];
