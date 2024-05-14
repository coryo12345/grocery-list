<script setup lang="ts">
import type { categories } from "~/db/schema";

const props = defineProps<{
  category: typeof categories.$inferSelect;
  usedNames: string[];
}>();

const emit = defineEmits<{
  (e: "category-changed"): void;
}>();

const editing = ref(false);
const valid = ref(false);
const name = ref(props.category.name);
const textField = ref(null);
const error = ref(false);
const loading = ref(false);

const nameAvailable = (val: string) =>
  !props.usedNames.some((name) => name.toLowerCase() === val.toLowerCase()) ||
  val.toLowerCase() === props.category.name.toLowerCase() ||
  "Name already in use";

const required = (val: string) => !!val.length || "Field is required";

function setEditing() {
  editing.value = true;
  nextTick(() => {
    (textField.value as any).focus();
  });
}

async function saveName() {
  try {
    error.value = false;
    loading.value = true;
    await $fetch("/api/categories", {
      method: "POST",
      body: JSON.stringify({
        id: props.category.id,
        name: name.value,
      }),
    });
    emit("category-changed");
    editing.value = false;
  } catch (err) {
    error.value = true;
  } finally {
    loading.value = false;
  }
}

async function deleteCategory() {
  error.value = false;
  loading.value = true;
  try {
    const resp = await $fetch("/api/categories", {
      method: "DELETE",
      body: JSON.stringify({
        id: props.category.id,
      }),
    });
    emit("category-changed");
    editing.value = false;
  } catch (err) {
    error.value = true;
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <p v-if="!editing" class="d-flex justify-space-between" @click="setEditing">
    {{ props.category.name }}
    <v-icon icon="mdi-pencil" />
  </p>
  <template v-else>
    <v-form v-model="valid" @submit.prevent="saveName">
      <v-text-field
        v-model="name"
        ref="textField"
        :rules="[required, nameAvailable]"
        @blur="editing = false"
      >
        <template #append-inner>
          <v-btn
            icon="mdi-content-save"
            variant="text"
            type="submit"
            :disabled="!valid"
            :loading="loading"
            @click="saveName"
            @keydown.enter="saveName"
          ></v-btn>
        </template>
        <template #append>
          <v-btn
            icon="mdi-delete"
            variant="text"
            class="ml-n2"
            @mousedown="deleteCategory"
          ></v-btn>
        </template>
      </v-text-field>
    </v-form>
  </template>
  <v-snackbar v-model="error" color="error" :timeout="8000">
    Unable to save changes
  </v-snackbar>
</template>
