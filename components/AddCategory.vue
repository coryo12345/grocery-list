<script setup lang="ts">
const props = defineProps<{
  usedNames: string[];
}>();

const emit = defineEmits<{
  (e: "category-changed"): void;
}>();

const dialog = ref(false);
const loading = ref(false);
const valid = ref(false);
const error = ref(false);

const name = ref("");

watch(
  () => dialog.value,
  (newVal) => {
    if (newVal) {
      name.value = "";
    }
  },
);

const nameAvailable = (val: string) =>
  !props.usedNames.some((name) => name.toLowerCase() === val.toLowerCase()) ||
  "Name already in use";

const required = (val: string) => !!val.length || "Field is required";

async function addCategory() {
  loading.value = true;
  error.value = false;
  try {
    await $fetch("/api/categories", {
      method: "PUT",
      body: JSON.stringify({
        name: name.value,
      }),
    });
    emit("category-changed");
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
        Add Category
      </v-btn>
    </template>
    <v-form v-model="valid" @submit.prevent="addCategory">
      <v-card>
        <v-card-title>Add Category</v-card-title>
        <v-card-text>
          <v-text-field
            v-model="name"
            label="Category Name"
            variant="outlined"
            :rules="[required, nameAvailable]"
          />
          <v-alert v-if="error" type="error">
            Unable to save new group. Try again later.
          </v-alert>
        </v-card-text>
        <v-card-actions>
          <v-btn color="error" @click="dialog = false">Cancel</v-btn>
          <v-btn
            color="success"
            :loading="loading"
            :disabled="loading || !valid"
            type="submit"
            @click="addCategory"
          >
            Submit
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-form>
  </v-dialog>
</template>
