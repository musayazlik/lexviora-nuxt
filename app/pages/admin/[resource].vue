<script setup lang="ts">
import { contentDefinitions } from '~/utils/content-fields';
import type { Resource } from '#shared/types/content';
definePageMeta({ middleware: 'auth', layout: 'admin' });
const route = useRoute();
const resource = computed(() => String(route.params.resource) as Resource);
if (!Object.hasOwn(contentDefinitions, resource.value)) throw createError({ statusCode: 404 });
const { text } = useAdmin();
useSeoMeta({ title: () => text(contentDefinitions[resource.value].tr, contentDefinitions[resource.value].en) + ' | Lexviora' });
</script>
<template><AdminCollection :key="resource" :resource="resource" /></template>
