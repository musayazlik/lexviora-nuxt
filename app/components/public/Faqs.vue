<script setup lang="ts">
const { data: items } = await usePublicContent('faqs');
const copy = usePublicCopy();
</script>
<template>
  <div class="faq-list">
    <details v-for="(item, index) in items" :key="item.id" :open="index === 0">
      <summary>
        {{ item.question }}<span><UIcon name="i-lucide-plus" class="icon" /></span>
      </summary>
      <div class="faq-answer" v-html="item.answer" />
    </details>
  </div>
  <p v-if="!items.length" role="status" class="empty-state">{{ copy.empty }}</p>
</template>
