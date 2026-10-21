<script setup lang="ts">
import type { ContentRecord, ContentLocale, Resource, Translation } from '#shared/types/content';
import type { EditorToolbarItem } from '@nuxt/ui';
import { contentDefinitions } from '~/utils/content-fields';
const props = defineProps<{ resource: Resource; record?: ContentRecord | null }>();
const emit = defineEmits<{ saved: [value: ContentRecord] }>();
const { text, canPublish, errorText, statusText } = useAdmin();
const { locale } = useI18n();
const localePath = useLocalePath();
const toast = useToast();
const definition = computed(() => contentDefinitions[props.resource]);
const language = ref<ContentLocale>(locale.value);
const draft = reactive<ContentRecord>({
  id: 0,
  slug: '',
  status: 'draft',
  featured: false,
  active: true,
  name: '',
  email: '',
  phone: '',
  photo: '',
  coverImage: '',
  categoryId: null,
  attorneyId: null,
  readingMinutes: 5,
  sort: 0,
  icon: 'scale',
  translations: { en: {}, tr: {} },
});
const snapshot = ref('');
const saving = ref(false);
const error = ref('');
const savedAt = ref('');
function initialize() {
  if (props.record) Object.assign(draft, JSON.parse(JSON.stringify(props.record)));
  for (const code of ['en', 'tr'] as const) {
    draft.translations[code] ??= {};
    for (const field of definition.value.fields) draft.translations[code]![field.key] ??= '';
  }
  if (!draft.translations[language.value]?.[definition.value.fields[0]!.key] && draft.id)
    language.value = draft.translations.en?.[definition.value.fields[0]!.key] ? 'en' : 'tr';
  snapshot.value = JSON.stringify(draft);
}
initialize();
const active = computed(() => draft.translations[language.value]! as Record<string, string>);
const dirty = computed(() => JSON.stringify(draft) !== snapshot.value);
const locked = computed(
  () => props.resource === 'articles' && props.record?.status === 'published' && !canPublish.value,
);
const { data: categories } = await useFetch<ContentRecord[]>('/api/admin/content/categories', {
  default: () => [],
});
const { data: attorneys } = await useFetch<ContentRecord[]>('/api/admin/content/attorneys', {
  default: () => [],
});
const categoryOptions = computed(() => [
  { label: text('Kategori seçin', 'Choose a category'), value: 0 },
  ...categories.value.map((c) => ({
    label: String(c.translations[language.value]?.name || c.translations.en?.name || c.slug),
    value: c.id,
  })),
]);
const attorneyOptions = computed(() => [
  { label: text('Yazar seçin', 'Choose an author'), value: 0 },
  ...attorneys.value.map((a) => ({ label: a.name!, value: a.id })),
]);
const categoryValue = computed({
  get: () => draft.categoryId || 0,
  set: (v: number) => {
    draft.categoryId = v || null;
  },
});
const attorneyValue = computed({
  get: () => draft.attorneyId || 0,
  set: (v: number) => {
    draft.attorneyId = v || null;
  },
});
const slugify = (value: string) =>
  value
    .toLowerCase()
    .replace(/ı/g, 'i')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
const slugTouched = ref(!!draft.slug);
watch(
  () => active.value[definition.value.fields[0]!.key],
  (title) => {
    if (!slugTouched.value && title && props.resource !== 'faqs') draft.slug = slugify(title);
  },
);
const toolbarItems: EditorToolbarItem[][] = [
  [
    { kind: 'undo', icon: 'i-lucide-undo', tooltip: { text: text('Geri al', 'Undo') } },
    { kind: 'redo', icon: 'i-lucide-redo', tooltip: { text: text('Yinele', 'Redo') } },
  ],
  [
    {
      kind: 'heading',
      level: 2,
      icon: 'i-lucide-heading-2',
      tooltip: { text: text('Başlık', 'Heading') },
    },
    {
      kind: 'heading',
      level: 3,
      icon: 'i-lucide-heading-3',
      tooltip: { text: text('Alt başlık', 'Subheading') },
    },
  ],
  [
    { kind: 'mark', mark: 'bold', icon: 'i-lucide-bold', tooltip: { text: text('Kalın', 'Bold') } },
    {
      kind: 'mark',
      mark: 'italic',
      icon: 'i-lucide-italic',
      tooltip: { text: text('İtalik', 'Italic') },
    },
    {
      kind: 'mark',
      mark: 'underline',
      icon: 'i-lucide-underline',
      tooltip: { text: text('Altı çizili', 'Underline') },
    },
  ],
  [
    {
      kind: 'bulletList',
      icon: 'i-lucide-list',
      tooltip: { text: text('Madde işaretli liste', 'Bullet list') },
    },
    {
      kind: 'orderedList',
      icon: 'i-lucide-list-ordered',
      tooltip: { text: text('Numaralı liste', 'Numbered list') },
    },
    { kind: 'blockquote', icon: 'i-lucide-quote', tooltip: { text: text('Alıntı', 'Blockquote') } },
    { kind: 'link', icon: 'i-lucide-link', tooltip: { text: text('Bağlantı', 'Link') } },
  ],
];
const wordCount = computed(
  () =>
    (active.value.body || active.value.bio || active.value.answer || '')
      .replace(/<[^>]*>/g, ' ')
      .trim()
      .split(/\s+/)
      .filter(Boolean).length,
);
async function save(status?: ContentRecord['status']) {
  error.value = '';
  saving.value = true;
  const previous = draft.status;
  if (status) draft.status = status;
  try {
    const result = await $fetch<ContentRecord>(`/api/admin/content/${props.resource}`, {
      method: draft.id ? 'PUT' : 'POST',
      query: draft.id ? { id: draft.id } : undefined,
      body: draft,
    });
    Object.assign(draft, result);
    snapshot.value = JSON.stringify(draft);
    savedAt.value = new Intl.DateTimeFormat(locale.value, {
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date());
    toast.add({ title: text('Değişiklikler kaydedildi.', 'Changes saved.'), color: 'success' });
    emit('saved', result);
  } catch (e) {
    draft.status = previous;
    error.value = errorText(e);
  } finally {
    saving.value = false;
  }
}
const aiOpen = ref(false);
const aiAction = ref('draft');
const aiPrompt = ref('');
const aiResult = ref('');
const aiBusy = ref(false);
const aiError = ref('');
const richField = computed(
  () => definition.value.fields.find((f) => f.type === 'rich')?.key || 'body',
);
async function generate() {
  aiBusy.value = true;
  aiError.value = '';
  aiResult.value = '';
  try {
    const result = await $fetch<{ html: string }>('/api/admin/ai', {
      method: 'POST',
      body: {
        action: aiAction.value,
        prompt: aiPrompt.value,
        content: active.value[richField.value] || '',
        title: active.value.title || '',
        locale: language.value,
      },
    });
    aiResult.value = result.html;
  } catch (e) {
    aiError.value = errorText(e);
  } finally {
    aiBusy.value = false;
  }
}
function applyAi(mode: 'replace' | 'append') {
  active.value[richField.value] =
    mode === 'replace' ? aiResult.value : (active.value[richField.value] || '') + aiResult.value;
  aiOpen.value = false;
  aiResult.value = '';
}
const preview = computed(() =>
  props.resource === 'articles'
    ? '/blog/' + draft.slug
    : props.resource === 'practice-areas'
      ? '/practice-areas/' + draft.slug
      : props.resource === 'attorneys'
        ? '/attorneys/' + draft.slug
        : null,
);
onBeforeRouteLeave(
  () =>
    !dirty.value ||
    (import.meta.client &&
      window.confirm(
        text(
          'Kaydedilmemiş değişiklikler var. Sayfadan ayrılmak istiyor musunuz?',
          'You have unsaved changes. Leave this page?',
        ),
      )),
);
function beforeUnload(event: BeforeUnloadEvent) {
  if (dirty.value) {
    event.preventDefault();
    event.returnValue = '';
  }
}
onMounted(() => window.addEventListener('beforeunload', beforeUnload));
onUnmounted(() => window.removeEventListener('beforeunload', beforeUnload));
defineExpose({ dirty });
</script>
<template>
  <form class="content-editor" @submit.prevent="save()">
    <div class="editor-action-bar">
      <div class="editor-save-status" aria-live="polite">
        <span :class="['save-dot', { dirty }]" />{{
          dirty
            ? text('Kaydedilmemiş değişiklikler', 'Unsaved changes')
            : savedAt
              ? text('Kaydedildi ', 'Saved at ') + savedAt
              : text('Tüm değişiklikler kaydedildi', 'All changes saved')
        }}
      </div>
      <div class="flex flex-wrap gap-2">
        <UButton
          v-if="preview && draft.id && (resource !== 'articles' || record?.status === 'published')"
          :to="localePath(preview)"
          target="_blank"
          variant="outline"
          color="neutral"
          icon="i-lucide-external-link"
          >{{ text('Sayfayı görüntüle', 'View page') }}</UButton
        ><UButton
          type="submit"
          :loading="saving"
          :disabled="locked"
          color="neutral"
          variant="outline"
          icon="i-lucide-save"
          >{{ text('Kaydet', 'Save changes') }}</UButton
        ><UButton
          v-if="resource === 'articles' && canPublish && draft.status !== 'published'"
          :loading="saving"
          icon="i-lucide-arrow-up-right"
          @click="save('published')"
          >{{ text('Yayınla', 'Publish article') }}</UButton
        >
      </div>
    </div>
    <UAlert v-if="error" :title="error" color="error" class="mb-5" /><UAlert
      v-if="locked"
      :title="
        text(
          'Yayındaki içerikleri yalnızca yönetici düzenleyebilir.',
          'Only an administrator can edit published content.',
        )
      "
      color="warning"
      class="mb-5"
    />
    <div class="editor-columns">
      <div class="editor-document">
        <section class="admin-panel">
          <div class="editor-language-bar">
            <div>
              <UIcon name="i-lucide-languages" /><span>{{
                text('İçerik dili', 'Content language')
              }}</span>
            </div>
            <div class="language-tabs">
              <button
                v-for="code in ['en', 'tr'] as const"
                :key="code"
                type="button"
                :class="{ active: language === code }"
                :aria-pressed="language === code"
                @click="language = code"
              >
                {{ code === 'en' ? 'English' : 'Türkçe'
                }}<span
                  v-if="draft.translations[code]?.[definition.fields[0]!.key]"
                  class="translation-dot"
                />
              </button>
            </div>
          </div>
          <div class="editor-fields">
            <UFormField
              v-if="resource === 'attorneys'"
              :label="text('Ad soyad', 'Full name')"
              required
              ><UInput v-model="draft.name" size="xl" class="w-full" required /></UFormField
            ><template v-for="field in definition.fields" :key="field.key"
              ><UFormField
                v-if="field.type !== 'rich'"
                :label="text(field.tr, field.en)"
                :required="field === definition.fields[0]"
                ><UTextarea
                  v-if="field.type === 'textarea'"
                  v-model="active[field.key]"
                  :rows="3"
                  :maxlength="field.key === 'excerpt' ? 500 : 5000"
                  class="w-full"
                  autoresize /><UInput
                  v-else
                  v-model="active[field.key]"
                  :size="field === definition.fields[0] ? 'xl' : 'md'"
                  class="w-full"
                  :maxlength="250"
                  :placeholder="
                    field === definition.fields[0]
                      ? text('Bir başlıkla başlayın…', 'Start with a title…')
                      : ''
                  "
              /></UFormField>
              <div v-else class="rich-editor-field">
                <div class="rich-editor-label">
                  <label :for="'rich-' + field.key">{{ text(field.tr, field.en) }}</label
                  ><UButton
                    icon="i-lucide-sparkles"
                    size="sm"
                    variant="soft"
                    @click="aiOpen = true"
                    >{{ text('AI asistanı', 'AI assistant') }}</UButton
                  >
                </div>
                <ClientOnly
                  ><UEditor
                    :key="language + field.key"
                    v-slot="{ editor }"
                    v-model="active[field.key]"
                    content-type="html"
                    :placeholder="
                      text('Düşüncelerinizi yazıya dökün…', 'Give your thoughts a considered form…')
                    "
                    :editor-props="{
                      attributes: {
                        id: 'rich-' + field.key,
                        'aria-label': text(field.tr, field.en),
                        lang: language,
                      },
                    }"
                    :editable="!locked"
                    class="lexviora-editor"
                    ><UEditorToolbar
                      :editor="editor"
                      :items="toolbarItems"
                      class="editor-toolbar" /></UEditor
                  ><template #fallback
                    ><div class="editor-loading">
                      {{ text('Editör hazırlanıyor…', 'Preparing your editor…') }}
                    </div></template
                  ></ClientOnly
                >
                <div class="editor-word-count">
                  {{ wordCount }} {{ text('kelime', 'words') }}<span>Tiptap</span>
                </div>
              </div></template
            >
          </div>
        </section>
      </div>
      <aside class="editor-options">
        <section v-if="resource === 'articles'" class="admin-panel option-panel">
          <h2>{{ text('Yayın ayarları', 'Publication') }}</h2>
          <UFormField :label="text('Durum', 'Status')"
            ><USelect
              v-model="draft.status"
              :items="[
                { label: statusText('draft'), value: 'draft' },
                { label: statusText('review'), value: 'review' },
                ...(canPublish ? [{ label: statusText('published'), value: 'published' }] : []),
              ]"
              class="w-full"
              :disabled="locked" /></UFormField
          ><UFormField :label="text('Kategori', 'Category')"
            ><USelect v-model="categoryValue" :items="categoryOptions" class="w-full" /></UFormField
          ><UFormField :label="text('Yazar', 'Author')"
            ><USelect v-model="attorneyValue" :items="attorneyOptions" class="w-full" /></UFormField
          ><UFormField :label="text('Okuma süresi (dakika)', 'Reading time (minutes)')"
            ><UInput
              :model-value="draft.readingMinutes ?? 5"
              @update:model-value="draft.readingMinutes = Number($event)"
              type="number"
              :min="1"
              :max="300"
              class="w-full" /></UFormField
          ><USwitch
            v-model="draft.featured"
            :label="text('Öne çıkan makale', 'Featured article')"
          />
        </section>
        <section v-if="resource !== 'faqs'" class="admin-panel option-panel">
          <h2>{{ text('Sayfa adresi', 'Page address') }}</h2>
          <UFormField
            :label="text('URL kısa adı', 'URL slug')"
            :hint="text('Diller arasında ortaktır', 'Shared across languages')"
            required
            ><UInput
              v-model="draft.slug"
              class="w-full"
              placeholder="article-title"
              pattern="[a-z0-9]+(-[a-z0-9]+)*"
              required
              @input="slugTouched = true"
          /></UFormField>
          <p class="url-preview">
            lexviora.com/{{ resource === 'articles' ? 'blog/' : resource + '/'
            }}{{ draft.slug || '…' }}
          </p>
        </section>
        <section
          v-if="['articles', 'attorneys'].includes(resource)"
          class="admin-panel option-panel"
        >
          <h2>{{ text('Görsel', 'Image') }}</h2>
          <img
            v-if="draft.coverImage || draft.photo"
            :src="resource === 'articles' ? draft.coverImage! : draft.photo!"
            alt=""
            class="editor-cover-preview"
          /><UFormField :label="text('Görsel yolu veya HTTPS adresi', 'Image path or HTTPS URL')"
            ><UInput
              v-if="resource === 'articles'"
              :model-value="draft.coverImage ?? ''"
              @update:model-value="draft.coverImage = $event"
              class="w-full" /><UInput
              v-else
              :model-value="draft.photo ?? ''"
              @update:model-value="draft.photo = $event"
              class="w-full" /></UFormField
          ><NuxtLink
            :to="localePath('/admin/media')"
            target="_blank"
            class="text-sm text-gold-700 underline"
            >{{ text('Medya kütüphanesini aç', 'Open media library') }}</NuxtLink
          >
          <div class="cover-choices">
            <button
              v-for="image in resource === 'articles'
                ? ['article', 'hero', 'office']
                : ['deniz', 'selin', 'emre']"
              :key="image"
              type="button"
              :aria-label="image"
              @click="
                resource === 'articles'
                  ? (draft.coverImage = '/assets/images/' + image + '.webp')
                  : (draft.photo = '/assets/images/' + image + '.webp')
              "
            >
              <img :src="'/assets/images/' + image + '.webp'" :alt="image" />
            </button>
          </div>
        </section>
        <section v-if="resource === 'attorneys'" class="admin-panel option-panel">
          <h2>{{ text('İletişim bilgileri', 'Contact details') }}</h2>
          <UFormField :label="text('E-posta', 'Email')"
            ><UInput
              :model-value="draft.email ?? ''"
              @update:model-value="draft.email = $event"
              type="email"
              class="w-full" /></UFormField
          ><UFormField :label="text('Telefon', 'Phone')"
            ><UInput
              :model-value="draft.phone ?? ''"
              @update:model-value="draft.phone = $event"
              type="tel"
              class="w-full" /></UFormField
          ><USwitch v-model="draft.active" :label="text('Profil yayında', 'Profile visible')" />
        </section>
        <section v-if="resource === 'articles'" class="admin-panel option-panel seo-preview">
          <h2>{{ text('Arama önizlemesi', 'Search preview') }}</h2>
          <span>lexviora.com › blog › {{ draft.slug }}</span
          ><strong>{{ active.title || text('Makale başlığı', 'Article title') }}</strong>
          <p>
            {{
              active.excerpt ||
              text('Kısa açıklamanız burada görünür.', 'Your article excerpt will appear here.')
            }}
          </p>
        </section>
      </aside>
    </div>
  </form>
  <UModal
    v-model:open="aiOpen"
    :title="text('Yazı asistanınız', 'Your writing assistant')"
    :description="
      text(
        'Bir taslak hazırlayın, metni düzenleyin veya çevirin. Sonucu inceleyip içeriğe ekleyin.',
        'Create a draft, refine your writing or translate it. Review the result before applying it.',
      )
    "
    :ui="{ content: 'sm:max-w-2xl' }"
    ><template #body
      ><div class="space-y-4">
        <UFormField :label="text('İşlem', 'Action')"
          ><USelect
            v-model="aiAction"
            :items="[
              { label: text('Yeni taslak oluştur', 'Create a draft'), value: 'draft' },
              { label: text('Metni iyileştir', 'Improve writing'), value: 'rewrite' },
              { label: text('Özetle', 'Summarize'), value: 'summarize' },
              {
                label: text('Seçili dile çevir', 'Translate to selected language'),
                value: 'translate',
              },
            ]"
            class="w-full" /></UFormField
        ><UFormField :label="text('Konu veya yönlendirme', 'Topic or instructions')"
          ><UTextarea
            v-model="aiPrompt"
            :rows="3"
            :maxlength="2000"
            :placeholder="text('Hangi konuya odaklanalım?', 'What would you like to focus on?')"
            class="w-full"
        /></UFormField>
        <p class="text-xs text-slate-500">
          {{ text('Çıktı dili:', 'Output language:') }}
          {{ language === 'tr' ? 'Türkçe' : 'English' }}
        </p>
        <UAlert v-if="aiError" :title="aiError" color="error" /><UButton
          icon="i-lucide-sparkles"
          :loading="aiBusy"
          :disabled="aiAction === 'draft' && !aiPrompt.trim()"
          @click="generate"
          >{{ text('Oluştur', 'Generate') }}</UButton
        >
        <div v-if="aiResult" class="ai-preview">
          <h3>{{ text('İnceleme', 'Review') }}</h3>
          <div class="ai-preview-content" v-html="aiResult" />
          <p class="text-xs text-slate-500">
            {{
              text(
                'AI metni yayınlamadan önce doğruluk ve kaynaklar açısından inceleyin.',
                'Review AI output for accuracy and sources before publishing.',
              )
            }}
          </p>
          <div class="flex flex-wrap gap-2">
            <UButton @click="applyAi('append')">{{
              text('İçeriğin sonuna ekle', 'Append to content')
            }}</UButton
            ><UButton color="neutral" variant="outline" @click="applyAi('replace')">{{
              text('İçeriğin yerine koy', 'Replace content')
            }}</UButton>
          </div>
        </div>
      </div></template
    ></UModal
  >
</template>
