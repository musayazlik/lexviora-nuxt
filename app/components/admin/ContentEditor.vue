<script setup lang="ts">
import type { ContentRecord, ContentLocale, Resource, Translation } from '#shared/types/content';
import type { AiGenerateResult } from '#shared/ai';
import type { MediaAsset } from '#shared/types/media';
import { contentDefinitions } from '~/utils/content-fields';
const props = defineProps<{ resource: Resource; record?: ContentRecord | null }>();
const emit = defineEmits<{ saved: [value: ContentRecord] }>();
const { text, canPublish, errorText, statusText } = useAdmin();
const { languages } = useContentLanguages();
const localePath = useContentLocalePath();
const toast = useToast();
const definition = computed(() => contentDefinitions[props.resource]);
const language = ref<ContentLocale>('en');
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
  commentsEnabled: true,
  tagIds: [],
  sort: 0,
  icon: 'scale',
  translations: {},
});
const snapshot = ref('');
const saving = ref(false);
const error = ref('');
const savedAt = ref('');
function initialize() {
  if (props.record) Object.assign(draft, JSON.parse(JSON.stringify(props.record)));
  for (const code of new Set([
    ...languages.value.map((item) => item.code),
    ...Object.keys(draft.translations),
  ])) {
    draft.translations[code] ??= {};
    for (const field of definition.value.fields) draft.translations[code]![field.key] ??= '';
  }
  if (!draft.translations[language.value]?.[definition.value.fields[0]!.key] && draft.id)
    language.value =
      Object.keys(draft.translations).find(
        (code) => draft.translations[code]?.[definition.value.fields[0]!.key],
      ) || 'en';
  snapshot.value = JSON.stringify(draft);
}
initialize();
const active = computed(() => draft.translations[language.value]! as Record<string, string>);
const languageOptions = computed(() =>
  Object.keys(draft.translations).map((code) => ({
    value: code,
    label:
      (languages.value.find((item) => item.code === code)?.name || code.toUpperCase()) +
      (draft.translations[code]?.[definition.value.fields[0]!.key] ? ' · Translated' : ' · Empty'),
  })),
);
const contentDirection = computed(
  () => languages.value.find((item) => item.code === language.value)?.direction || 'ltr',
);
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
const { data: tags } = await useFetch<ContentRecord[]>('/api/admin/content/tags', {
  default: () => [],
});
const tagOptions = computed(() =>
  tags.value.map((t) => ({
    value: t.id,
    label: String(t.translations[language.value]?.name || t.translations.en?.name || t.slug),
  })),
);
const taxonomyKind = ref<'categories' | 'tags' | null>(null),
  taxonomyName = ref(''),
  taxonomyBusy = ref(false),
  taxonomyError = ref('');
const taxonomyOpen = computed({
  get: () => !!taxonomyKind.value,
  set: (v: boolean) => {
    if (!v) taxonomyKind.value = null;
  },
});
const coverPicker = ref(false),
  blogAiOpen = ref(false);
const aiSaved = ref<ContentRecord | null>(null);
const scheduleValue = computed({
  get: () =>
    draft.scheduledAt
      ? new Date(new Date(draft.scheduledAt).getTime() - new Date().getTimezoneOffset() * 60000)
          .toISOString()
          .slice(0, 16)
      : '',
  set: (v: string) => {
    draft.scheduledAt = v ? new Date(v).toISOString() : null;
  },
});
function selectCover(items: MediaAsset[]) {
  if (items[0]) {
    if (props.resource === 'articles') draft.coverImage = items[0].url;
    else draft.photo = items[0].url;
  }
}
async function resolveTaxonomy(resource: 'categories' | 'tags', name: string) {
  const list = resource === 'categories' ? categories : tags;
  const found = list.value.find((r) =>
    Object.values(r.translations).some(
      (t) => String(t?.name || '').toLocaleLowerCase() === name.toLocaleLowerCase(),
    ),
  );
  if (found) return found.id;
  const slug = slugify(name) || 'term-' + crypto.randomUUID().slice(0, 8);
  const sameSlug = list.value.find((r) => r.slug === slug);
  if (sameSlug) return sameSlug.id;
  const row = await $fetch<ContentRecord>(`/api/admin/content/${resource}`, {
    method: 'POST',
    body: { slug, sort: 0, translations: { [language.value]: { name } } },
  });
  list.value.push(row);
  return row.id;
}
async function createTaxonomy() {
  if (!taxonomyKind.value || !taxonomyName.value.trim()) return;
  taxonomyBusy.value = true;
  taxonomyError.value = '';
  try {
    const id = await resolveTaxonomy(taxonomyKind.value, taxonomyName.value.trim());
    if (taxonomyKind.value === 'categories') draft.categoryId = id;
    else draft.tagIds = [...new Set([...(draft.tagIds || []), id])];
    taxonomyKind.value = null;
    taxonomyName.value = '';
  } catch (e) {
    taxonomyError.value = errorText(e);
  } finally {
    taxonomyBusy.value = false;
  }
}
async function applyBlogAi(result: AiGenerateResult) {
  if (locked.value) throw new Error('Only an administrator can edit published content.');
  language.value = result.language || language.value;
  draft.translations[language.value] ??= {};
  if (result.title !== undefined) active.value.title = result.title;
  if (result.description !== undefined) active.value.excerpt = result.description;
  if (result.contentHtml !== undefined) active.value.body = result.contentHtml;
  if (result.cover) draft.coverImage = result.cover.url;
  if (result.category) draft.categoryId = await resolveTaxonomy('categories', result.category);
  if (result.tags.length)
    draft.tagIds = await Promise.all(result.tags.map((t) => resolveTaxonomy('tags', t)));
  if (!draft.slug)
    draft.slug = slugify(active.value.title || '') || 'article-' + crypto.randomUUID().slice(0, 8);
  draft.scheduledAt = null;
  const saved = await save('draft', true);
  if (!saved) throw new Error(error.value || 'Draft could not be saved.');
  aiSaved.value = saved;
}
watch(blogAiOpen, (value) => {
  if (!value && aiSaved.value) {
    emit('saved', aiSaved.value);
    aiSaved.value = null;
  }
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
async function save(status?: ContentRecord['status'], silent = false) {
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
    // Blank languages have no database row, but remain selectable after a save.
    for (const item of languages.value) {
      draft.translations[item.code] ??= {};
      for (const field of definition.value.fields) draft.translations[item.code]![field.key] ??= '';
    }
    snapshot.value = JSON.stringify(draft);
    savedAt.value = new Intl.DateTimeFormat('en', {
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date());
    toast.add({ title: text('Değişiklikler kaydedildi.', 'Changes saved.'), color: 'success' });
    if (!silent) emit('saved', result);
    return result;
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
const aiSource = ref('en');
const aiSourceOptions = computed(() =>
  Object.keys(draft.translations)
    .filter((code) => code !== language.value && draft.translations[code]?.[richField.value])
    .map((code) => ({
      value: code,
      label: languages.value.find((item) => item.code === code)?.name || code,
    })),
);
watch(aiSourceOptions, (items) => {
  if (!items.some((item) => item.value === aiSource.value)) aiSource.value = items[0]?.value || '';
});
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
        content:
          aiAction.value === 'translate'
            ? String(draft.translations[aiSource.value]?.[richField.value] || '')
            : active.value[richField.value] || '',
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
  props.resource === 'pages'
    ? draft.slug === 'home'
      ? '/'
      : '/' + draft.slug
    : props.resource === 'articles'
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
          :to="localePath(preview, language)"
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
    <UAlert
      v-if="error"
      :title="error"
      color="error"
      variant="soft"
      icon="i-lucide-circle-alert"
      role="alert"
      class="mb-5"
    /><UAlert
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
            <USelect
              v-model="language"
              :items="languageOptions"
              aria-label="Content language"
              class="content-language-select"
            />
          </div>
          <div class="editor-fields" :key="language" :lang="language">
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
                  :dir="contentDirection"
                  :rows="3"
                  :maxlength="field.key === 'excerpt' ? 500 : 5000"
                  class="w-full"
                  autoresize /><UInput
                  v-else
                  v-model="active[field.key]"
                  :dir="contentDirection"
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
                    :disabled="locked"
                    @click="resource === 'articles' ? (blogAiOpen = true) : (aiOpen = true)"
                    >{{ text('AI asistanı', 'AI assistant') }}</UButton
                  >
                </div>
                <ClientOnly
                  ><AdminRichTextEditor
                    :key="language + field.key"
                    v-model="active[field.key]"
                    :id="'rich-' + field.key"
                    :label="text(field.tr, field.en)"
                    :language="language"
                    :direction="contentDirection"
                    :editable="!locked"
                  /><template #fallback
                    ><div class="editor-loading">Preparing your editor…</div></template
                  ></ClientOnly
                >
              </div></template
            >
          </div>
        </section>
      </div>
      <aside class="editor-options">
        <section v-if="resource === 'articles'" class="admin-panel option-panel">
          <h2>{{ text('Yayın ayarları', 'Publication') }}</h2>
          <UFormField v-if="canPublish" label="Publish at" hint="Leave empty to publish immediately"
            ><UInput v-model="scheduleValue" type="datetime-local" class="w-full"
          /></UFormField>
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
            ><USelect v-model="categoryValue" :items="categoryOptions" class="w-full" /><UButton
              size="xs"
              variant="link"
              class="mt-1"
              icon="i-lucide-plus"
              @click="taxonomyKind = 'categories'"
              >Create category</UButton
            ></UFormField
          ><UFormField label="Tags"
            ><USelectMenu
              v-model="draft.tagIds"
              multiple
              :items="tagOptions"
              value-key="value"
              placeholder="Select tags"
              class="w-full"
            /><UButton
              size="xs"
              variant="link"
              class="mt-1"
              icon="i-lucide-plus"
              @click="taxonomyKind = 'tags'"
              >Create tag</UButton
            ></UFormField
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
          /><USwitch v-model="draft.commentsEnabled" label="Allow comments" />
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
          ><UButton
            icon="i-lucide-images"
            variant="outline"
            color="neutral"
            @click="coverPicker = true"
            >Choose or upload image</UButton
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
        <section v-if="resource === 'pages'" class="admin-panel option-panel">
          <h2>Page content</h2>
          <p class="text-sm text-slate-500">
            Translations appear on the website after saving. Use “home” for the homepage.
          </p>
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
  <AdminMediaPicker
    v-model:open="coverPicker"
    kind="image"
    @select="selectCover"
  /><AdminBlogAiDialog
    v-if="resource === 'articles'"
    v-model:open="blogAiOpen"
    :language="language"
    :title="active.title || ''"
    :excerpt="active.excerpt || ''"
    :content="active.body || ''"
    :categories="
      categories.map((c) =>
        String(c.translations[language]?.name || c.translations.en?.name || c.slug),
      )
    "
    :tags="
      tags.map((c) => String(c.translations[language]?.name || c.translations.en?.name || c.slug))
    "
    :apply="applyBlogAi"
  /><UModal
    v-model:open="taxonomyOpen"
    :title="taxonomyKind === 'tags' ? 'Create tag' : 'Create category'"
    description="This name is saved in the selected content language."
    ><template #body
      ><UFormField label="Name"
        ><UInput
          v-model="taxonomyName"
          class="w-full"
          :maxlength="200"
          @keydown.enter.prevent="createTaxonomy" /></UFormField
      ><UAlert v-if="taxonomyError" :title="taxonomyError" color="error" class="mt-3" /><UButton
        class="mt-4"
        :loading="taxonomyBusy"
        :disabled="!taxonomyName.trim()"
        @click="createTaxonomy"
        >Create</UButton
      ></template
    ></UModal
  >
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
        ><UFormField v-if="aiAction === 'translate'" label="Translate from">
          <USelect
            v-model="aiSource"
            :items="aiSourceOptions"
            placeholder="Add content in another language first"
            class="w-full"
          /> </UFormField
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
          {{ languages.find((item) => item.code === language)?.name || language.toUpperCase() }}
        </p>
        <UAlert v-if="aiError" :title="aiError" color="error" /><UButton
          icon="i-lucide-sparkles"
          :loading="aiBusy"
          :disabled="
            (aiAction === 'draft' && !aiPrompt.trim()) || (aiAction === 'translate' && !aiSource)
          "
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
