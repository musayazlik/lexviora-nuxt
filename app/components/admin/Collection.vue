<script setup lang="ts">
import type { ContentRecord, Resource } from '#shared/types/content';
import { contentDefinitions } from '~/utils/content-fields';
const props = defineProps<{ resource: Resource }>();
const { locale } = useContentLanguage();
const { languages } = useContentLanguages();
const { text, statusText, date, canPublish, errorText } = useAdmin();
const localePath = useContentLocalePath();
const definition = computed(() => contentDefinitions[props.resource]);
const {
  data: records,
  error,
  status,
  refresh,
} = await useFetch<ContentRecord[]>(`/api/admin/content/${props.resource}`, { default: () => [] });
const search = ref('');
const filter = ref('all');
const sort = ref('newest');
const { data: categories } = await useFetch<ContentRecord[]>('/api/admin/content/categories', {
  default: () => [],
});
const categoryName = (record: ContentRecord) => {
  const category = categories.value.find((item) => item.id === record.categoryId);
  return String(
    category?.translations[locale.value]?.name ||
      category?.translations.en?.name ||
      Object.values(category?.translations || {}).find((translation) => translation?.name)?.name ||
      '—',
  );
};
const sortOptions = computed(() => [
  { label: text('Son düzenlenen', 'Recently edited'), value: 'newest' },
  { label: text('Önce eski kayıtlar', 'Oldest first'), value: 'oldest' },
  { label: text('Başlığa göre A–Z', 'Title A–Z'), value: 'title' },
]);
const page = ref(1);
const pageSize = 10;

/** İlk alan (ör. "title"), çeviri fallback zincirinde ana başlık olarak kullanılır. */
const primaryFieldKey = computed(() => definition.value.fields[0]!.key);

/** Kayıt başlığı: name → aktif dil → en → tr → slug sırasıyla çözülür. */
function title(record: ContentRecord): string {
  const key = primaryFieldKey.value;
  const translated =
    record.translations[locale.value]?.[key] ||
    record.translations.en?.[key] ||
    record.translations.tr?.[key] ||
    Object.values(record.translations).find((translation) => translation?.[key])?.[key];
  return record.name || String(translated || record.slug || '');
}

const filtered = computed(() => {
  const query = search.value.toLocaleLowerCase(locale.value);
  const result = records.value.filter((record) => {
    const matchesSearch = !query || title(record).toLocaleLowerCase(locale.value).includes(query);
    const matchesFilter = filter.value === 'all' || record.status === filter.value;
    return matchesSearch && matchesFilter;
  });
  return result.sort((a, b) =>
    sort.value === 'title'
      ? title(a).localeCompare(title(b), locale.value)
      : sort.value === 'oldest'
        ? a.id - b.id
        : new Date(b.updatedAt || b.createdAt || 0).getTime() -
            new Date(a.updatedAt || a.createdAt || 0).getTime() || b.id - a.id,
  );
});
const visible = computed(() =>
  filtered.value.slice((page.value - 1) * pageSize, page.value * pageSize),
);

/** Sekme rozetleri için duruma göre makale sayıları. */
const statusCounts = computed(() => {
  const counts: Record<string, number> = { all: records.value.length };
  for (const record of records.value) {
    if (record.status) counts[record.status] = (counts[record.status] ?? 0) + 1;
  }
  return counts;
});

watch([search, filter, sort], () => {
  page.value = 1;
});
const editorOpen = ref(false);
const editing = ref<ContentRecord | null>(null);
const editor = useTemplateRef<{ dirty: boolean }>('recordEditor');
const editorKey = ref(0);
const deleting = ref<ContentRecord | null>(null);
const removing = ref(false);
const toast = useToast();
function openEditor(record: ContentRecord | null) {
  if (props.resource === 'articles')
    return navigateTo(localePath('/admin/articles/' + (record?.id || 'new')));
  editing.value = record;
  editorKey.value++;
  editorOpen.value = true;
}
function closeEditor(value: boolean) {
  if (
    !value &&
    editor.value?.dirty &&
    !window.confirm(text('Kaydedilmemiş değişiklikler silinsin mi?', 'Discard unsaved changes?'))
  )
    return;
  editorOpen.value = value;
}
async function saved() {
  editorOpen.value = false;
  await refresh();
}

async function remove() {
  if (!deleting.value) return;
  removing.value = true;
  try {
    await $fetch(`/api/admin/content/${props.resource}`, {
      method: 'DELETE',
      query: { id: deleting.value.id },
    });
    deleting.value = null;
    await refresh();
    // Silme sonrası son sayfa boşaldıysa bir önceki sayfaya geri çekil.
    const lastPage = Math.max(1, Math.ceil(filtered.value.length / pageSize));
    if (page.value > lastPage) page.value = lastPage;
    toast.add({ title: text('İçerik silindi.', 'Content deleted.'), color: 'success' });
  } catch (e) {
    toast.add({ title: errorText(e), color: 'error' });
  } finally {
    removing.value = false;
  }
}
</script>
<template>
  <div class="collection-page">
    <header class="admin-page-heading">
      <div>
        <h1>{{ text(definition.tr, definition.en) }}</h1>
        <p>{{ text(definition.descriptionTr, definition.descriptionEn) }}</p>
      </div>
      <UButton icon="i-lucide-plus" size="lg" @click="openEditor(null)">{{
        resource === 'articles' ? text('Yeni makale', 'New article') : text('Yeni ekle', 'Add new')
      }}</UButton>
    </header>

    <section class="admin-panel collection-panel" :aria-label="text(definition.tr, definition.en)">
      <div
        v-if="resource === 'articles'"
        class="collection-tabs"
        role="group"
        :aria-label="text('Yayın durumuna göre filtrele', 'Filter by publication status')"
      >
        <button
          v-for="state in ['all', 'published', 'draft', 'review']"
          :key="state"
          type="button"
          :class="{ active: filter === state }"
          :aria-pressed="filter === state"
          @click="filter = state"
        >
          {{ state === 'all' ? text('Tüm makaleler', 'All articles') : statusText(state)
          }}<span>{{ statusCounts[state] ?? 0 }}</span>
        </button>
      </div>
      <div class="collection-toolbar">
        <UInput
          v-model="search"
          icon="i-lucide-search"
          :placeholder="text('Başlık veya konu ara…', 'Search by title or topic…')"
          :aria-label="text('İçeriklerde ara', 'Search content')"
          class="collection-search"
        />
        <div class="collection-toolbar-actions">
          <USelect
            v-model="sort"
            :items="sortOptions"
            icon="i-lucide-arrow-down-up"
            :aria-label="text('Sıralama', 'Sort order')"
            class="collection-sort"
          /><UButton
            icon="i-lucide-refresh-cw"
            color="neutral"
            variant="outline"
            :loading="status === 'pending'"
            :aria-label="text('Listeyi yenile', 'Refresh list')"
            @click="refresh()"
          />
        </div>
      </div>
      <UAlert
        v-if="error"
        :title="text('İçerikler yüklenemedi.', 'Unable to load content.')"
        color="error"
        class="m-5"
        :actions="[{ label: text('Tekrar dene', 'Try again'), onClick: () => refresh() }]"
      />
      <div class="admin-table-scroll">
        <table class="admin-table collection-table">
          <caption class="sr-only">
            {{
              text(definition.tr, definition.en)
            }}
            —
            {{
              filtered.length
            }}
            {{
              text('kayıt', 'records')
            }}
          </caption>
          <thead>
            <tr>
              <th scope="col" class="title-column">
                {{
                  resource === 'attorneys' ? text('Avukat', 'Attorney') : text('Başlık', 'Title')
                }}
              </th>
              <th v-if="resource === 'articles'" scope="col">{{ text('Kategori', 'Category') }}</th>
              <th v-if="resource === 'articles'" scope="col">{{ text('Durum', 'Status') }}</th>
              <th scope="col">{{ text('Dil', 'Language') }}</th>
              <th v-if="resource === 'articles'" scope="col">
                {{ text('Son düzenleme', 'Last edited') }}
              </th>
              <th scope="col" class="actions-column">
                <span class="sr-only">{{ text('İşlemler', 'Actions') }}</span>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="record in visible" :key="record.id">
              <td>
                <button class="article-table-title" type="button" @click="openEditor(record)">
                  <img
                    v-if="record.coverImage || record.photo"
                    :src="record.coverImage || record.photo || ''"
                    alt=""
                    :class="['table-thumbnail', { 'table-portrait': resource === 'attorneys' }]"
                  /><span v-else class="table-doc-icon"
                    ><UIcon
                      :name="
                        resource === 'categories'
                          ? 'i-lucide-folder'
                          : resource === 'practice-areas'
                            ? 'i-lucide-scale'
                            : 'i-lucide-file-text'
                      " /></span
                  ><span class="table-title-text"
                    ><strong>{{ title(record) }}</strong
                    ><small
                      >{{
                        record.slug
                          ? '/' + record.slug
                          : text('İki dilli içerik', 'Multilingual content')
                      }}<UIcon
                        v-if="record.featured"
                        name="i-lucide-star"
                        class="table-featured-icon"
                        :aria-label="text('Öne çıkan', 'Featured')" /></small
                  ></span>
                </button>
              </td>
              <td v-if="resource === 'articles'">
                <span class="category-label">{{ categoryName(record) }}</span>
              </td>
              <td v-if="resource === 'articles'">
                <span :class="'content-status ' + record.status"
                  ><i />{{ statusText(record.status) }}</span
                >
              </td>
              <td>
                <div class="language-cell">
                  <UIcon name="i-lucide-languages" /><span
                    v-for="code in Object.keys(record.translations)"
                    :key="code"
                    class="language-badge"
                    :title="languages.find((item) => item.code === code)?.name || code"
                    >{{ code.toUpperCase() }}</span
                  >
                </div>
              </td>
              <td v-if="resource === 'articles'" class="date-cell">{{ date(record.updatedAt) }}</td>
              <td class="actions-column">
                <div class="table-actions">
                  <AdminRowActions
                    :label="text('Diğer işlemler: ', 'More actions: ') + title(record)"
                    :items="[
                      [
                        {
                          label: text('Düzenle', 'Edit'),
                          icon: 'i-lucide-pencil',
                          onSelect: () => openEditor(record),
                        },
                      ],
                      ...(canPublish
                        ? [
                            [
                              {
                                label: text('İçeriği sil', 'Delete content'),
                                icon: 'i-lucide-trash-2',
                                color: 'error' as const,
                                onSelect: () => {
                                  deleting = record;
                                },
                              },
                            ],
                          ]
                        : []),
                    ]"
                  />
                </div>
              </td>
            </tr>
            <tr v-if="!visible.length">
              <td :colspan="resource === 'articles' ? 6 : 3">
                <div class="collection-empty">
                  <span class="empty-icon"
                    ><UIcon :name="search ? 'i-lucide-search-x' : 'i-lucide-files'"
                  /></span>
                  <h2>
                    {{
                      status === 'pending'
                        ? text('İçerikler yükleniyor…', 'Loading your content…')
                        : search
                          ? text('Eşleşen içerik bulunamadı.', 'No matching content.')
                          : text('Burada henüz içerik yok.', 'No content here yet.')
                    }}
                  </h2>
                  <p>
                    {{
                      search
                        ? text(
                            'Başka bir başlık veya anahtar kelime deneyin.',
                            'Try a different title or keyword.',
                          )
                        : text(
                            'İlk içeriğinizi ekleyerek başlayın.',
                            'Get started by adding your first entry.',
                          )
                    }}
                  </p>
                  <UButton
                    v-if="status !== 'pending'"
                    :icon="search ? 'i-lucide-x' : 'i-lucide-plus'"
                    color="neutral"
                    variant="outline"
                    @click="search ? (search = '') : openEditor(null)"
                    >{{
                      search
                        ? text('Aramayı temizle', 'Clear search')
                        : text('Yeni içerik ekle', 'Add new content')
                    }}</UButton
                  >
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <footer class="collection-footer">
        <span
          ><strong
            >{{ filtered.length ? (page - 1) * pageSize + 1 : 0 }}–{{
              Math.min(page * pageSize, filtered.length)
            }}</strong
          >
          {{ text('/ toplam ', 'of ') }}{{ filtered.length }} {{ text('kayıt', 'records') }}</span
        ><UPagination
          v-if="filtered.length > pageSize"
          v-model:page="page"
          :items-per-page="pageSize"
          :total="filtered.length"
        /><span v-else class="collection-page-count">{{ text('Sayfa 1 / 1', 'Page 1 of 1') }}</span>
      </footer>
    </section>
    <UModal
      :open="editorOpen"
      :title="
        editing ? text('İçeriği düzenle', 'Edit content') : text('Yeni içerik', 'New content')
      "
      :description="text(definition.descriptionTr, definition.descriptionEn)"
      :ui="{ content: 'sm:max-w-6xl' }"
      @update:open="closeEditor"
      ><template #body
        ><AdminContentEditor
          ref="recordEditor"
          :key="editorKey"
          :resource="resource"
          :record="editing"
          @saved="saved" /></template
    ></UModal>
    <UModal
      :open="!!deleting"
      :title="text('İçerik silinsin mi?', 'Delete this content?')"
      :description="
        text(
          'Bu işlem geri alınamaz. İçerik ve tüm çevirileri silinecek.',
          'This permanently deletes the content and all its translations.',
        )
      "
      @update:open="
        (value) => {
          if (!value) deleting = null;
        }
      "
      ><template #body
        ><div class="delete-confirmation">
          <span><UIcon name="i-lucide-trash-2" /></span>
          <p>{{ deleting ? title(deleting) : '' }}</p>
        </div></template
      ><template #footer
        ><div class="flex w-full justify-end gap-3">
          <UButton color="neutral" variant="outline" @click="deleting = null">{{
            text('Vazgeç', 'Cancel')
          }}</UButton
          ><UButton color="error" :loading="removing" @click="remove">{{
            text('İçeriği sil', 'Delete content')
          }}</UButton>
        </div></template
      ></UModal
    >
  </div>
</template>
