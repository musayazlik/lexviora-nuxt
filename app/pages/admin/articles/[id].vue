<script setup lang="ts">
import type { ContentRecord } from '#shared/types/content';
definePageMeta({ middleware: 'auth', layout: 'admin' });
const route = useRoute();
const { text } = useAdmin();
const localePath = useLocalePath();
const id = String(route.params.id);
const { data: records } = await useFetch<ContentRecord[]>('/api/admin/content/articles', {
  default: () => [],
});
const record = computed(() =>
  id === 'new' ? null : records.value.find((r) => r.id === Number(id)),
);
if (id !== 'new' && !record.value) throw createError({ statusCode: 404 });
useSeoMeta({
  title: () =>
    (id === 'new' ? text('Yeni makale', 'New article') : text('Makaleyi düzenle', 'Edit article')) +
    ' | Lexviora',
});
async function saved(value: ContentRecord) {
  if (id === 'new') await navigateTo(localePath('/admin/articles/' + value.id), { replace: true });
}
</script>
<template>
  <div>
    <header class="admin-page-heading editor-heading">
      <div>
        <NuxtLink :to="localePath('/admin/articles')" class="editor-back"
          ><UIcon name="i-lucide-arrow-left" />{{
            text('Makalelere dön', 'Back to articles')
          }}</NuxtLink
        >
        <h1>
          {{
            id === 'new'
              ? text('Yeni bir bakış açısı.', 'A new perspective.')
              : text('Makaleyi düzenle.', 'Refine your article.')
          }}
        </h1>
        <p>
          {{
            text(
              'Bilginizi, Lexviora’nın özenli diliyle paylaşın.',
              'Share your knowledge with the care it deserves.',
            )
          }}
        </p>
      </div>
      <span class="editor-heading-mark"><UIcon name="i-lucide-feather" /></span>
    </header>
    <AdminContentEditor :key="id" resource="articles" :record="record" @saved="saved" />
  </div>
</template>
