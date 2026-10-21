<script setup lang="ts">
definePageMeta({ layout: false });
const { text, errorText } = useAdmin();
const localePath = useLocalePath();
const route = useRoute();
const email = ref('');
const password = ref('');
const show = ref(false);
const loading = ref(false);
const error = ref('');
useSeoMeta({ title: 'Sign in | Lexviora', robots: 'noindex, nofollow' });
async function submit() {
  loading.value = true;
  error.value = '';
  try {
    const result = await authClient.signIn.email({ email: email.value, password: password.value });
    if (result.error)
      throw new Error(
        text(
          'E-posta veya şifre hatalı. Lütfen tekrar deneyin.',
          'The email or password is incorrect. Please try again.',
        ),
      );
    const target = String(route.query.redirect || '');
    await navigateTo(
      /^\/(tr\/)?admin(?:\/|$)/.test(target) && !target.includes('login')
        ? target
        : localePath('/admin'),
    );
  } catch (e) {
    error.value = errorText(e);
  } finally {
    loading.value = false;
  }
}
</script>
<template>
  <div class="auth-shell">
    <aside class="auth-story">
      <NuxtLink :to="localePath('/')" class="auth-wordmark"
        ><UIcon name="i-lucide-scale" />Lexviora</NuxtLink
      >
      <div>
        <span class="auth-rule" />
        <p class="auth-quote">
          {{
            text(
              'Her kelimede özen.\nHer adımda güven.',
              'Care in every word.\nConfidence at every step.',
            )
          }}
        </p>
        <p class="auth-caption">
          {{
            text(
              'Hukuki bilginin, düşünceli bir bakışla buluştuğu yer.',
              'Where legal knowledge meets a considered perspective.',
            )
          }}
        </p>
      </div>
      <span class="auth-story-footer">Legal &amp; Advisory</span>
      <div class="auth-architecture" aria-hidden="true" />
    </aside>
    <main class="auth-form-panel">
      <div class="auth-form-inner">
        <NuxtLink :to="localePath('/')" class="auth-back"
          ><UIcon name="i-lucide-arrow-left" />{{
            text('Web sitesine dön', 'Back to website')
          }}</NuxtLink
        ><span class="admin-eyebrow">{{
          text('Lexviora çalışma alanı', 'Lexviora workspace')
        }}</span>
        <h1>{{ text('Tekrar hoş geldiniz.', 'Welcome back.') }}</h1>
        <p class="auth-description">
          {{
            text(
              'İçeriklerinizi yönetmek için hesabınıza giriş yapın.',
              'Sign in to manage your content and your practice.',
            )
          }}
        </p>
        <form class="auth-form" @submit.prevent="submit">
          <UAlert v-if="error" :title="error" color="error" variant="soft" /><UFormField
            :label="text('E-posta adresi', 'Email address')"
            name="email"
            required
            ><UInput
              v-model="email"
              id="email"
              type="email"
              size="xl"
              autocomplete="username"
              required
              placeholder="you@lexviora.com"
              class="auth-input" /></UFormField
          ><UFormField :label="text('Şifre', 'Password')" name="password" required
            ><UInput
              v-model="password"
              id="password"
              :type="show ? 'text' : 'password'"
              size="xl"
              autocomplete="current-password"
              required
              class="auth-input"
              ><template #trailing
                ><UButton
                  :icon="show ? 'i-lucide-eye-off' : 'i-lucide-eye'"
                  variant="ghost"
                  color="neutral"
                  :aria-label="
                    show
                      ? text('Şifreyi gizle', 'Hide password')
                      : text('Şifreyi göster', 'Show password')
                  "
                  :aria-pressed="show"
                  @click="show = !show" /></template></UInput></UFormField
          ><UButton
            type="submit"
            size="xl"
            block
            :loading="loading"
            trailing-icon="i-lucide-arrow-right"
            class="auth-submit"
            >{{ text('Giriş yap', 'Sign in') }}</UButton
          >
        </form>
        <div class="auth-access-note">
          <UIcon name="i-lucide-lock-keyhole" />
          <p>
            {{
              text(
                'Bu alan yalnızca yetkili ekip üyeleri içindir. Hesap erişimi için yöneticinizle iletişime geçin.',
                'This workspace is for authorized team members. Contact your administrator for account access.',
              )
            }}
          </p>
        </div>
      </div>
      <span class="auth-copyright"
        >© {{ new Date().getFullYear() }} Lexviora Legal &amp; Advisory</span
      >
    </main>
  </div>
</template>
