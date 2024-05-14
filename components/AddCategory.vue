<script setup lang="ts">
const props = defineProps<{
  usedNames: string[];
}>();

const dialog = ref(false);
const loading = ref(false);
const valid = ref(false);

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
  // TODO
  //   validate that name is not in use
  dialog.value = false;
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
