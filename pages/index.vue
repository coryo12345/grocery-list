<script setup lang="ts">
const { data, pending, error, refresh } = await useFetch("/api/groceries");
</script>

<template>
  <div>
    <h1 class="text-h4 font-weight-bold text-center">Grocery List</h1>
    <v-alert v-if="error" type="error" class="mt-2">
      <h6 class="text-h6">Something went wrong...</h6>
      <p>Unable to fetch current grocery list</p>
    </v-alert>
    <v-progress-circular v-else-if="pending" indeterminate size="64" />
    <template v-else>
      <span class="d-block mx-auto w-fit mb-2">
        <AddGrocery class="mr-1" />
        <ClearList class="ml-1" />
      </span>
      <v-list v-if="data?.length" class="my-2">
        <v-list-item v-for="(item, idx) in data" :key="idx">
          {{ item }}
        </v-list-item>
      </v-list>
    </template>
  </div>
</template>
