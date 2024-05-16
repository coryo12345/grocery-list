<script setup lang="ts">
const emit = defineEmits<{
  (e: "item-added"): void;
}>();

const {
  data: categories,
  pending: categoriesPending,
  error: categoriesError,
} = await useFetch("/api/categories");

const {
  data: allGroceries,
  pending: allGroceriesPending,
  error: allGroceriesError,
} = await useFetch("/api/groceryItem");

const _loading = ref(false);
const loading = computed(
  () => _loading.value || categoriesPending.value || allGroceriesPending.value,
);

const _error = ref(false);
const error = computed(
  () => _error.value || !!categoriesError.value || !!allGroceriesError.value,
);

const dialogValue = ref(false);

const selectedItem = ref(null);
const item = reactive({
  id: undefined,
  name: "",
  description: "",
  categories: [],
});

watch(
  () => selectedItem.value,
  (newVal: any) => {
    if (newVal === null) {
      return;
    } else if (typeof newVal === "string") {
      item.id = undefined;
      item.name = newVal;
      item.description = "";
      item.categories = [];
    } else if (typeof newVal === "object") {
      item.id = newVal.id;
      item.name = newVal.name;
      item.description = newVal.description;
      item.categories = newVal.categories;
    }
  },
);

watch(
  () => dialogValue.value,
  () => {
    item.name = "";
    item.description = "";
    item.categories = [];
    item.id = undefined;
    _error.value = false;
    _loading.value = false;
  },
);

async function addItem() {
  _loading.value = true;
  try {
    const resp = await $fetch("/api/groceries", {
      method: "POST",
      body: JSON.stringify({
        id: item.id,
        name: item.name,
        description: item.description,
        categories: item.categories,
      }),
    });

    dialogValue.value = false;
    emit("item-added");
  } catch (err) {
    _error.value = true;
  } finally {
    _loading.value = false;
  }
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
        <p>TODO: add count field</p>
        <v-combobox
          v-model="selectedItem"
          variant="outlined"
          label="Item Name"
          :items="allGroceries ?? []"
          item-title="name"
          :disabled="loading || (error && !_error)"
          auto-select-first="exact"
        />
        <v-text-field
          v-model="item.description"
          variant="outlined"
          label="Description"
          :disabled="loading || (error && !_error)"
        />
        <v-autocomplete
          v-model="item.categories"
          variant="outlined"
          label="Categories"
          :items="categories ?? []"
          item-title="name"
          item-value="id"
          :disabled="loading || (error && !_error)"
          multiple
        />
        <v-alert v-if="error && !_error" type="error">
          Something went wrong. Unable to add new items at this time.
        </v-alert>
        <v-alert v-if="error" type="error">
          Unable to add item to grocery list. Ensure you do not have any
          duplicated names
        </v-alert>
      </v-card-text>
      <v-card-actions>
        <v-btn color="error" :disabled="loading" @click="dialogValue = false">
          Cancel
        </v-btn>
        <v-btn
          color="success"
          :disabled="loading || (error && !_error)"
          @click="addItem"
        >
          Confirm
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
