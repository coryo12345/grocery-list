<script setup lang="ts">
import { categories } from "~/db/schema";

const props = defineProps<{
  usedNames: string[];
  categories: (typeof categories.$inferSelect)[];
}>();

const emit = defineEmits<{
  (e: "item-added"): void;
}>();

const dialog = ref(false);
const valid = ref(false);
const loading = ref(false);
const error = ref(false);

watch(
  () => dialog.value,
  (newVal) => {
    if (newVal) {
      item.name = "";
      item.description = "";
      item.categories = [];
    }
  },
);

const item = reactive({
  name: "",
  description: "",
  categories: [],
});

const nameNotInUse = (val: string) =>
  !props.usedNames.includes(val) || "This name is already in use";
const required = (val: string) => val.length > 0 || "This field is required";

async function addItem() {
  loading.value = true;
  error.value = false;
  try {
    const resp = await $fetch("/api/groceryItem", {
      method: "POST",
      body: JSON.stringify({
        name: item.name,
        description: item.description,
        categories: item.categories,
      }),
    });
    emit("item-added");
    dialog.value = false;
  } catch (err) {
    error.value = true;
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <v-dialog v-model="dialog">
    <template #activator>
      <v-btn v-bind="$attrs" color="success" @click="dialog = true">
        Add Item
      </v-btn>
    </template>
    <v-form v-model="valid" @submit.prevent="addItem">
      <v-card>
        <v-card-title>Add Item</v-card-title>
        <v-card-subtitle>
          Add an item to be reused in future lists
        </v-card-subtitle>
        <v-card-text>
          <v-text-field
            v-model="item.name"
            label="Name"
            variant="outlined"
            :rules="[nameNotInUse, required]"
            class="mb-2"
          />
          <v-text-field
            v-model="item.description"
            label="Description"
            variant="outlined"
            :rules="[required]"
            class="mb-2"
          />
          <v-select
            v-model="item.categories"
            :items="props.categories"
            item-title="name"
            item-value="id"
            label="Categories"
            variant="outlined"
            multiple
          />
        </v-card-text>
        <v-card-actions>
          <v-btn
            color="error"
            variant="text"
            :disabled="loading"
            @click="dialog = false"
          >
            Cancel
          </v-btn>
          <v-btn
            color="success"
            variant="text"
            type="submit"
            :loading="loading"
            :disabled="!valid || loading"
            >Submit</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-form>
  </v-dialog>
</template>
