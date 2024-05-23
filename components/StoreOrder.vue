<script setup lang="ts">
import { useDraggable } from "vue-draggable-plus";
import type { categories, presets } from "~/db/schema";

const props = defineProps<{
  categories: (typeof categories.$inferSelect)[];
  store: typeof presets.$inferSelect;
}>();

const listEl = ref<HTMLElement | null>(null);
const list = ref<any[]>([]);

const draggable = useDraggable(listEl, list, {
  animation: 150,
  handle: ".category-handle",
});
</script>

<template>
  {{ props.store }}
  <v-list ref="listEl">
    <v-list-item v-for="category in list" :key="category.id">
      <v-icon icon="mdi-dots-vertical" class="category-handle cursor-pointer" />
      {{ category.name }}
    </v-list-item>
  </v-list>
</template>
