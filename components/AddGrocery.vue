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

const fieldsDisabled = computed(
  () => loading.value || (error.value && !_error.value),
);

const dialogValue = ref(false);
const valid = ref(false);

const customNameRequired = () =>
  item.name.length > 0 || "This field is required";

const selectedItem = ref(null);
const item = reactive({
  id: undefined,
  name: "",
  description: "",
  categories: [],
  count: null,
  note: null,
});

watch(
  () => selectedItem.value,
  (newVal: any) => {
    if (newVal === null) {
      item.name = "";
    } else if (typeof newVal === "string") {
      item.id = undefined;
      item.name = newVal;
      item.description = "";
      item.categories = [];
      item.count = null;
      item.note = null;
    } else if (typeof newVal === "object") {
      item.id = newVal.id;
      item.name = newVal.name;
      item.description = newVal.description;
      item.categories = newVal.categories;
      item.count = null;
      item.note = null;
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
        count: item.count,
        note: item.note,
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
    <v-form v-model="valid" @submit.prevent="addItem">
      <v-card>
        <v-card-title>Add Grocery</v-card-title>
        <v-card-subtitle class="text-wrap">
          Add a new grocery, or select a pre-existing item
        </v-card-subtitle>
        <v-card-text>
          <v-combobox
            v-model="selectedItem"
            variant="outlined"
            label="Item Name"
            :items="allGroceries ?? []"
            item-title="name"
            :rules="[customNameRequired]"
            :disabled="fieldsDisabled"
            auto-select-first="exact"
          />
          <v-text-field
            v-model="item.description"
            variant="outlined"
            label="Description"
            :disabled="fieldsDisabled"
          />
          <v-autocomplete
            v-model="item.categories"
            variant="outlined"
            label="Categories"
            :items="categories ?? []"
            item-title="name"
            item-value="id"
            :disabled="fieldsDisabled"
            multiple
          />
          <v-text-field
            v-model="item.count"
            label="Count"
            type="number"
            variant="outlined"
            :rules="[formRules.integer]"
            :disabled="fieldsDisabled"
          />
          <v-text-field
            v-model="item.note"
            label="Note"
            variant="outlined"
            :disabled="fieldsDisabled"
          />
          <p class="font-italic text-body-2">
            A note is a temporary description that will not be saved for the
            next time you add this same item to your list.
          </p>
          <v-alert v-if="error && !_error" type="error">
            Something went wrong. Unable to add new items at this time.
          </v-alert>
          <v-alert v-else-if="error" type="error">
            Unable to add item to grocery list. Ensure you do not have any
            duplicated names
          </v-alert>
        </v-card-text>
        <v-card-actions>
          <v-btn color="error" :disabled="loading" @click="dialogValue = false">
            Cancel
          </v-btn>
          <v-btn color="success" :disabled="loading || !valid" type="submit">
            Confirm
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-form>
  </v-dialog>
</template>
