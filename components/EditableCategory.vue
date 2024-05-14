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
  // TODO
  editing.value = false;
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
      >
        <template #append-inner>
          <v-btn
            icon="mdi-content-save"
            variant="text"
            type="submit"
            :disabled="!valid"
          ></v-btn>
        </template>
        <template #append>
          <v-btn
            icon="mdi-cancel"
            variant="text"
            class="ml-n2"
            @click="editing = false"
          ></v-btn>
        </template>
      </v-text-field>
    </v-form>
  </template>
</template>
