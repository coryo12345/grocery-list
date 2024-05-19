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

const toast = useToast();

async function toggleItem() {
  (props.item as any).loading = true;
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
    toast.error("Something went wrong... unable to update this item");
  } finally {
    (props.item as any).loading = false;
  }
}

async function deleteItem() {
  (props.item as any).loading = true;
  try {
    const resp = await $fetch("/api/groceries", {
      method: "DELETE",
      body: JSON.stringify({
        id: props.item.grocery_list.id,
      }),
    });
    emit("item-deleted");
  } catch (err) {
    toast.error("Something went wrong... unable to delete this item");
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
      <v-list-item-title>{{ item.all_groceries.name }}</v-list-item-title>
      <v-list-item-subtitle>
        {{ item.all_groceries.description }}
      </v-list-item-subtitle>
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
</template>
