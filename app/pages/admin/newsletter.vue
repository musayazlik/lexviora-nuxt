<script setup lang="ts">
definePageMeta({ middleware: 'auth', layout: 'admin' });
useSeoMeta({ title: 'Newsletter | Lexviora' });
interface Subscriber {
  id: number;
  email: string;
  name: string;
  locale: string;
  status: string;
  confirmed_at: string | null;
  created_at: string;
  plunk_contact_id: string | null;
}
interface Delivery {
  id: number;
  kind: string;
  recipient: string;
  subject: string;
  status: string;
  attempts: number;
  error: string | null;
  created_at: string;
}
const {
  data: subscribers,
  error,
  refresh,
} = await useFetch<Subscriber[]>('/api/admin/newsletter', { default: () => [] });
const { data: mail, refresh: refreshMail } = await useFetch<Delivery[]>('/api/admin/mail', {
  default: () => [],
});
const { date, errorText } = useAdmin();
const { languages } = useContentLanguages();
const toast = useToast();
const tab = ref('subscribers'),
  search = ref(''),
  status = ref('all'),
  locale = ref('all'),
  page = ref(1),
  busy = ref(false),
  removing = ref<Subscriber | null>(null);
const filtered = computed(() =>
  subscribers.value.filter(
    (s) =>
      (status.value === 'all' || s.status === status.value) &&
      (locale.value === 'all' || s.locale === locale.value) &&
      `${s.name} ${s.email}`.toLowerCase().includes(search.value.toLowerCase()),
  ),
);
watch([search, status, locale, tab], () => {
  page.value = 1;
});
async function update(s: Subscriber, action: 'sync' | 'unsubscribe') {
  busy.value = true;
  try {
    await $fetch('/api/admin/newsletter', { method: 'PATCH', body: { id: s.id, action } });
    removing.value = null;
    await Promise.all([refresh(), refreshMail()]);
    toast.add({
      title:
        action === 'sync'
          ? 'Contact sync attempted. Check the delivery log.'
          : 'Subscription cancelled',
      color: 'success',
    });
  } catch (e) {
    toast.add({ title: errorText(e), color: 'error' });
  } finally {
    busy.value = false;
  }
}
async function retry(id: number) {
  busy.value = true;
  try {
    await $fetch('/api/admin/mail', { method: 'POST', body: { id } });
    await refreshMail();
  } catch (e) {
    toast.add({ title: errorText(e), color: 'error' });
  } finally {
    busy.value = false;
  }
}
const actions = (s: Subscriber) => [
  [{ label: 'Sync with Plunk', icon: 'i-lucide-refresh-cw', onSelect: () => update(s, 'sync') }],
  ...(s.status !== 'unsubscribed'
    ? [
        [
          {
            label: 'Unsubscribe',
            icon: 'i-lucide-mail-minus',
            color: 'error' as const,
            onSelect: () => {
              removing.value = s;
            },
          },
        ],
      ]
    : []),
];
</script>
<template>
  <div>
    <header class="admin-page-heading">
      <div>
        <h1>Newsletter</h1>
        <p>Manage readers, content languages and subscription confirmations.</p>
      </div>
      <UButton
        to="https://next-app.useplunk.com"
        target="_blank"
        color="neutral"
        variant="outline"
        icon="i-lucide-external-link"
        >Open Plunk</UButton
      >
    </header>
    <div class="newsletter-stats">
      <div>
        <strong>{{ subscribers.filter((s) => s.status === 'active').length }}</strong
        ><span>Confirmed readers</span>
      </div>
      <div>
        <strong>{{ subscribers.filter((s) => s.status === 'pending').length }}</strong
        ><span>Awaiting confirmation</span>
      </div>
      <div>
        <strong>{{ mail.filter((m) => m.status === 'failed').length }}</strong
        ><span>Failed deliveries</span>
      </div>
    </div>
    <UAlert v-if="error" title="Unable to load subscribers" color="error" class="mb-5" />
    <section class="admin-panel">
      <div class="blog-tabs" role="tablist" aria-label="Newsletter views">
        <button
          role="tab"
          :aria-selected="tab === 'subscribers'"
          :class="{ active: tab === 'subscribers' }"
          @click="tab = 'subscribers'"
        >
          Subscribers</button
        ><button
          role="tab"
          :aria-selected="tab === 'deliveries'"
          :class="{ active: tab === 'deliveries' }"
          @click="tab = 'deliveries'"
        >
          Delivery log
        </button>
      </div>
      <template v-if="tab === 'subscribers'"
        ><div class="blog-list-tools">
          <UInput
            v-model="search"
            icon="i-lucide-search"
            placeholder="Search readers…"
            aria-label="Search readers"
          /><USelect
            v-model="status"
            :items="[
              { value: 'all', label: 'All statuses' },
              { value: 'active', label: 'Confirmed' },
              { value: 'pending', label: 'Pending' },
              { value: 'unsubscribed', label: 'Unsubscribed' },
            ]"
            aria-label="Subscription status"
          /><USelect
            v-model="locale"
            :items="[
              { value: 'all', label: 'All languages' },
              ...languages.map((l) => ({ value: l.code, label: l.name })),
            ]"
            aria-label="Reader language"
          />
        </div>
        <div class="blog-table-scroll">
          <table class="blog-table">
            <thead>
              <tr>
                <th>Reader</th>
                <th>Language</th>
                <th>Status</th>
                <th>Joined</th>
                <th><span class="sr-only">Actions</span></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="s in filtered.slice((page - 1) * 10, page * 10)" :key="s.id">
                <td>
                  <strong>{{ s.email }}</strong
                  ><small>{{
                    s.name || (s.plunk_contact_id ? 'Synced with Plunk' : 'Not synced yet')
                  }}</small>
                </td>
                <td>{{ languages.find((l) => l.code === s.locale)?.name || s.locale }}</td>
                <td>
                  <UBadge
                    :color="
                      s.status === 'active'
                        ? 'success'
                        : s.status === 'pending'
                          ? 'warning'
                          : 'neutral'
                    "
                    variant="soft"
                    >{{ s.status === 'active' ? 'Confirmed' : s.status }}</UBadge
                  >
                </td>
                <td>{{ date(s.created_at) }}</td>
                <td><AdminRowActions :label="'Actions for ' + s.email" :items="actions(s)" /></td>
              </tr>
              <tr v-if="!filtered.length">
                <td colspan="5" class="blog-table-empty">
                  Readers who subscribe on your website will appear here.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="blog-list-footer">
          <span>{{ filtered.length }} readers</span
          ><UPagination
            v-if="filtered.length > 10"
            v-model:page="page"
            :total="filtered.length"
            :items-per-page="10"
          />
        </div>
        <p class="blog-list-note">
          Only readers who confirm their email are subscribed in Plunk. Create campaigns in Plunk
          and filter by the reader’s locale.
        </p></template
      ><template v-else
        ><div class="blog-table-scroll">
          <table class="blog-table">
            <thead>
              <tr>
                <th>Email</th>
                <th>Status</th>
                <th>Attempts</th>
                <th>Created</th>
                <th><span class="sr-only">Actions</span></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="m in mail.slice((page - 1) * 10, page * 10)" :key="m.id">
                <td>
                  <strong>{{ m.subject }}</strong
                  ><small>{{ m.recipient }}</small>
                  <p v-if="m.error" class="mail-error">{{ m.error }}</p>
                </td>
                <td>
                  <UBadge
                    :color="
                      m.status === 'sent' ? 'success' : m.status === 'failed' ? 'error' : 'neutral'
                    "
                    variant="soft"
                    >{{ m.status }}</UBadge
                  >
                </td>
                <td>{{ m.attempts }}</td>
                <td>{{ date(m.created_at) }}</td>
                <td>
                  <AdminRowActions
                    :label="'Actions for delivery ' + m.id"
                    :items="[
                      {
                        label: 'Retry delivery',
                        icon: 'i-lucide-refresh-cw',
                        disabled: busy || !['pending', 'failed'].includes(m.status),
                        onSelect: () => retry(m.id),
                      },
                    ]"
                  />
                </td>
              </tr>
              <tr v-if="!mail.length">
                <td colspan="5" class="blog-table-empty">
                  Confirmation emails, enquiries and contact syncs will be logged here.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="blog-list-footer">
          <span>{{ mail.length }} deliveries</span
          ><UPagination
            v-if="mail.length > 10"
            v-model:page="page"
            :total="mail.length"
            :items-per-page="10"
          /></div
      ></template>
    </section>
    <UModal
      :open="!!removing"
      title="Unsubscribe this reader?"
      description="They will stop receiving newsletter campaigns. They can subscribe again from the website."
      @update:open="!$event && (removing = null)"
      ><template #body
        ><p class="mb-4">{{ removing?.email }}</p>
        <UButton color="error" :loading="busy" @click="removing && update(removing, 'unsubscribe')"
          >Unsubscribe</UButton
        ></template
      ></UModal
    >
  </div>
</template>
