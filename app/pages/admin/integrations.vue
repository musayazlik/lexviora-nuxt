<script setup lang="ts">
import { AI_STYLES, AI_STYLE_LABELS, AI_DEPTHS, AI_DEPTH_LABELS } from '#shared/ai';
import { DEFAULT_AI_SETTINGS, type AiSettings } from '#shared/ai-settings';
definePageMeta({ middleware: 'auth', layout: 'admin' });
useSeoMeta({ title: 'Integrations | Lexviora' });
const { data, error } = await useFetch('/api/admin/integrations');
const { data: defaults } = await useFetch<AiSettings>('/api/admin/ai/settings');
const mail = reactive({
  senderName: data.value?.mail.senderName || 'Lexviora',
  contactEmail: data.value?.mail.contactEmail || '',
  notifyContact: data.value?.mail.notifyContact ?? true,
  acknowledgeContact: data.value?.mail.acknowledgeContact ?? true,
});
const ai = reactive<AiSettings>({ ...DEFAULT_AI_SETTINGS, ...defaults.value });
const { languages } = useContentLanguages();
const { errorText } = useAdmin();
const toast = useToast();
const saving = ref(false);
const styleOptions = AI_STYLES.map((value) => ({ value, label: AI_STYLE_LABELS[value] }));
const depthOptions = AI_DEPTHS.map((value) => ({ value, label: AI_DEPTH_LABELS[value] }));
async function save() {
  saving.value = true;
  try {
    await $fetch('/api/admin/integrations', { method: 'PUT', body: mail });
    await $fetch('/api/admin/ai/settings', { method: 'PUT', body: ai });
    toast.add({ title: 'Integration settings saved', color: 'success' });
  } catch (e) {
    toast.add({ title: errorText(e), color: 'error' });
  } finally {
    saving.value = false;
  }
}
</script>
<template>
  <div>
    <header class="admin-page-heading">
      <div>
        <h1>Integrations</h1>
        <p>Configure writing, media storage and email delivery.</p>
      </div>
      <UButton :loading="saving" icon="i-lucide-save" @click="save">Save settings</UButton>
    </header>
    <UAlert v-if="error" title="Unable to load integration settings" color="error" class="mb-5" />
    <div class="integration-layout">
      <section class="admin-panel integration-panel">
        <header>
          <div>
            <UIcon name="i-lucide-sparkles" />
            <h2>OpenRouter</h2>
          </div>
          <UBadge :color="data?.configured.openrouter ? 'success' : 'warning'" variant="soft">{{
            data?.configured.openrouter ? 'Connected' : 'Not configured'
          }}</UBadge>
        </header>
        <p>Default models and writing preferences for the article assistant.</p>
        <div class="integration-fields">
          <UFormField label="Writing model ID" hint="Leave empty for automatic selection"
            ><UInput
              v-model="ai.textModel"
              placeholder="provider/model-name"
              class="w-full" /></UFormField
          ><UFormField label="Image model ID" hint="Leave empty for automatic selection"
            ><UInput
              v-model="ai.imageModel"
              placeholder="provider/model-name"
              class="w-full" /></UFormField
          ><UFormField
            label="Research model"
            hint="Empty: Perplexity Sonar Pro. Use native for the writing model’s web search."
            ><UInput v-model="ai.researchModel" placeholder="perplexity/sonar-pro" class="w-full"
          /></UFormField>
          <div class="ai-options-grid">
            <UFormField label="Style"
              ><USelect v-model="ai.style" :items="styleOptions" class="w-full" /></UFormField
            ><UFormField label="Length"
              ><USelect v-model="ai.depth" :items="depthOptions" class="w-full" /></UFormField
            ><UFormField label="Default language"
              ><USelect
                v-model="ai.language"
                :items="
                  languages.filter((l) => l.enabled).map((l) => ({ value: l.code, label: l.name }))
                "
                class="w-full"
            /></UFormField>
          </div>
          <UFormField label="Inline citations"
            ><USelect
              v-model="ai.inlineCitations"
              :items="[
                { value: 'none', label: 'Bibliography only' },
                { value: 'light', label: 'Light inline citations and bibliography' },
              ]"
              class="w-full" /></UFormField
          ><USwitch v-model="ai.webSearch" label="Research the web by default" />
        </div>
        <p class="integration-env">Server variable: <code>OPENROUTER_API_KEY</code></p>
      </section>
      <div class="space-y-6">
        <section class="admin-panel integration-panel">
          <header>
            <div>
              <UIcon name="i-lucide-cloud-upload" />
              <h2>UploadThing</h2>
            </div>
            <UBadge :color="data?.configured.uploadthing ? 'success' : 'warning'" variant="soft">{{
              data?.configured.uploadthing ? 'Connected' : 'Not configured'
            }}</UBadge>
          </header>
          <p>
            Editor images, cover images and generated visuals share one media library. Images are
            optimized to WebP before upload.
          </p>
          <dl class="integration-limits">
            <div>
              <dt>Images</dt>
              <dd>Up to 8 MB</dd>
            </div>
            <div>
              <dt>Videos</dt>
              <dd>Up to 64 MB</dd>
            </div>
          </dl>
          <p class="integration-env">Server variable: <code>UPLOADTHING_TOKEN</code></p>
        </section>
        <section class="admin-panel integration-panel">
          <header>
            <div>
              <UIcon name="i-lucide-mail" />
              <h2>Plunk</h2>
            </div>
            <UBadge :color="data?.configured.plunk ? 'success' : 'warning'" variant="soft">{{
              data?.configured.plunk ? 'Connected' : 'Not configured'
            }}</UBadge>
          </header>
          <p>Newsletter confirmations, reader contacts and website enquiries.</p>
          <div class="integration-fields">
            <UFormField label="Verified sender email"
              ><UInput
                :model-value="data?.fromEmail || ''"
                readonly
                placeholder="Set PLUNK_FROM_EMAIL on the server"
                class="w-full" /></UFormField
            ><UFormField label="Sender name"
              ><UInput v-model="mail.senderName" class="w-full" /></UFormField
            ><UFormField label="Enquiry notification email"
              ><UInput v-model="mail.contactEmail" type="email" class="w-full" /></UFormField
            ><USwitch
              v-model="mail.notifyContact"
              label="Notify the team about new enquiries"
            /><USwitch
              v-model="mail.acknowledgeContact"
              label="Send an enquiry receipt to the visitor"
            />
          </div>
          <p class="integration-env">
            Server variables: <code>PLUNK_SECRET_KEY</code>, <code>PLUNK_FROM_EMAIL</code>
          </p>
        </section>
      </div>
    </div>
  </div>
</template>
