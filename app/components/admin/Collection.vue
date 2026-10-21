<script setup lang="ts">
import type { ContentRecord, Resource } from '#shared/types/content';
import { contentDefinitions } from '~/utils/content-fields';
const props = defineProps<{ resource: Resource }>();
const { locale } = useI18n();
const { text, statusText, date, canPublish, errorText } = useAdmin();
const localePath = useLocalePath();
const definition = computed(() => contentDefinitions[props.resource]);
const { data: records, error, status, refresh } = await useFetch<ContentRecord[]>(`/api/admin/content/${props.resource}`, { default: () => [] });
const search = ref('');
const filter = ref('all');
const page = ref(1);
const pageSize = 10;
const title = (record: ContentRecord) => record.name || String(record.translations[locale.value]?.[definition.value.fields[0]!.key] || record.translations.en?.[definition.value.fields[0]!.key] || record.translations.tr?.[definition.value.fields[0]!.key] || record.slug || '');
const filtered = computed(() => records.value.filter(r => (!search.value || title(r).toLocaleLowerCase(locale.value).includes(search.value.toLocaleLowerCase(locale.value))) && (filter.value === 'all' || r.status === filter.value)));
const visible = computed(() => filtered.value.slice((page.value - 1) * pageSize, page.value * pageSize));
watch([search, filter], () => { page.value = 1; });
const editorOpen = ref(false);
const editing = ref<ContentRecord | null>(null);
const editor = useTemplateRef<{ dirty: boolean }>('recordEditor');
const editorKey = ref(0);
const deleting = ref<ContentRecord | null>(null);
const removing = ref(false);
const toast = useToast();
function openEditor(record: ContentRecord | null) {
  if (props.resource === 'articles') return navigateTo(localePath('/admin/articles/' + (record?.id || 'new')));
  editing.value = record; editorKey.value++; editorOpen.value = true;
}
function closeEditor(value: boolean) {
  if (!value && editor.value?.dirty && !window.confirm(text('Kaydedilmemiş değişiklikler silinsin mi?', 'Discard unsaved changes?'))) return;
  editorOpen.value = value;
}
async function saved() { editorOpen.value = false; await refresh(); }
async function remove() {
  if (!deleting.value) return;
  removing.value = true;
  try { await $fetch(`/api/admin/content/${props.resource}`, { method: 'DELETE', query: { id: deleting.value.id } }); deleting.value = null; await refresh(); if (page.value > Math.ceil(filtered.value.length / pageSize)) page.value = Math.max(1, page.value - 1); toast.add({ title: text('İçerik silindi.', 'Content deleted.'), color: 'success' }); } catch (e) { toast.add({ title: errorText(e), color: 'error' }); } finally { removing.value = false; }
}
</script>
<template><div><header class="admin-page-heading"><div><p class="admin-eyebrow">{{ text('İçerik yönetimi', 'Content management') }}</p><h1>{{ text(definition.tr, definition.en) }}</h1><p>{{ text(definition.descriptionTr, definition.descriptionEn) }}</p></div><UButton icon="i-lucide-plus" size="lg" @click="openEditor(null)">{{ resource === 'articles' ? text('Yeni makale', 'New article') : text('Yeni ekle', 'Add new') }}</UButton></header><div v-if="resource === 'articles'" class="article-summary"><button v-for="state in ['all', 'published', 'draft', 'review']" :key="state" :class="{ active: filter === state }" @click="filter = state"><span>{{ state === 'all' ? text('Tüm yazılar', 'All articles') : statusText(state) }}</span><strong>{{ state === 'all' ? records.length : records.filter(r => r.status === state).length }}</strong></button></div><section class="admin-panel"><div class="collection-toolbar"><UInput v-model="search" icon="i-lucide-search" :placeholder="text('İçeriklerde ara…', 'Search content…')" :aria-label="text('İçeriklerde ara', 'Search content')" class="w-full max-w-sm" /><span>{{ filtered.length }} {{ text('kayıt', 'records') }}</span></div><UAlert v-if="error" :title="text('İçerikler yüklenemedi.', 'Unable to load content.')" color="error" class="m-5" :actions="[{ label: text('Tekrar dene', 'Try again'), onClick: () => refresh() }]" /><div class="admin-table-scroll"><table class="admin-table"><thead><tr><th>{{ text('Başlık', 'Title') }}</th><th>{{ text('Diller', 'Languages') }}</th><th v-if="resource === 'articles'">{{ text('Durum', 'Status') }}</th><th v-if="resource === 'articles'">{{ text('Güncelleme', 'Updated') }}</th><th class="text-right">{{ text('İşlemler', 'Actions') }}</th></tr></thead><tbody><tr v-for="record in visible" :key="record.id"><td><button class="article-table-title text-left" @click="openEditor(record)"><img v-if="record.coverImage || record.photo" :src="record.coverImage || record.photo || ''" alt="" class="table-thumbnail" /><span v-else class="table-doc-icon"><UIcon name="i-lucide-file-text" /></span><span>{{ title(record) }}<small v-if="record.slug">/{{ record.slug }}</small></span></button></td><td><span v-for="code in Object.keys(record.translations)" :key="code" class="language-badge">{{ code.toUpperCase() }}</span></td><td v-if="resource === 'articles'"><span :class="'content-status ' + record.status"><i />{{ statusText(record.status) }}</span></td><td v-if="resource === 'articles'" class="whitespace-nowrap">{{ date(record.updatedAt) }}</td><td><div class="flex justify-end gap-1"><UButton icon="i-lucide-pencil" variant="ghost" color="neutral" :aria-label="text('Düzenle: ', 'Edit: ') + title(record)" @click="openEditor(record)" /><UButton v-if="canPublish" icon="i-lucide-trash-2" variant="ghost" color="error" :aria-label="text('Sil: ', 'Delete: ') + title(record)" @click="deleting = record" /></div></td></tr><tr v-if="!visible.length"><td :colspan="resource === 'articles' ? 5 : 3"><div class="collection-empty"><UIcon name="i-lucide-file-search" /><h2>{{ status === 'pending' ? text('Yükleniyor…', 'Loading…') : text('İçerik bulunamadı.', 'No content found.') }}</h2><p>{{ search ? text('Farklı bir arama deneyin.', 'Try a different search.') : text('Yeni bir içerik ekleyerek başlayın.', 'Get started by adding your first entry.') }}</p></div></td></tr></tbody></table></div><div class="collection-footer"><span>{{ filtered.length ? (page - 1) * pageSize + 1 : 0 }}–{{ Math.min(page * pageSize, filtered.length) }} / {{ filtered.length }}</span><UPagination v-if="filtered.length > pageSize" v-model:page="page" :items-per-page="pageSize" :total="filtered.length" /></div></section><UModal :open="editorOpen" :title="editing ? text('İçeriği düzenle', 'Edit content') : text('Yeni içerik', 'New content')" :description="text(definition.descriptionTr, definition.descriptionEn)" :ui="{ content: 'sm:max-w-6xl' }" @update:open="closeEditor"><template #body><AdminContentEditor ref="recordEditor" :key="editorKey" :resource="resource" :record="editing" @saved="saved" /></template></UModal><UModal :open="!!deleting" :title="text('İçerik silinsin mi?', 'Delete this content?')" :description="text('Bu işlem geri alınamaz. İçerik ve tüm çevirileri silinecek.', 'This permanently deletes the content and all its translations.')" @update:open="value => { if (!value) deleting = null; }"><template #body><p class="text-sm">{{ deleting ? title(deleting) : '' }}</p></template><template #footer><div class="flex justify-end gap-2"><UButton color="neutral" variant="outline" @click="deleting = null">{{ text('Vazgeç', 'Cancel') }}</UButton><UButton color="error" :loading="removing" @click="remove">{{ text('İçeriği sil', 'Delete content') }}</UButton></div></template></UModal></div></template>
