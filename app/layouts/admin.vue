<script setup lang="ts">
import { adminNavigation } from '~/utils/admin-navigation';
const route = useRoute();
const localePath = useLocalePath();
const switchLocalePath = useSwitchLocalePath();
const { locale } = useI18n();
const { user, text, canPublish, errorText } = useAdmin();
const open = ref(false);
const searchOpen = ref(false);
const search = ref('');
const toast = useToast();
const groups = computed(() => adminNavigation.map(group => ({ ...group, items: group.items.filter(item => !('adminOnly' in item) || canPublish.value) })));
const current = computed(() => groups.value.flatMap(g => g.items).filter(i => route.path === localePath(i.to) || (i.to !== '/admin' && route.path.startsWith(localePath(i.to) + '/'))).at(-1));
const commands = computed(() => groups.value.flatMap(g => g.items).filter(i => text(i.tr, i.en).toLocaleLowerCase().includes(search.value.toLocaleLowerCase())));
const active = (to: string) => to === '/admin' ? route.path === localePath(to) : route.path.startsWith(localePath(to));
watch(() => route.path, () => { open.value = false; searchOpen.value = false; });
useHead({ htmlAttrs: { lang: locale }, meta: [{ name: 'robots', content: 'noindex, nofollow' }] });
async function signOut() { try { const result = await authClient.signOut(); if (result.error) throw new Error(result.error.message); await navigateTo(localePath('/admin/login')); } catch (e) { toast.add({ title: errorText(e), color: 'error' }); } }
</script>
<template>
  <div class="admin-shell">
    <a class="admin-skip" href="#admin-main">{{ text('İçeriğe geç', 'Skip to content') }}</a>
    <button v-if="open" class="admin-backdrop" :aria-label="text('Menüyü kapat', 'Close menu')" @click="open = false" />
    <aside class="admin-sidebar" :class="{ 'is-open': open }">
      <NuxtLink :to="localePath('/admin')" class="admin-brand"><span class="admin-brand-mark"><UIcon name="i-lucide-scale" /></span><span><strong>Lexviora</strong><small>Legal &amp; Advisory</small></span></NuxtLink>
      <div class="workspace-label"><span class="workspace-dot" />{{ text('İçerik çalışma alanı', 'Content workspace') }}</div>
      <nav class="admin-navigation" :aria-label="text('Yönetim menüsü', 'Administration navigation')">
        <div v-for="group in groups" :key="group.en" class="admin-nav-group"><p>{{ text(group.tr, group.en) }}</p><NuxtLink v-for="item in group.items" :key="item.to" :to="localePath(item.to)" :class="{ active: active(item.to) }" :aria-current="active(item.to) ? 'page' : undefined"><UIcon :name="'i-lucide-' + item.icon" /><span>{{ text(item.tr, item.en) }}</span><UIcon v-if="active(item.to)" name="i-lucide-chevron-right" class="nav-chevron" /></NuxtLink></div>
      </nav>
      <div class="sidebar-bottom"><NuxtLink :to="localePath('/')" target="_blank" class="site-preview-link"><UIcon name="i-lucide-arrow-up-right" />{{ text('Web sitesini görüntüle', 'View website') }}</NuxtLink><div class="admin-user"><UAvatar :alt="user?.name || 'L'" size="sm" /><div><strong>{{ user?.name || 'Lexviora' }}</strong><small>{{ canPublish ? text('Yönetici', 'Administrator') : text('Editör', 'Editor') }}</small></div><UButton icon="i-lucide-log-out" color="neutral" variant="ghost" :aria-label="text('Çıkış yap', 'Sign out')" @click="signOut" /></div></div>
    </aside>
    <div class="admin-workspace"><header class="admin-topbar"><div class="flex min-w-0 items-center gap-3"><UButton class="mobile-menu" icon="i-lucide-menu" color="neutral" variant="ghost" :aria-label="text('Menüyü aç', 'Open menu')" :aria-expanded="open" @click="open = !open" /><span class="topbar-home">{{ text('Çalışma alanı', 'Workspace') }}</span><UIcon name="i-lucide-chevron-right" class="size-3.5 text-slate-400" /><span class="truncate">{{ current ? text(current.tr, current.en) : text('İçerik editörü', 'Content editor') }}</span></div><div class="flex items-center gap-2"><UButton icon="i-lucide-search" variant="ghost" color="neutral" :aria-label="text('Menüde ara', 'Search navigation')" @click="searchOpen = true" /><UButton :to="switchLocalePath(locale === 'tr' ? 'en' : 'tr')" variant="ghost" color="neutral" class="uppercase">{{ locale === 'tr' ? 'EN' : 'TR' }}</UButton><span class="topbar-divider" /><UAvatar :alt="user?.name || 'L'" size="sm" /></div></header><main id="admin-main" class="admin-main" tabindex="-1"><slot /></main><footer class="admin-footer"><span>Lexviora · {{ text('Özenle yönetilen içerik.', 'Considered content, carefully managed.') }}</span><span>Legal &amp; Advisory</span></footer></div>
    <UModal v-model:open="searchOpen" :title="text('Çalışma alanında ara', 'Search workspace')" :description="text('Gitmek istediğiniz bölümü seçin.', 'Choose a section to navigate to.')"><template #body><UInput v-model="search" icon="i-lucide-search" :placeholder="text('Bölüm adı…', 'Section name…')" class="mb-4 w-full" autofocus /><nav class="flex flex-col gap-1"><UButton v-for="item in commands" :key="item.to" :to="localePath(item.to)" :icon="'i-lucide-' + item.icon" color="neutral" variant="ghost">{{ text(item.tr, item.en) }}</UButton><p v-if="!commands.length" class="p-4 text-sm text-slate-500">{{ text('Sonuç bulunamadı.', 'No matching sections.') }}</p></nav></template></UModal>
  </div>
</template>
