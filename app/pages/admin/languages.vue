<script setup lang="ts">
import type { ContentLanguage } from '#shared/languages';
definePageMeta({ middleware: 'auth', layout: 'admin' });
const { errorText } = useAdmin();
const { data: records, error } = await useFetch<ContentLanguage[]>('/api/admin/languages', {
  default: () => [],
});
const { languages } = useContentLanguages();
const toast = useToast();
const open = ref(false);
const editing = ref(false);
const saving = ref(false);
const formError = ref('');
const draft = reactive<ContentLanguage>({
  code: '',
  name: '',
  nativeName: '',
  direction: 'ltr',
  enabled: true,
  sort: 0,
});
useSeoMeta({ title: 'Content languages | Lexviora' });
function edit(language?: ContentLanguage) {
  editing.value = !!language;
  Object.assign(
    draft,
    language || {
      code: '',
      name: '',
      nativeName: '',
      direction: 'ltr',
      enabled: true,
      sort: records.value.length,
    },
  );
  formError.value = '';
  open.value = true;
}
async function persist(value: ContentLanguage) {
  const result = await $fetch<ContentLanguage[]>('/api/admin/languages', {
    method: 'PUT',
    body: value,
  });
  records.value = result;
  languages.value = result.filter((item) => item.enabled);
}
async function save() {
  saving.value = true;
  formError.value = '';
  try {
    await persist(draft);
    open.value = false;
    toast.add({ title: 'Language saved.', color: 'success' });
  } catch (error) {
    formError.value = errorText(error);
  } finally {
    saving.value = false;
  }
}
async function toggle(language: ContentLanguage) {
  try {
    await persist({ ...language, enabled: !language.enabled });
  } catch (error) {
    toast.add({ title: errorText(error), color: 'error' });
  }
}
</script>
<template>
  <div>
    <header class="admin-page-heading">
      <div>
        <h1>Content languages</h1>
        <p>
          Choose the languages available to your editors and website visitors. The admin stays in
          English.
        </p>
      </div>
      <UButton icon="i-lucide-plus" @click="edit()">Add language</UButton>
    </header>
    <UAlert v-if="error" title="Unable to load languages." color="error" class="mb-5" />
    <section class="admin-panel">
      <div class="admin-table-scroll">
        <table class="admin-table language-table">
          <caption class="sr-only">
            Website content languages
          </caption>
          <thead>
            <tr>
              <th>Language</th>
              <th>Code</th>
              <th>Direction</th>
              <th>Website</th>
              <th class="actions-column"><span class="sr-only">Actions</span></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in records" :key="item.code">
              <td>
                <strong>{{ item.name }}</strong
                ><small class="language-native" :lang="item.code">{{ item.nativeName }}</small>
              </td>
              <td>{{ item.code }}</td>
              <td>{{ item.direction === 'rtl' ? 'Right to left' : 'Left to right' }}</td>
              <td>
                <span :class="['content-status', item.enabled ? 'published' : 'draft']"
                  ><i />{{ item.enabled ? 'Enabled' : 'Hidden' }}</span
                >
              </td>
              <td class="actions-column">
                <AdminRowActions
                  :label="'Actions: ' + item.name"
                  :items="[
                    { label: 'Edit language', icon: 'i-lucide-pencil', onSelect: () => edit(item) },
                    {
                      label: item.enabled ? 'Hide from website' : 'Enable language',
                      icon: item.enabled ? 'i-lucide-eye-off' : 'i-lucide-eye',
                      disabled: item.code === 'en',
                      onSelect: () => toggle(item),
                    },
                  ]"
                />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <footer class="collection-footer">
        <span
          >Hiding a language keeps its saved translations. English is the default website
          language.</span
        >
      </footer>
    </section>
    <UModal
      v-model:open="open"
      :title="editing ? 'Edit language' : 'Add content language'"
      description="Use a language code such as fr, it or pt-br. New languages can be used immediately."
    >
      <template #body
        ><form id="language-form" class="settings-form !p-0" @submit.prevent="save">
          <UAlert v-if="formError" :title="formError" color="error" />
          <UFormField label="Language name" required
            ><UInput
              v-model="draft.name"
              required
              maxlength="80"
              placeholder="French"
              class="w-full"
          /></UFormField>
          <UFormField label="Native name" required
            ><UInput
              v-model="draft.nativeName"
              required
              maxlength="80"
              placeholder="Français"
              class="w-full"
          /></UFormField>
          <UFormField
            label="Language code"
            :hint="editing ? 'Codes cannot be changed.' : 'BCP 47'"
            required
            ><UInput
              v-model="draft.code"
              required
              :disabled="editing"
              maxlength="35"
              placeholder="fr"
              class="w-full"
          /></UFormField>
          <UFormField label="Text direction"
            ><USelect
              v-model="draft.direction"
              :items="[
                { label: 'Left to right', value: 'ltr' },
                { label: 'Right to left', value: 'rtl' },
              ]"
              class="w-full"
          /></UFormField>
          <UFormField label="Display order"
            ><UInput v-model.number="draft.sort" type="number" min="0" max="1000" class="w-full"
          /></UFormField>
          <USwitch
            v-model="draft.enabled"
            :disabled="draft.code === 'en'"
            label="Available on the website"
          /></form
      ></template>
      <template #footer
        ><div class="flex w-full justify-end gap-2">
          <UButton variant="outline" color="neutral" @click="open = false">Cancel</UButton
          ><UButton type="submit" form="language-form" :loading="saving">Save language</UButton>
        </div></template
      >
    </UModal>
  </div>
</template>
