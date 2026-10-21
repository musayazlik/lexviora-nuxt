export function useAdmin() {
  const { locale } = useI18n();
  const { user } = useAuthSession();
  const text = (tr: string, en: string) => (locale.value === 'tr' ? tr : en);
  const canPublish = computed(() => user.value?.role === 'admin');
  const errorText = (error: unknown) =>
    (error as { data?: { statusMessage?: string; message?: string }; message?: string })?.data
      ?.statusMessage ||
    (error as Error)?.message ||
    text('İşlem tamamlanamadı.', 'Unable to complete the action.');
  const date = (value?: string | null) =>
    value
      ? new Intl.DateTimeFormat(locale.value, {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
        }).format(new Date(value))
      : '—';
  const statusText = (value?: string) =>
    value === 'published'
      ? text('Yayında', 'Published')
      : value === 'review'
        ? text('İncelemede', 'In review')
        : text('Taslak', 'Draft');
  return { text, canPublish, errorText, date, statusText, user };
}
