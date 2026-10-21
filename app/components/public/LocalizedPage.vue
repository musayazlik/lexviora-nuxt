<script setup lang="ts">
import type { PublicRecord } from '#shared/types/content';
const props = defineProps<{ name: string; page?: PublicRecord }>();
const copy = usePublicCopy();
const localePath = useContentLocalePath();
const { locale } = useContentLanguage();
const isHome = computed(() => props.name === 'index' || props.name === 'home');
const titles = computed<Record<string, string>>(() => ({
  index: copy.value.heroTitle,
  home: copy.value.heroTitle,
  about: copy.value.about,
  'practice-areas': copy.value.practice,
  attorneys: copy.value.team,
  contact: copy.value.contact,
  faq: copy.value.faq,
  glossary: copy.value.glossary,
  blog: copy.value.journal,
  'home-editorial': copy.value.journal,
}));
const title = computed(
  () => props.page?.title || titles.value[props.name] || props.name.replace(/-/g, ' '),
);
const description = computed(
  () =>
    props.page?.excerpt ||
    (isHome.value
      ? copy.value.heroDescription
      : props.name === 'about'
        ? copy.value.aboutDescription
        : ''),
);
const contact = reactive({
  name: '',
  email: '',
  subject: '',
  message: '',
  consent: false,
  website: '',
});
const sending = ref(false);
const feedback = ref('');
async function send() {
  sending.value = true;
  feedback.value = '';
  try {
    await $fetch('/api/contact', { method: 'POST', body: { ...contact, locale: locale.value } });
    feedback.value = copy.value.sent;
    Object.assign(contact, {
      name: '',
      email: '',
      subject: '',
      message: '',
      consent: false,
      website: '',
    });
  } catch {
    feedback.value = copy.value.sendError;
  } finally {
    sending.value = false;
  }
}
</script>
<template>
  <div>
    <section v-if="isHome" class="hero">
      <div class="hero-visual">
        <img
          src="/assets/images/hero.webp"
          alt=""
          width="1536"
          height="1024"
          fetchpriority="high"
        />
      </div>
      <div class="hero-shade" />
      <div class="container hero-inner">
        <div class="hero-copy">
          <div class="hero-intro">Lexviora {{ copy.footer }}</div>
          <h1>{{ title }}</h1>
          <p>{{ description }}</p>
          <div class="hero-actions">
            <NuxtLink class="button" :to="localePath('/practice-areas')"
              >{{ copy.practice }}<UIcon name="i-lucide-arrow-up-right" class="icon" /></NuxtLink
            ><NuxtLink class="button button-outline" :to="localePath('/contact')">{{
              copy.consultation
            }}</NuxtLink>
          </div>
        </div>
      </div>
    </section>
    <PublicPageHeading v-else :title="title" :description="description" />
    <section v-if="page?.body" class="section">
      <div class="container narrow public-rich-text" v-html="page.body" />
    </section>
    <template v-if="isHome">
      <section class="section">
        <div class="container">
          <div class="section-head">
            <div>
              <h2>{{ copy.practice }}</h2>
              <p>{{ copy.aboutDescription }}</p>
            </div>
          </div>
          <PublicPractices />
        </div>
      </section>
      <section class="section surface">
        <div class="container">
          <div class="section-head">
            <h2>{{ copy.journal }}</h2>
            <NuxtLink class="text-link" :to="localePath('/blog')"
              >{{ copy.all }}<UIcon name="i-lucide-arrow-right" class="icon"
            /></NuxtLink>
          </div>
          <PublicJournal :limit="3" />
        </div>
      </section>
    </template>
    <section v-else-if="name === 'practice-areas'" class="section">
      <div class="container"><PublicPractices /></div>
    </section>
    <section v-else-if="name === 'attorneys'" class="section">
      <div class="container"><PublicTeam /></div>
    </section>
    <section v-else-if="name === 'faq'" class="section">
      <div class="container narrow"><PublicFaqs /></div>
    </section>
    <section v-else-if="name === 'glossary'" class="section">
      <div class="container narrow"><PublicGlossary /></div>
    </section>
    <section v-else-if="name === 'home-editorial'" class="section">
      <div class="container"><PublicJournal /></div>
    </section>
    <section v-else-if="name === 'contact'" class="section">
      <div class="container narrow">
        <form class="localized-contact-form" @submit.prevent="send">
          <label
            >{{ copy.fullName
            }}<input
              v-model="contact.name"
              name="name"
              required
              minlength="2"
              maxlength="100"
              autocomplete="name"
          /></label>
          <label
            >{{ copy.email
            }}<input
              v-model="contact.email"
              name="email"
              type="email"
              required
              maxlength="200"
              autocomplete="email"
          /></label>
          <label
            >{{ copy.subject }}<input v-model="contact.subject" name="subject" maxlength="200"
          /></label>
          <label
            >{{ copy.message
            }}<textarea
              v-model="contact.message"
              name="message"
              required
              minlength="10"
              maxlength="5000"
              rows="6"
            />
          </label>
          <label class="localized-consent"
            ><input v-model="contact.consent" type="checkbox" required />{{ copy.consent }}</label
          >
          <div hidden>
            <input v-model="contact.website" name="website" tabindex="-1" autocomplete="off" />
          </div>
          <button class="button" type="submit" :disabled="sending">
            {{ sending ? copy.sending : copy.send }}
          </button>
          <p role="status">{{ feedback }}</p>
        </form>
      </div>
    </section>
    <section v-else-if="!page?.body && name !== 'about'" class="section">
      <div class="container narrow">
        <p role="status">{{ copy.empty }}</p>
      </div>
    </section>
  </div>
</template>
