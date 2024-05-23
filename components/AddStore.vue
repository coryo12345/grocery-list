<script setup lang="ts">
const props = defineProps<{
  usedNames: string[];
}>();

const emit = defineEmits<{
  (e: "store-added", id: number): void;
}>();

const valid = ref(false);
const dialog = ref(false);
const loading = ref(false);
const error = ref(false);

const nameAvailable = (val: string) =>
  !props.usedNames.find((n) => n.toLowerCase().includes(val.toLowerCase())) ||
  "This name is not available";

const item = reactive({
  name: "",
});

async function addStore() {
  loading.value = true;
  error.value = false;
  try {
    const resp = await $fetch("/api/stores", {
      method: "POST",
      body: JSON.stringify({
        name: item.name,
      }),
    });
    emit("store-added", resp.id);
    dialog.value = false;
  } catch (err) {
    error.value = true;
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <v-dialog v-model="dialog" max-width="600" persistent>
    <template #activator="{ props: activatorProps }">
      <v-btn v-bind="activatorProps" color="success">Add Store</v-btn>
    </template>
    <v-form v-model="valid" @submit.prevent="addStore">
      <v-card>
        <v-card-title>Add Store</v-card-title>
        <v-card-text>
          <v-text-field
            v-model="item.name"
            label="Name"
            variant="outlined"
            :rules="[formRules.required, nameAvailable]"
            class="mb-2"
          />
          <v-alert v-if="error" type="error">
            Unable to add this store. Try again later.
          </v-alert>
        </v-card-text>
        <v-card-actions>
          <v-btn color="error" :disabled="loading" @click="dialog = false">
            Cancel
          </v-btn>
          <v-btn color="success" type="submit" :disabled="!valid || loading">
            Save
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-form>
  </v-dialog>
</template>
