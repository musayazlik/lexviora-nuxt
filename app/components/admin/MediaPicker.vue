<script setup lang="ts">
import type { MediaAsset } from '#shared/types/media';
const open = defineModel<boolean>('open', { default: false });
const props = withDefaults(
  defineProps<{ kind?: 'image' | 'video' | 'all'; multiple?: boolean }>(),
  { kind: 'image', multiple: false },
);
const emit = defineEmits<{ select: [items: MediaAsset[]] }>();
const items = ref<MediaAsset[]>([]),
  selected = ref<MediaAsset[]>([]),
  query = ref('');
const busy = ref(false),
  error = ref('');
const { errorText } = useAdmin();
watch(open, async (value) => {
  if (!value) return;
  selected.value = [];
  error.value = '';
  try {
    items.value = await $fetch<MediaAsset[]>('/api/admin/media');
  } catch (e) {
    error.value = errorText(e);
  }
});
const visible = computed(() =>
  items.value.filter(
    (item) =>
      (props.kind === 'all' ||
        (props.kind === 'video'
          ? item.mime?.startsWith('video/')
          : !item.mime?.startsWith('video/'))) &&
      item.name.toLowerCase().includes(query.value.toLowerCase()),
  ),
);
function toggle(item: MediaAsset) {
  selected.value = selected.value.some((i) => i.url === item.url)
    ? selected.value.filter((i) => i.url !== item.url)
    : props.multiple
      ? [...selected.value, item]
      : [item];
}
async function upload(event: Event) {
  busy.value = true;
  error.value = '';
  try {
    for (const file of Array.from((event.target as HTMLInputElement).files || [])) {
      const body = new FormData();
      body.append('file', file);
      const result = await $fetch<MediaAsset>('/api/admin/media', { method: 'POST', body });
      items.value.unshift(result);
      toggle(result);
    }
  } catch (e) {
    error.value = errorText(e);
  } finally {
    busy.value = false;
    (event.target as HTMLInputElement).value = '';
  }
}
function choose() {
  emit('select', selected.value);
  open.value = false;
}
</script>
<template>
  <UModal
    v-model:open="open"
    title="Media library"
    description="Reuse an existing file or upload to UploadThing."
    :ui="{ content: 'sm:max-w-4xl' }"
  >
    <template #body
      ><div class="media-picker-tools">
        <UInput
          v-model="query"
          icon="i-lucide-search"
          placeholder="Search files…"
          aria-label="Search media"
        /><label class="media-upload-label"
          ><UIcon name="i-lucide-upload" />{{ busy ? 'Uploading…' : 'Upload files'
          }}<input
            type="file"
            :accept="
              kind === 'image'
                ? 'image/png,image/jpeg,image/webp,image/gif'
                : kind === 'video'
                  ? 'video/mp4,video/webm'
                  : 'image/png,image/jpeg,image/webp,image/gif,video/mp4,video/webm'
            "
            :multiple="multiple"
            :disabled="busy"
            @change="upload"
        /></label>
      </div>
      <UAlert v-if="error" :title="error" color="error" class="mb-4" />
      <div class="media-picker-grid">
        <button
          v-for="item in visible"
          :key="item.url"
          type="button"
          :class="{ selected: selected.some((i) => i.url === item.url) }"
          :aria-pressed="selected.some((i) => i.url === item.url)"
          @click="toggle(item)"
        >
          <video v-if="item.mime?.startsWith('video/')" :src="item.url" preload="metadata" /><img
            v-else
            :src="item.url"
            :alt="item.alt || ''"
            loading="lazy"
          /><span>{{ item.name }}</span
          ><UIcon
            v-if="selected.some((i) => i.url === item.url)"
            name="i-lucide-check"
            class="media-selected"
          />
        </button>
      </div>
      <p v-if="!visible.length" class="py-10 text-center text-slate-500">
        No matching files. Upload your first file to get started.
      </p>
    </template>
    <template #footer
      ><div class="flex w-full justify-end gap-2">
        <UButton color="neutral" variant="outline" @click="open = false">Cancel</UButton
        ><UButton :disabled="!selected.length || busy" @click="choose"
          >Insert {{ selected.length || '' }}
          {{ selected.length === 1 ? 'file' : 'files' }}</UButton
        >
      </div></template
    >
  </UModal>
</template>
