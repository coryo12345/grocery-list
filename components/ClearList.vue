<script setup lang="ts">
const error = ref(false);
const loading = ref(false);
const dialogValue = ref(false);

async function clear() {
  try {
    loading.value = true;
    await $fetch("/api/groceries/clear", { method: "POST" });
    dialogValue.value = false;
  } catch (err) {
    error.value = true;
  }
}
</script>

<template>
  <v-dialog v-model="dialogValue" max-width="500">
    <template #activator>
      <v-btn v-bind="$attrs" color="error">Clear List</v-btn>
    </template>
    <v-card>
      <v-card-title>Clear List</v-card-title>
      <v-card-text>
        <p>Are you sure you want to clear your list?</p>
        <p>This will delete all items in your list.</p>
        <v-alert v-if="error" type="error">
          <h6 class="text-h6">Hmm...</h6>
          <p>Something went wrong, unable to clear your cart.</p>
        </v-alert>
      </v-card-text>
      <v-card-actions>
        <v-btn color="error" @click="dialogValue = false">Cancel</v-btn>
        <v-btn color="success" @click="clear">Confirm</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
