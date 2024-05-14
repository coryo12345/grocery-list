<script setup lang="ts">
import type { allGroceries, groceryList } from "~/db/schema";

type GroceryItem = {
  grocery_list: typeof groceryList.$inferSelect;
  all_groceries: typeof allGroceries.$inferSelect;
};

const props = defineProps<{
  item: GroceryItem;
}>();

const emit = defineEmits<{
  (e: "item-deleted"): void;
}>();

const toggleError = ref(false);

async function toggleItem() {
  (props.item as any).loading = true;
  toggleError.value = false;
  try {
    const resp = await $fetch("/api/groceries", {
      method: "PUT",
      body: JSON.stringify({
        id: props.item.grocery_list.id,
        checked: !props.item.grocery_list.checked,
      }),
    });
    props.item.grocery_list.checked = !props.item.grocery_list.checked;
  } catch (err) {
    toggleError.value = true;
  } finally {
    (props.item as any).loading = false;
  }
}

async function deleteItem() {
  (props.item as any).loading = true;
  toggleError.value = false;
  try {
    const resp = await $fetch("/api/groceries", {
      method: "DELETE",
      body: JSON.stringify({
        id: props.item.grocery_list.id,
      }),
    });
    emit("item-deleted");
  } catch (err) {
    toggleError.value = true;
  } finally {
    (props.item as any).loading = false;
  }
}
</script>

<template>
  <div class="w-100 d-flex align-center">
    <v-btn
      icon="mdi-close"
      variant="text"
      size="small"
      color="secondary"
      @click="deleteItem"
    ></v-btn>
    <div>
      <span class="d-block">{{ item.all_groceries.name }}</span>
      <span class="d-block text-caption text-wrap">
        {{ item.all_groceries.description }}
      </span>
    </div>
    <v-spacer />
    <span>
      <v-progress-circular
        v-if="(item as any).loading"
        :size="32"
        indeterminate
        class="my-3 mr-1"
      />
      <v-checkbox
        v-else
        :model-value="item.grocery_list.checked"
        color="primary"
        hide-details
        readonly
        @click="toggleItem"
      />
    </span>
  </div>
  <v-snackbar v-model="toggleError" color="error" multi-line :timeout="8000">
    <p class="text-h6">Something went wrong.</p>
    <p>Unable to update this item.</p>
  </v-snackbar>
</template>
