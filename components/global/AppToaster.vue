<script setup lang="ts">
const TIMEOUT = computed(() => 8000);

const toast = useToast();

onMounted(() => {
  toast.registerToaster(onToast);
});

const messages = ref<FullToasterMessage[]>([]);
function onToast(msg: FullToasterMessage): void {
  messages.value.push(msg);
  setTimeout(() => {
    messages.value.shift();
  }, TIMEOUT.value);
}
</script>

<template>
  <v-snackbar
    v-for="(message, idx) in messages"
    :model-value="true"
    :key="idx"
    :color="message.type"
    :timeout="TIMEOUT"
  >
    <div class="d-flex align-center">
      <v-icon :icon="message.icon" size="large" class="mr-3" />
      <p class="mt-1">{{ message.message }}</p>
    </div>
  </v-snackbar>
</template>
