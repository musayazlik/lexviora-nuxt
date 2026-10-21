<script setup lang="ts">
import type { DropdownMenuItem } from '@nuxt/ui';

const props = defineProps<{
  label: string;
  items: DropdownMenuItem[] | DropdownMenuItem[][];
}>();

const groups = computed(() => {
  const items = Array.isArray(props.items[0])
    ? (props.items as DropdownMenuItem[][])
    : [props.items as DropdownMenuItem[]];
  return items
    .filter((group) => group.length)
    .map((group) =>
      group.map((item) => ({
        ...item,
        class: [item.class, { 'is-destructive': item.color === 'error' }],
      })),
    );
});
</script>

<template>
  <UDropdownMenu
    v-slot="{ open }"
    :items="groups"
    :content="{ align: 'end', sideOffset: 6, collisionPadding: 12, loop: true }"
    :ui="{
      content: 'admin-row-action-menu',
      viewport: 'admin-row-action-viewport',
      group: 'admin-row-action-group',
      item: 'admin-row-action-item',
      itemLeadingIcon: 'admin-row-action-icon',
      itemLabel: 'admin-row-action-label',
      separator: 'admin-row-action-separator',
    }"
  >
    <UButton
      type="button"
      icon="i-lucide-ellipsis"
      variant="ghost"
      color="neutral"
      class="admin-row-action-trigger"
      :class="{ 'is-open': open }"
      :aria-label="label"
    />
  </UDropdownMenu>
</template>
