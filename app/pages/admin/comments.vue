<script setup lang="ts">
definePageMeta({ middleware: 'auth', layout: 'admin' });
useSeoMeta({ title: 'Comments | Lexviora' });
interface Comment {
  id: number;
  name: string;
  email: string;
  body: string;
  status: string;
  locale: string;
  articleTitle: string;
  slug: string;
  created_at: string;
}
const { data, error, refresh } = await useFetch<Comment[]>('/api/admin/comments', {
  default: () => [],
});
const { canPublish, date, errorText } = useAdmin();
const search = ref(''),
  status = ref('all'),
  page = ref(1),
  selected = ref<Comment | null>(null),
  deleting = ref<Comment | null>(null),
  busy = ref(false);
const toast = useToast();
const filtered = computed(() =>
  data.value.filter(
    (c) =>
      (status.value === 'all' || c.status === status.value) &&
      `${c.name} ${c.email} ${c.body} ${c.articleTitle}`
        .toLowerCase()
        .includes(search.value.toLowerCase()),
  ),
);
watch([search, status], () => {
  page.value = 1;
});
async function moderate(c: Comment, action: string) {
  busy.value = true;
  try {
    await $fetch('/api/admin/comments', {
      method: action === 'delete' ? 'DELETE' : 'PATCH',
      body: { id: c.id, ...(action !== 'delete' ? { status: action } : {}) },
    });
    deleting.value = null;
    selected.value = null;
    await refresh();
    toast.add({
      title: action === 'delete' ? 'Comment deleted' : 'Comment updated',
      color: 'success',
    });
  } catch (e) {
    toast.add({ title: errorText(e), color: 'error' });
  } finally {
    busy.value = false;
  }
}
function actions(c: Comment) {
  return [
    [
      {
        label: 'Read comment',
        icon: 'i-lucide-message-square',
        onSelect: () => {
          selected.value = c;
        },
      },
      ...(canPublish.value
        ? [
            {
              label: c.status === 'approved' ? 'Move to pending' : 'Approve comment',
              icon: 'i-lucide-check',
              onSelect: () => moderate(c, c.status === 'approved' ? 'pending' : 'approved'),
            },
            {
              label: 'Reject comment',
              icon: 'i-lucide-message-square-off',
              onSelect: () => moderate(c, 'rejected'),
            },
            {
              label: 'Mark as spam',
              icon: 'i-lucide-shield-alert',
              onSelect: () => moderate(c, 'spam'),
            },
          ]
        : []),
    ],
    ...(canPublish.value
      ? [
          [
            {
              label: 'Delete comment',
              icon: 'i-lucide-trash-2',
              color: 'error' as const,
              onSelect: () => {
                deleting.value = c;
              },
            },
          ],
        ]
      : []),
  ];
}
</script>
<template>
  <div>
    <header class="admin-page-heading">
      <div>
        <h1>Comments</h1>
        <p>Review conversations before they appear in your journal.</p>
      </div>
      <UBadge variant="soft"
        >{{ data.filter((c) => c.status === 'pending').length }} pending</UBadge
      >
    </header>
    <UAlert v-if="error" title="Unable to load comments" color="error" class="mb-5" />
    <section class="admin-panel">
      <div class="blog-list-tools">
        <UInput
          v-model="search"
          icon="i-lucide-search"
          placeholder="Search comments…"
          aria-label="Search comments"
        /><USelect
          v-model="status"
          :items="
            ['all', 'pending', 'approved', 'rejected', 'spam'].map((value) => ({
              value,
              label:
                value === 'all' ? 'All statuses' : value.charAt(0).toUpperCase() + value.slice(1),
            }))
          "
          aria-label="Comment status"
        />
      </div>
      <div class="blog-table-scroll">
        <table class="blog-table">
          <thead>
            <tr>
              <th>Comment</th>
              <th>Article</th>
              <th>Status</th>
              <th>Received</th>
              <th><span class="sr-only">Actions</span></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="c in filtered.slice((page - 1) * 10, page * 10)" :key="c.id">
              <td>
                <strong>{{ c.name }}</strong
                ><small>{{ c.email }}</small>
                <p class="comment-excerpt">{{ c.body }}</p>
              </td>
              <td>
                {{ c.articleTitle }}<small>{{ c.locale.toUpperCase() }}</small>
              </td>
              <td>
                <UBadge
                  :color="
                    c.status === 'approved'
                      ? 'success'
                      : c.status === 'pending'
                        ? 'warning'
                        : 'neutral'
                  "
                  variant="soft"
                  >{{ c.status }}</UBadge
                >
              </td>
              <td>{{ date(c.created_at) }}</td>
              <td>
                <AdminRowActions :label="'Actions for comment by ' + c.name" :items="actions(c)" />
              </td>
            </tr>
            <tr v-if="!filtered.length">
              <td colspan="5" class="blog-table-empty">
                No comments match your filters. New comments will appear here for review.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="blog-list-footer">
        <span>{{ filtered.length }} comments</span
        ><UPagination
          v-if="filtered.length > 10"
          v-model:page="page"
          :total="filtered.length"
          :items-per-page="10"
        />
      </div>
    </section>
    <UModal
      :open="!!selected"
      title="Read comment"
      description="Only approved comments are visible on the website."
      @update:open="!$event && (selected = null)"
      ><template #body
        ><template v-if="selected"
          ><strong>{{ selected.name }}</strong>
          <p class="field-note">{{ selected.email }} · {{ selected.articleTitle }}</p>
          <p class="whitespace-pre-wrap my-5">{{ selected.body }}</p>
          <div v-if="canPublish" class="flex gap-2">
            <UButton :loading="busy" @click="moderate(selected, 'approved')">Approve</UButton
            ><UButton
              variant="outline"
              color="neutral"
              :disabled="busy"
              @click="moderate(selected, 'rejected')"
              >Reject</UButton
            >
          </div></template
        ></template
      ></UModal
    ><UModal
      :open="!!deleting"
      title="Delete comment?"
      description="This permanently removes the comment."
      @update:open="!$event && (deleting = null)"
      ><template #body
        ><UButton color="error" :loading="busy" @click="deleting && moderate(deleting, 'delete')"
          >Delete comment</UButton
        ></template
      ></UModal
    >
  </div>
</template>
