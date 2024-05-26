<script setup lang="ts">
import GroceryListItem from "~/components/GroceryListItem.vue";

const { data, pending, error, refresh } = await useFetch("/api/groceries");
const { data: stores, error: storesError } = await useFetch("/api/stores");

const selectedStore = ref({ id: -1, name: "None", categories: [] as number[] });

const allStores = computed(() => [
  ...(stores.value ?? []),
  { id: -1, name: "None" },
]);

const sortedGroceries = computed(() => {
  const items = [...(data.value ?? [])];
  if (selectedStore.value.id === -1) {
    return items;
  }

  items.sort((a, b) => {
    let aIdx = Number.MAX_SAFE_INTEGER;
    a.all_groceries.categories?.forEach((c) => {
      const i = selectedStore.value.categories.findIndex((sci) => sci == c);
      if (i !== -1 && i < aIdx) aIdx = i;
    });
    if (aIdx === Number.MAX_SAFE_INTEGER) {
      aIdx = 0;
    }

    let bIdx = Number.MAX_SAFE_INTEGER;
    b.all_groceries.categories?.forEach((c) => {
      const i = selectedStore.value.categories.findIndex((sci) => sci == c);
      if (i !== -1 && i < bIdx) bIdx = i;
    });
    if (bIdx === Number.MAX_SAFE_INTEGER) {
      bIdx = 0;
    }
    return aIdx - bIdx;
  });
  return items;
});
</script>

<template>
  <div>
    <h1 class="text-h4 font-weight-bold text-center mb-2">Grocery List</h1>
    <v-alert v-if="error" type="error" class="mt-2">
      <h6 class="text-h6">Something went wrong...</h6>
      <p>Unable to fetch current grocery list</p>
    </v-alert>
    <v-progress-circular v-else-if="pending" indeterminate size="64" />
    <template v-else>
      <span class="d-block mx-auto w-fit mb-2">
        <AddGrocery class="mr-1" @item-added="refresh" />
        <ClearList class="ml-1" @items-cleared="refresh" />
      </span>
      <p>TODO: implement this list</p>
      <v-select
        v-model="selectedStore"
        :items="allStores"
        item-title="name"
        return-object
        variant="outlined"
        label="Choose Store (for sorting)"
        class="mt-6"
        hide-details
      />
      <v-list v-if="sortedGroceries.length" class="my-2">
        <v-list-item
          v-for="(item, idx) in sortedGroceries"
          :key="item.grocery_list.id"
          class="pl-0"
        >
          <GroceryListItem :item="item" @item-deleted="refresh" />
        </v-list-item>
      </v-list>
      <p v-else class="text-h6 text-center mt-12">
        Add some items to your cart to get started!
      </p>
    </template>
  </div>
</template>
