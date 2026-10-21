<script setup lang="ts">
defineProps<{ error: { statusCode: number; statusMessage?: string } }>();
</script>
<template><UApp><div class="grid min-h-screen place-items-center bg-ivory p-8 text-center text-navy"><div><p class="mb-4 text-sm text-gold-700">Lexviora Legal &amp; Advisory</p><h1 class="font-serif text-8xl">{{ error.statusCode }}</h1><p class="my-6">{{ error.statusCode === 404 ? 'Aradığınız sayfa bulunamadı. / Page not found.' : 'Sayfa yüklenemedi. Lütfen tekrar deneyin.' }}</p><UButton @click="clearError({ redirect: '/' })">Ana sayfa / Home</UButton></div></div></UApp></template>
