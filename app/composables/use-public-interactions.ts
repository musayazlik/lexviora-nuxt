export function usePublicInteractions() {
  const route = useRoute();
  const { locale } = useContentLanguage();
  let controller: AbortController | undefined;
  function init() {
    controller?.abort();
    controller = new AbortController();
    const signal = controller.signal;
    const tr = locale.value === 'tr';
    const nav = document.querySelector('.main-nav');
    const toggle = document.querySelector<HTMLButtonElement>('.menu-toggle');
    const close = () => {
      nav?.classList.remove('is-open');
      toggle?.setAttribute('aria-expanded', 'false');
    };
    toggle?.addEventListener(
      'click',
      () => {
        const open = toggle.getAttribute('aria-expanded') !== 'true';
        nav?.classList.toggle('is-open', open);
        toggle.setAttribute('aria-expanded', String(open));
      },
      { signal },
    );
    nav?.addEventListener('click', close, { signal });
    document.addEventListener(
      'keydown',
      (e) => {
        if (e.key === 'Escape') {
          close();
          document.querySelectorAll<HTMLDetailsElement>('.language-switch[open]').forEach((el) => {
            el.open = false;
          });
        }
      },
      { signal },
    );
    document.querySelectorAll<HTMLAnchorElement>('.main-nav a').forEach((a) => {
      if (new URL(a.href).pathname === route.path) a.setAttribute('aria-current', 'page');
      else a.removeAttribute('aria-current');
    });
    document.querySelectorAll('[data-year]').forEach((el) => {
      el.textContent = String(new Date().getFullYear());
    });
    const form = document.querySelector<HTMLFormElement>('#contact-form');
    form?.addEventListener(
      'submit',
      async (e) => {
        e.preventDefault();
        if (!form.reportValidity()) return;
        const button = form.querySelector<HTMLButtonElement>('button[type=submit]')!;
        const status = form.querySelector<HTMLElement>('.form-status')!;
        button.disabled = true;
        status.textContent = tr ? 'Gönderiliyor…' : 'Sending…';
        const data = Object.fromEntries(new FormData(form).entries());
        try {
          await $fetch('/api/contact', {
            method: 'POST',
            body: {
              ...data,
              locale: locale.value,
              consent: form.querySelector<HTMLInputElement>('#consent')?.checked === true,
            },
          });
          status.textContent = tr
            ? 'Mesajınız alındı. Sizinle iletişime geçeceğiz.'
            : 'Your message has been received. We will be in touch.';
          form.reset();
        } catch (error) {
          status.textContent =
            (error as { data?: { statusMessage?: string } }).data?.statusMessage ||
            (tr
              ? 'Mesaj gönderilemedi. Lütfen tekrar deneyin.'
              : 'Unable to send your message. Please try again.');
        } finally {
          button.disabled = false;
        }
      },
      { signal },
    );
    document.querySelectorAll('[data-share]').forEach((button) =>
      button.addEventListener(
        'click',
        async () => {
          try {
            await navigator.clipboard.writeText(location.href);
            button.textContent = tr ? 'Bağlantı kopyalandı' : 'Link copied';
          } catch {
            button.textContent = location.href;
          }
        },
        { signal },
      ),
    );
    document
      .querySelector('[data-print]')
      ?.addEventListener('click', () => window.print(), { signal });
  }
  onMounted(init);
  watch(
    () => route.fullPath,
    async () => {
      await nextTick();
      setTimeout(init, 100);
    },
  );
  onUnmounted(() => controller?.abort());
}
