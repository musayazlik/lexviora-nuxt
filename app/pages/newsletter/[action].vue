<script setup lang="ts">
import { getNewsletterCopy } from '#shared/newsletter';
const route = useRoute();
const { locale } = useContentLanguage();
const copy = computed(() => getNewsletterCopy(locale.value));
const action = String(route.params.action);
if (!['confirm', 'unsubscribe'].includes(action)) throw createError({ statusCode: 404 });
const busy = ref(false),
  done = ref(false),
  error = ref('');
const label = computed(() => (action === 'confirm' ? copy.value.confirm : copy.value.unsubscribe));
useRobotsRule('noindex,nofollow');
useSeoMeta({ title: () => label.value + ' | Lexviora', referrer: 'no-referrer' });
async function submit() {
  busy.value = true;
  error.value = '';
  try {
    await $fetch(`/api/newsletter/${action}` as '/api/newsletter/confirm', {
      method: 'POST',
      body: { token: route.query.token },
    });
    done.value = true;
  } catch (e: any) {
    error.value = e?.data?.statusMessage || 'Please try again later.';
  } finally {
    busy.value = false;
  }
}
</script>
<template>
  <section class="section newsletter-manage">
    <div class="container narrow">
      <h1>{{ label }}</h1>
      <p v-if="done" role="status">
        {{ action === 'confirm' ? copy.confirmed : copy.unsubscribed }}
      </p>
      <template v-else
        ><p>{{ copy.intro }}</p>
        <button class="btn btn-primary" :disabled="busy || !route.query.token" @click="submit">
          {{ busy ? '…' : label }}
        </button>
        <p v-if="error" role="alert">{{ error }}</p></template
      >
    </div>
  </section>
</template>
