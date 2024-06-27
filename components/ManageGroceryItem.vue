<script setup lang="ts">
import { allGroceries, categories } from "~/db/schema";

const props = defineProps<{
  usedNames: string[];
  categories: (typeof categories.$inferSelect)[];
  item: typeof allGroceries.$inferSelect;
}>();
const emit = defineEmits<{
  (e: "item-changed"): void;
}>();

const toast = useToast();

const loading = ref(false);
async function deleteItem() {
  loading.value = true;
  try {
    const resp = await $fetch("/api/groceryItem", {
      method: "DELETE",
      body: JSON.stringify({
        id: props.item.id,
      }),
    });
    emit("item-changed");
  } catch (err) {
    toast.error("Failed to delete this item.");
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <v-list-item class="position-relative">
    <v-list-item-title>{{ props.item.name }}</v-list-item-title>
    <v-list-item-subtitle>
      {{ props.item.description }}
    </v-list-item-subtitle>
    <div class="position-absolute right-0 top-0 h-100 d-flex align-center">
      <AddEditGroceryItem
        :categories="props.categories"
        :used-names="props.usedNames"
        :item="props.item"
        @item-added="emit('item-changed')"
      />
      <ConfirmDialog
        text="Deleting this item will also delete all occurances of this item from your current grocery list"
        @save="deleteItem"
      >
        <template #activator="{ on }">
          <v-btn
            v-on="on"
            icon="mdi-close"
            variant="text"
            :disabled="loading"
            :loading="loading"
          />
        </template>
      </ConfirmDialog>
    </div>
  </v-list-item>
</template>
