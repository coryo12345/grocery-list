<script setup lang="ts">
const { theme } = useThemeToggle();
</script>

<template>
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
