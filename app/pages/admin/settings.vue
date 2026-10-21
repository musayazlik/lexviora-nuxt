<script setup lang="ts">
definePageMeta({ middleware: 'auth', layout: 'admin' });
const { text, user, errorText } = useAdmin();
const name = ref(user.value?.name || '');
watch(
  () => user.value?.name,
  (value) => {
    if (value) name.value = value;
  },
);
const passwords = reactive({ currentPassword: '', newPassword: '' });
const saving = ref(false);
const changing = ref(false);
const toast = useToast();
useSeoMeta({ title: () => text('Hesap ayarları | Lexviora', 'Account settings | Lexviora') });
async function profile() {
  saving.value = true;
  try {
    const result = await authClient.updateUser({ name: name.value });
    if (result.error) throw new Error(result.error.message);
    toast.add({ title: text('Profil güncellendi.', 'Profile updated.'), color: 'success' });
  } catch (e) {
    toast.add({ title: errorText(e), color: 'error' });
  } finally {
    saving.value = false;
  }
}
async function password() {
  changing.value = true;
  try {
    const result = await authClient.changePassword({ ...passwords, revokeOtherSessions: true });
    if (result.error) throw new Error(result.error.message);
    Object.assign(passwords, { currentPassword: '', newPassword: '' });
    toast.add({
      title: text(
        'Şifre güncellendi. Diğer oturumlar kapatıldı.',
        'Password updated. Other sessions have been revoked.',
      ),
      color: 'success',
    });
  } catch (e) {
    toast.add({ title: errorText(e), color: 'error' });
  } finally {
    changing.value = false;
  }
}
</script>
<template>
  <div>
    <header class="admin-page-heading">
      <div>
        <p class="admin-eyebrow">
          {{ text('Kişisel çalışma alanınız', 'Your personal workspace') }}
        </p>
        <h1>{{ text('Hesap ayarları', 'Account settings') }}</h1>
        <p>{{ text('Profiliniz ve hesap güvenliğiniz.', 'Your profile and account security.') }}</p>
      </div>
    </header>
    <div class="settings-grid">
      <section class="admin-panel">
        <header class="panel-heading">
          <h2>{{ text('Profil bilgileri', 'Profile details') }}</h2>
          <UIcon name="i-lucide-user-round" />
        </header>
        <form class="settings-form" @submit.prevent="profile">
          <UAvatar :alt="user?.name || 'L'" size="xl" /><UFormField
            :label="text('Ad soyad', 'Full name')"
            required
            ><UInput
              v-model="name"
              required
              :minlength="2"
              :maxlength="100"
              autocomplete="name"
              class="w-full" /></UFormField
          ><UFormField :label="text('E-posta', 'Email address')"
            ><UInput :model-value="user?.email" readonly class="w-full" /></UFormField
          ><UButton type="submit" :loading="saving">{{
            text('Profili kaydet', 'Save profile')
          }}</UButton>
        </form>
      </section>
      <section class="admin-panel">
        <header class="panel-heading">
          <h2>{{ text('Şifre değiştir', 'Change password') }}</h2>
          <UIcon name="i-lucide-lock-keyhole" />
        </header>
        <form class="settings-form" @submit.prevent="password">
          <p class="text-sm text-slate-500">
            {{
              text(
                'Şifreniz değiştiğinde diğer cihazlardaki oturumlarınız kapatılır.',
                'Changing your password signs you out on other devices.',
              )
            }}
          </p>
          <UFormField :label="text('Mevcut şifre', 'Current password')" required
            ><UInput
              v-model="passwords.currentPassword"
              type="password"
              required
              autocomplete="current-password"
              class="w-full" /></UFormField
          ><UFormField
            :label="text('Yeni şifre', 'New password')"
            :hint="text('En az 12 karakter', 'At least 12 characters')"
            required
            ><UInput
              v-model="passwords.newPassword"
              type="password"
              required
              :minlength="12"
              :maxlength="128"
              autocomplete="new-password"
              class="w-full" /></UFormField
          ><UButton type="submit" :loading="changing">{{
            text('Şifreyi güncelle', 'Update password')
          }}</UButton>
        </form>
      </section>
    </div>
  </div>
</template>
