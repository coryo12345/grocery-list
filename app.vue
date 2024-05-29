<script setup lang="ts">
const { theme } = useThemeToggle();
const { $pwa } = useNuxtApp();

onMounted(async () => {
  if (process.client && $pwa) {
    if (!$pwa.isPWAInstalled) {
      await $pwa.install();
    }
    if ($pwa.needRefresh) {
      await $pwa.updateServiceWorker();
    }
  }
});
</script>

<template>
  <NuxtPwaManifest />
  <v-app :theme="theme">
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
    <AppToaster />
  </v-app>
</template>

<style>
.w-fit {
  width: fit-content;
}
</style>
