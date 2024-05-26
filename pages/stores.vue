<script setup lang="ts">
import type { presets } from "~/db/schema";

const { data: categories, error: categoriesError } =
  useFetch("/api/categories");
const { data: stores, error: storesError, refresh } = useFetch("/api/stores");

const usedNames = computed(() => stores.value?.map((s) => s.name) ?? []);

const selectedStore = ref<typeof presets.$inferSelect | null>(null);

async function storeAdded(id: number) {
  await refresh();
  const store = stores.value?.find((s) => s.id === id);
  if (store) {
    selectedStore.value = store;
  }
}
</script>

<template>
  <h1 class="text-h4 font-weight-bold text-center mb-2">
    Manage Store Presets
  </h1>
  <div class="d-flex justify-center mt-2 mb-4">
    <AddStore :used-names="usedNames" @store-added="storeAdded" />
  </div>
  <v-select
    v-model="selectedStore"
    label="Select a store"
    variant="outlined"
    :items="stores ?? []"
    item-title="name"
    return-object
  />
  <p v-if="!selectedStore" class="text-center">
    Select a store or create one to get started
  </p>
  <div v-else>
    <v-divider />
    <StoreEdit
      :categories="categories ?? []"
      :used-names="usedNames"
      :store="selectedStore"
    />
  </div>
</template>
