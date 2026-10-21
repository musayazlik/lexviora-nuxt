<script setup lang="ts">
definePageMeta({ middleware: 'auth', layout: 'admin' });
const { text, errorText } = useAdmin();
const {
  data: files,
  refresh,
  error,
} = await useFetch<
  Array<{ name: string; url: string; size: number; bundled: boolean; mime?: string }>
>('/api/admin/media', { default: () => [] });
const upload = useTemplateRef<HTMLInputElement>('uploadInput');
const uploading = ref(false);
const toast = useToast();
useSeoMeta({ title: () => text('Medya kütüphanesi | Lexviora', 'Media library | Lexviora') });
async function onUpload(event: Event) {
  const input = event.target as HTMLInputElement;
  const file = input.files?.[0];
  if (!file) return;
  uploading.value = true;
  try {
    if (file.size > (file.type.startsWith('video/') ? 64 : 8) * 1024 * 1024)
      throw new Error('Images must be 8 MB or smaller; videos must be 64 MB or smaller.');
    const body = new FormData();
    body.append('file', file);
    await $fetch('/api/admin/media', { method: 'POST', body });
    await refresh();
    toast.add({ title: text('Görsel yüklendi.', 'Image uploaded.'), color: 'success' });
  } catch (e) {
    toast.add({ title: errorText(e), color: 'error' });
  } finally {
    uploading.value = false;
    input.value = '';
  }
}
async function copy(url: string) {
  try {
    await navigator.clipboard.writeText(url);
    toast.add({
      title: text(
        'Görsel yolu kopyalandı. Editörde kullanabilirsiniz.',
        'Image path copied. You can use it in the editor.',
      ),
      color: 'success',
    });
  } catch {
    toast.add({ title: url, color: 'neutral' });
  }
}
</script>
<template>
  <div>
    <header class="admin-page-heading">
      <div>
        <p class="admin-eyebrow">
          {{ text('Lexviora görsel dünyası', 'The visual world of Lexviora') }}
        </p>
        <h1>{{ text('Medya kütüphanesi', 'Media library') }}</h1>
        <p>
          {{
            text(
              'Görselleri yükleyin, yollarını kopyalayın ve içeriklerinizde kullanın.',
              'Upload imagery, copy its path and use it in your content.',
            )
          }}
        </p>
      </div>
      <UButton icon="i-lucide-upload" :loading="uploading" size="lg" @click="upload?.click()">{{
        text('Dosya yükle', 'Upload file')
      }}</UButton
      ><input
        ref="uploadInput"
        type="file"
        accept="image/png,image/jpeg,image/webp,image/gif,video/mp4,video/webm"
        class="hidden"
        @change="onUpload"
      />
    </header>
    <UAlert
      v-if="error"
      color="error"
      :title="text('Görseller yüklenemedi.', 'Unable to load media.')"
      class="mb-5"
    />
    <div class="media-info">
      <UIcon name="i-lucide-image" /><span>{{ files.length }} {{ text('görsel', 'images') }}</span
      ><small>UploadThing · Images up to 8 MB · Videos up to 64 MB</small>
    </div>
    <div class="media-grid">
      <article v-for="file in files" :key="file.url" class="media-card">
        <a :href="file.url" target="_blank" rel="noopener"
          ><video v-if="file.mime?.startsWith('video/')" :src="file.url" preload="metadata" /><img
            v-else
            :src="file.url"
            :alt="file.name"
            loading="lazy"
        /></a>
        <div>
          <strong>{{ file.name }}</strong
          ><small>{{
            file.bundled
              ? text('Marka koleksiyonu', 'Brand collection')
              : (file.size / 1024).toFixed(0) + ' KB'
          }}</small
          ><UButton
            icon="i-lucide-copy"
            color="neutral"
            variant="ghost"
            :aria-label="text('Görsel yolunu kopyala', 'Copy image path')"
            @click="copy(file.url)"
          />
        </div>
      </article>
    </div>
  </div>
</template>
