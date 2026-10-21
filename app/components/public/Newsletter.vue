<script setup lang="ts">
import { getNewsletterCopy } from '#shared/newsletter';
const { locale } = useContentLanguage();
const copy = computed(() => getNewsletterCopy(locale.value));
const email = ref(''),
  consent = ref(false),
  website = ref(''),
  busy = ref(false),
  sent = ref(false),
  error = ref('');
watch(locale, () => {
  sent.value = false;
  error.value = '';
});
async function subscribe() {
  busy.value = true;
  error.value = '';
  try {
    await $fetch('/api/newsletter/subscribe', {
      method: 'POST',
      body: {
        email: email.value,
        consent: consent.value,
        locale: locale.value,
        website: website.value,
      },
    });
    sent.value = true;
    email.value = '';
    consent.value = false;
  } catch (e: any) {
    error.value = e?.data?.statusMessage || 'Please try again later.';
  } finally {
    busy.value = false;
  }
}
</script>
<template>
  <section class="public-newsletter" aria-labelledby="newsletter-heading">
    <div class="container newsletter-layout">
      <div>
        <h2 id="newsletter-heading">{{ copy.title }}</h2>
        <p>{{ copy.intro }}</p>
      </div>
      <div>
        <p v-if="sent" class="newsletter-feedback" role="status">
          <UIcon name="i-lucide-mail-check" />{{ copy.pending }}
        </p>
        <form v-else @submit.prevent="subscribe">
          <label for="newsletter-email">{{ copy.email }}</label>
          <div class="newsletter-input-row">
            <input
              id="newsletter-email"
              v-model="email"
              type="email"
              autocomplete="email"
              required
              maxlength="200"
              placeholder="you@example.com"
            /><button type="submit" :disabled="busy || !consent">
              {{ busy ? '…' : copy.subscribe }}<UIcon name="i-lucide-arrow-up-right" />
            </button>
          </div>
          <label class="newsletter-consent"
            ><input v-model="consent" type="checkbox" required /><span>{{
              copy.consent
            }}</span></label
          ><input
            v-model="website"
            class="form-trap"
            type="text"
            name="website"
            tabindex="-1"
            aria-hidden="true"
            autocomplete="off"
          />
          <p v-if="error" role="alert" class="newsletter-error">{{ error }}</p>
        </form>
      </div>
    </div>
  </section>
</template>
