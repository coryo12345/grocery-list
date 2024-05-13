<script setup lang="ts">
const emit = defineEmits<{
  (e: "items-cleared"): void;
}>();

const error = ref(false);
const loading = ref(false);
const dialogValue = ref(false);

const deleteAll = ref(false);

async function clear() {
  try {
    loading.value = true;
    await $fetch(`/api/groceries/clear?deleteAll=${deleteAll.value}`, {
      method: "POST",
    });
    emit("items-cleared");
    dialogValue.value = false;
  } catch (err) {
    error.value = true;
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <v-dialog v-model="dialogValue" max-width="500">
    <template #activator>
      <v-btn v-bind="$attrs" color="error" @click="dialogValue = true">
        Clear List
      </v-btn>
    </template>
    <v-card>
      <v-card-title>Clear List</v-card-title>
      <v-card-text>
        <p>Are you sure you want to clear your list?</p>
        <v-checkbox
          v-model="deleteAll"
          label="Delete unchecked items"
          color="primary"
          hide-details
        />
        <p v-if="!deleteAll">
          This will delete all checked items in your list.
        </p>
        <p v-else>
          This will delete <strong>all</strong> items in your list (including
          unchecked).
        </p>
        <v-alert v-if="error" type="error">
          <h6 class="text-h6">Hmm...</h6>
          <p>Something went wrong, unable to clear your cart.</p>
        </v-alert>
      </v-card-text>
      <v-card-actions>
        <v-btn color="error" @click="dialogValue = false">Cancel</v-btn>
        <v-btn
          color="success"
          :loading="loading"
          :disabled="loading"
          @click="clear"
          >Confirm</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
