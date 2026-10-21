<script setup lang="ts">
import {
  AI_STYLES,
  AI_STYLE_LABELS,
  AI_DEPTHS,
  AI_DEPTH_LABELS,
  type AiFields,
  type AiGenerateResult,
  type AiModelInfo,
} from '#shared/ai';
import {
  DEFAULT_AI_SETTINGS,
  DEFAULT_TEXT_MODELS,
  DEFAULT_IMAGE_MODELS,
  pickModel,
  type AiSettings,
} from '#shared/ai-settings';
const open = defineModel<boolean>('open', { default: false });
const props = defineProps<{
  language: string;
  title: string;
  excerpt: string;
  content: string;
  categories: string[];
  tags: string[];
  apply: (result: AiGenerateResult) => Promise<void>;
}>();
const { languages } = useContentLanguages();
const { errorText } = useAdmin();
const stage = ref<'setup' | 'generating' | 'result'>('setup');
const topic = ref('');
const fields = reactive<AiFields>({
  title: true,
  description: true,
  content: true,
  contentImages: false,
  cover: false,
  category: true,
  tags: true,
});
const fieldLabels: Record<keyof AiFields, string> = {
  title: 'Title',
  description: 'Excerpt',
  content: 'Article content',
  contentImages: 'Article illustrations',
  cover: 'Cover image',
  category: 'Category',
  tags: 'Tags',
};
const settings = reactive<AiSettings>({ ...DEFAULT_AI_SETTINGS });
const language = ref(props.language);
const catalog = ref<{ text: AiModelInfo[]; image: AiModelInfo[]; configured: boolean }>({
  text: [],
  image: [],
  configured: false,
});
const loading = ref(false),
  applying = ref(false),
  applied = ref(false),
  rewrite = ref(false);
const styleOptions = AI_STYLES.map((value) => ({ value, label: AI_STYLE_LABELS[value] }));
const depthOptions = AI_DEPTHS.map((value) => ({
  value,
  label:
    AI_DEPTH_LABELS[value] +
    { concise: ' · 400 words', standard: ' · 800 words', 'in-depth': ' · 1,400 words' }[value],
}));
const error = ref('');
const result = ref<AiGenerateResult | null>(null);
let loaded = false;
let controller: AbortController | null = null;
const options = (models: AiModelInfo[]) =>
  models.map((m) => ({
    label: m.name,
    value: m.id,
    description: `${m.free ? 'Free' : '$' + (m.priceIn?.toFixed(2) ?? '?') + ' in / $' + (m.priceOut?.toFixed(2) ?? '?') + ' out per 1M tokens'}${m.context ? ' · ' + Math.round(m.context / 1000) + 'k context' : ''}`,
  }));
const textModels = computed(() => options(catalog.value.text));
const imageModels = computed(() => options(catalog.value.image));
const modelDescription = computed(
  () => textModels.value.find((m) => m.value === settings.textModel)?.description,
);
const anyField = computed(() => Object.values(fields).some(Boolean));
watch(
  () => fields.content,
  (value) => {
    if (!value) fields.contentImages = false;
  },
);
watch(open, async (value) => {
  if (!value) {
    controller?.abort();
    return;
  }
  language.value = props.language;
  if (stage.value !== 'result') topic.value ||= props.title;
  if (loaded) return;
  loading.value = true;
  try {
    const response = await $fetch<typeof catalog.value & { defaults: AiSettings }>(
      '/api/admin/ai/models',
    );
    catalog.value = response;
    Object.assign(settings, response.defaults);
    settings.textModel = pickModel(response.text, [settings.textModel, ...DEFAULT_TEXT_MODELS]);
    settings.imageModel = pickModel(response.image, [settings.imageModel, ...DEFAULT_IMAGE_MODELS]);
    loaded = true;
  } catch (e) {
    error.value = errorText(e);
  } finally {
    loading.value = false;
  }
});
async function generate() {
  controller = new AbortController();
  error.value = '';
  stage.value = 'generating';
  applied.value = false;
  try {
    result.value = await $fetch<AiGenerateResult>('/api/admin/ai/generate', {
      method: 'POST',
      signal: controller.signal,
      body: {
        topic: topic.value,
        fields,
        language: language.value,
        style: settings.style,
        depth: settings.depth,
        webSearch: settings.webSearch,
        model: settings.textModel,
        imageModel: settings.imageModel,
        categories: props.categories,
        tags: props.tags,
        ...(rewrite.value
          ? { current: { title: props.title, excerpt: props.excerpt, content: props.content } }
          : {}),
      },
    });
    stage.value = 'result';
    // Match cmsmotive: the generated result becomes a saved draft, never a published post.
    await apply();
  } catch (e) {
    if (!controller.signal.aborted) error.value = errorText(e);
    stage.value = result.value ? 'result' : 'setup';
  }
}
async function apply() {
  if (!result.value || applied.value) return;
  applying.value = true;
  error.value = '';
  try {
    await props.apply(result.value);
    applied.value = true;
  } catch (e) {
    error.value = 'The result is available, but the draft could not be saved. ' + errorText(e);
  } finally {
    applying.value = false;
  }
}
function cancel() {
  controller?.abort();
  stage.value = 'setup';
}
onBeforeUnmount(() => controller?.abort());
</script>
<template>
  <UModal
    v-model:open="open"
    title="Write with AI"
    description="Create a complete draft with research, images and article details."
    :dismissible="stage !== 'generating' && !applying"
    :ui="{ content: 'sm:max-w-4xl' }"
  >
    <template #body>
      <UAlert v-if="error" :title="error" color="error" class="mb-5" />
      <div v-if="loading" class="ai-working">
        <UIcon name="i-lucide-loader-circle" class="animate-spin" />Loading available models…
      </div>
      <div v-else-if="stage === 'setup'" class="ai-composer">
        <UAlert
          v-if="!catalog.configured"
          title="Connect OpenRouter to start writing"
          description="Set OPENROUTER_API_KEY on the server. Defaults can be managed in Integrations."
          color="warning"
          class="mb-5"
        />
        <UFormField label="Topic or instructions" required
          ><UTextarea
            v-model="topic"
            :rows="3"
            :maxlength="4000"
            placeholder="What should this article explain? Include its audience and angle."
            class="w-full"
        /></UFormField>
        <USwitch
          v-if="content"
          v-model="rewrite"
          label="Rewrite the current article"
          class="mt-4"
        />
        <fieldset class="ai-fieldset">
          <legend>Generate</legend>
          <div class="ai-field-grid">
            <UCheckbox
              v-for="(label, key) in fieldLabels"
              :key="key"
              v-model="fields[key]"
              :label="label"
              :disabled="key === 'contentImages' && !fields.content"
            />
          </div>
        </fieldset>
        <div class="ai-options-grid">
          <UFormField label="Writing style"
            ><USelect v-model="settings.style" :items="styleOptions" class="w-full" /></UFormField
          ><UFormField label="Length"
            ><USelect v-model="settings.depth" :items="depthOptions" class="w-full" /></UFormField
          ><UFormField label="Content language"
            ><USelect
              v-model="language"
              :items="
                languages.filter((l) => l.enabled).map((l) => ({ value: l.code, label: l.name }))
              "
              class="w-full"
          /></UFormField>
        </div>
        <div class="ai-research-option">
          <div>
            <strong>Research the web before writing</strong>
            <p>Gather sources first, then write with a bibliography.</p>
          </div>
          <USwitch v-model="settings.webSearch" aria-label="Research the web before writing" />
        </div>
        <div class="ai-model-grid">
          <UFormField label="Writing model"
            ><USelectMenu
              v-model="settings.textModel"
              value-key="value"
              :items="textModels"
              placeholder="Search writing models"
              class="w-full"
            />
            <p class="field-note">{{ modelDescription }}</p></UFormField
          ><UFormField v-if="fields.cover || fields.contentImages" label="Image model"
            ><USelectMenu
              v-model="settings.imageModel"
              value-key="value"
              :items="imageModels"
              placeholder="Search image models"
              class="w-full"
            />
            <p class="field-note">
              {{ imageModels.find((m) => m.value === settings.imageModel)?.description }}
            </p></UFormField
          >
        </div>
        <div class="ai-bottom-bar">
          <p>Generated content is saved as a draft for review.</p>
          <UButton
            icon="i-lucide-sparkles"
            :disabled="
              !catalog.configured ||
              !anyField ||
              topic.trim().length < 3 ||
              !settings.textModel ||
              ((fields.cover || fields.contentImages) && !settings.imageModel)
            "
            @click="generate"
            >Generate draft</UButton
          >
        </div>
      </div>
      <div v-else-if="stage === 'generating'" class="ai-working">
        <UIcon name="i-lucide-loader-circle" class="animate-spin" />
        <h3>
          {{ settings.webSearch ? 'Researching and writing your article' : 'Writing your article' }}
        </h3>
        <p>
          {{
            fields.cover || fields.contentImages
              ? 'Images will be generated and added to your media library.'
              : 'The selected fields will be prepared together.'
          }}
        </p>
        <UButton variant="outline" color="neutral" @click="cancel">Cancel generation</UButton>
      </div>
      <div v-else-if="result" class="ai-result">
        <UAlert
          :title="
            applied
              ? 'Your draft has been saved'
              : applying
                ? 'Saving your draft…'
                : 'Your draft is ready to save'
          "
          :color="applied ? 'success' : 'info'"
          class="mb-5"
        />
        <UAlert
          v-for="warning in result.warnings"
          :key="warning"
          :title="warning"
          color="warning"
          variant="soft"
          class="mb-3"
        />
        <img
          v-if="result.cover"
          :src="result.cover.url"
          alt="Generated article cover"
          class="ai-cover"
        />
        <h2 v-if="result.title">{{ result.title }}</h2>
        <p v-if="result.description" class="ai-excerpt">{{ result.description }}</p>
        <div v-if="result.contentHtml" class="prose ai-result-body" v-html="result.contentHtml" />
        <div class="ai-taxonomy">
          <span v-if="result.category">Category: {{ result.category }}</span
          ><span v-for="tag in result.tags" :key="tag">{{ tag }}</span>
        </div>
        <details v-if="result.sources?.length">
          <summary>Research sources ({{ result.sources.length }})</summary>
          <ol>
            <li v-for="source in result.sources" :key="source.n">
              <a :href="source.url" target="_blank" rel="noopener noreferrer">{{
                source.title || source.url
              }}</a>
            </li>
          </ol>
        </details>
        <div class="ai-bottom-bar">
          <UButton
            variant="outline"
            color="neutral"
            :disabled="applying"
            icon="i-lucide-rotate-ccw"
            @click="stage = 'setup'"
            >Try again</UButton
          ><UButton v-if="!applied" :loading="applying" @click="apply">Save draft</UButton
          ><UButton v-else @click="open = false">Continue editing</UButton>
        </div>
      </div>
    </template>
  </UModal>
</template>
