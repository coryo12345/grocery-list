<script setup lang="ts">
const { data: categories, pending, error } = useFetch("/api/categories");

const dialogValue = ref(false);

const item = reactive({
  name: null,
  description: "",
  categories: [],
});

async function addItem() {
  // TODO add grocery
  dialogValue.value = false;
}
</script>

<template>
  <v-dialog v-model="dialogValue" max-width="600">
    <template #activator>
      <v-btn v-bind="$attrs" color="success" @click="dialogValue = true">
        Add Grocery
      </v-btn>
    </template>
    <v-card>
      <v-card-title>Add Grocery</v-card-title>
      <v-card-subtitle class="text-wrap">
        Add a new grocery, or select a pre-existing item
      </v-card-subtitle>
      <v-card-text>
        <v-combobox
          v-model="item.name"
          variant="outlined"
          label="Item Name"
          :items="[]"
          auto-select-first="exact"
        />
        <v-text-field
          v-model="item.description"
          variant="outlined"
          label="Description"
        />
        <v-autocomplete
          v-model="item.categories"
          variant="outlined"
          label="Categories"
          :items="categories ?? []"
          item-title="name"
          item-value="id"
          :disabled="pending || !!error"
          :loading="pending"
          multiple
        />
      </v-card-text>
      <v-card-actions>
        <v-btn color="error" @click="dialogValue = false">Cancel</v-btn>
        <v-btn color="success" @click="addItem">Confirm</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
