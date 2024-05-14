<script setup lang="ts">
const { data, pending, error, refresh } = await useFetch("/api/categories");

const inUseNames = computed(() => {
  const d = data.value ?? [];
  return d.map((item) => item.name);
});
</script>

<template>
  <h1 class="text-h4 font-weight-bold text-center mb-2">Manage Categories</h1>
  <v-progress-circular v-if="pending" />
  <v-alert v-else-if="error" type="error">
    Unable to load categories at this time.
  </v-alert>
  <template v-else>
    <div class="d-flex justify-center mb-2">
      <AddCategory :used-names="inUseNames" @category-changed="refresh" />
    </div>
    <v-list>
      <v-list-item v-for="category in data" :key="category.name" class="my-2">
        <EditableCategory
          :used-names="inUseNames"
          :category="category"
          @category-changed="refresh"
        />
      </v-list-item>
    </v-list>
  </template>
</template>
