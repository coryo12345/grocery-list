<script setup lang="ts">
const { theme } = useThemeToggle();
</script>

<template>
  <v-app :theme="theme">
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </v-app>
</template>
