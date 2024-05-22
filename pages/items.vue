<script setup lang="ts">
const { data, pending, error, refresh } = await useFetch("/api/groceryItem");
const {
  data: categories,
  pending: categoriesPending,
  error: categoriesError,
  refresh: categoriesRefresh,
} = await useFetch("/api/categories");

const page = ref(1);
const search = ref("");
const categoryFilter = ref<number[]>([]);

const filteredRows = computed(() => {
  return data.value?.filter((item) => {
    const inCategories =
      categoryFilter.value.length === 0 ||
      item.categories.some((c) => categoryFilter.value.includes(c));
    const matchesSearch =
      item.name.toLowerCase().includes(search.value.toLowerCase()) ||
      item.description?.toLowerCase().includes(search.value.toLowerCase());
    return inCategories && matchesSearch;
  });
});

const usedNames = computed(() => data.value?.map((item) => item.name) ?? []);
</script>

<template>
  <h1 class="text-h4 font-weight-bold text-center">Manage Grocery Items</h1>
  <div class="d-flex justify-center">
    <AddEditGroceryItem
      :categories="categories ?? []"
      :used-names="usedNames"
      @item-added="refresh"
    />
  </div>

  <v-text-field
    v-model="search"
    variant="outlined"
    label="Search"
    hide-details
    class="my-3"
  />
  <v-select
    v-model="categoryFilter"
    :items="categories ?? []"
    item-title="name"
    item-value="id"
    variant="outlined"
    label="Categories"
    hide-details
    multiple
    class="my-3"
  />

  <v-list>
    <v-data-iterator :items="filteredRows" :page="page">
      <template #default="{ items }">
        <ManageGroceryItem
          v-for="item in items"
          :key="item.raw.id"
          :item="item.raw"
          :categories="categories ?? []"
          :used-names="usedNames"
          @item-changed="refresh"
        />
      </template>
      <template #footer="{ pageCount }">
        <v-pagination v-model="page" :length="pageCount" rounded="circle" />
      </template>
    </v-data-iterator>
  </v-list>
</template>
