export function useAdmin() {
  const { user } = useAuthSession();
  const text = (_tr: string, en: string) => en;
  const canPublish = computed(() => user.value?.role === 'admin');
  const errorText = (error: unknown) =>
    (error as { data?: { statusMessage?: string; message?: string }; message?: string })?.data
      ?.statusMessage ||
    (error as Error)?.message ||
    text('İşlem tamamlanamadı.', 'Unable to complete the action.');
  const date = (value?: string | null) =>
    value
      ? new Intl.DateTimeFormat('en', {
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
