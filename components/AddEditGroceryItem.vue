<script setup lang="ts">
import { allGroceries, categories } from "~/db/schema";

const props = defineProps<{
  usedNames: string[];
  categories: (typeof categories.$inferSelect)[];
  item?: typeof allGroceries.$inferSelect;
}>();

const emit = defineEmits<{
  (e: "item-added"): void;
}>();

const dialog = ref(false);
const valid = ref(false);
const loading = ref(false);
const error = ref<string | null>(null);

const mutableItem = reactive({
  name: props.item?.name ?? "",
  description: props.item?.description ?? "",
  categories: props.item?.categories ?? [],
});

watch(
  () => [dialog.value, props.item],
  (newVal) => {
    if (newVal[0] === true) {
      mutableItem.name = props.item?.name ?? "";
      mutableItem.description = props.item?.description ?? "";
      mutableItem.categories = props.item?.categories ?? [];
    }
  },
);

const nameNotInUse = (val: string) =>
  !props.usedNames.includes(val) ||
  props.item?.name === val ||
  "This name is already in use";

function submit() {
  if (props.item) {
    editItem();
  } else {
    addItem();
  }
}

async function addItem() {
  loading.value = true;
  error.value = null;
  try {
    const resp = await $fetch("/api/groceryItem", {
      method: "POST",
      body: JSON.stringify({
        name: mutableItem.name,
        description: mutableItem.description,
        categories: mutableItem.categories,
      }),
    });
    emit("item-added");
    dialog.value = false;
  } catch (err) {
    error.value = "Unable to add this item";
  } finally {
    loading.value = false;
  }
}

async function editItem() {
  loading.value = true;
  error.value = null;
  try {
    await $fetch("/api/groceryItem", {
      method: "PUT",
      body: JSON.stringify({
        id: props.item?.id,
        name: mutableItem.name,
        description: mutableItem.description,
        categories: mutableItem.categories,
      }),
    });
    emit("item-added");
    dialog.value = false;
  } catch (err) {
    error.value = "Unable to save your changes";
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <v-dialog v-model="dialog" max-width="600" persistent>
    <template #activator>
      <v-btn
        v-if="!props.item"
        v-bind="$attrs"
        color="success"
        @click="dialog = true"
      >
        Add Item
      </v-btn>
      <v-btn
        v-else
        @click="dialog = true"
        icon="mdi-pencil"
        variant="text"
      ></v-btn>
    </template>
    <v-form v-model="valid" @submit.prevent="submit">
      <v-card>
        <v-card-title>{{ props.item ? "Edit Item" : "Add Item" }}</v-card-title>
        <v-card-subtitle v-if="!props.item">
          Add an item to be reused in future lists
        </v-card-subtitle>
        <v-card-text>
          <v-alert v-if="error" type="error">{{ error }}</v-alert>
          <v-text-field
            v-model="mutableItem.name"
            label="Name"
            variant="outlined"
            :rules="[nameNotInUse, formRules.required]"
            class="mb-2"
          />
          <v-text-field
            v-model="mutableItem.description"
            label="Description"
            variant="outlined"
            :rules="[formRules.required]"
            class="mb-2"
          />
          <v-select
            v-model="mutableItem.categories"
            :items="props.categories"
            item-title="name"
            item-value="id"
            label="Categories"
            variant="outlined"
            multiple
          />
        </v-card-text>
        <v-card-actions>
          <v-btn color="error" :disabled="loading" @click="dialog = false">
            Cancel
          </v-btn>
          <v-btn
            color="success"
            type="submit"
            :loading="loading"
            :disabled="!valid || loading"
          >
            Save
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-form>
  </v-dialog>
</template>
