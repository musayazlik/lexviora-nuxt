<script setup lang="ts">
import { getNewsletterCopy } from '#shared/newsletter';
const props = defineProps<{ articleId: number }>();
const { locale } = useContentLanguage();
const copy = computed(() => getNewsletterCopy(locale.value));
const { data } = await useFetch<{
  enabled: boolean;
  comments: { id: number; name: string; body: string; createdAt: string }[];
}>('/api/comments', {
  query: { articleId: props.articleId, locale },
  default: () => ({
    enabled: false,
    comments: [] as { id: number; name: string; body: string; createdAt: string }[],
  }),
});
const form = reactive({ name: '', email: '', body: '', consent: false, website: '' });
const busy = ref(false),
  sent = ref(false),
  error = ref('');
async function submit() {
  busy.value = true;
  error.value = '';
  try {
    await $fetch('/api/comments', {
      method: 'POST',
      body: { ...form, articleId: props.articleId, locale: locale.value },
    });
    sent.value = true;
    form.body = '';
  } catch (e: any) {
    error.value = e?.data?.statusMessage || 'Please try again later.';
  } finally {
    busy.value = false;
  }
}
</script>
<template>
  <section v-if="data.enabled || data.comments.length" class="public-comments container narrow">
    <h2>{{ copy.comments }}</h2>
    <article v-for="comment in data.comments" :key="comment.id" class="public-comment">
      <header>
        <strong>{{ comment.name }}</strong
        ><time :datetime="comment.createdAt">{{
          new Intl.DateTimeFormat(locale, { dateStyle: 'medium' }).format(
            new Date(comment.createdAt),
          )
        }}</time>
      </header>
      <p>{{ comment.body }}</p>
    </article>
    <p v-if="sent" role="status" class="comment-sent">{{ copy.commentSent }}</p>
    <form v-else-if="data.enabled" @submit.prevent="submit">
      <div class="comment-name-fields">
        <label
          >{{ copy.name
          }}<input
            v-model="form.name"
            required
            minlength="2"
            maxlength="100"
            autocomplete="name" /></label
        ><label
          >{{ copy.email
          }}<input v-model="form.email" type="email" required maxlength="200" autocomplete="email"
        /></label>
      </div>
      <label
        >{{ copy.comment
        }}<textarea v-model="form.body" rows="5" minlength="5" maxlength="3000" required /></label
      ><label class="newsletter-consent"
        ><input v-model="form.consent" type="checkbox" required /><span>{{
          copy.commentConsent
        }}</span></label
      ><input
        v-model="form.website"
        class="form-trap"
        tabindex="-1"
        aria-hidden="true"
        autocomplete="off"
      />
      <p v-if="error" role="alert">{{ error }}</p>
      <button type="submit" class="btn btn-primary" :disabled="busy || !form.consent">
        {{ busy ? '…' : copy.comment }}
      </button>
    </form>
  </section>
</template>
