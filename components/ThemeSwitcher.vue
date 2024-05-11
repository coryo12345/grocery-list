<script setup lang="ts">
const { toggleTheme } = useThemeToggle();
</script>

<template>
  <v-btn icon="mdi-theme-light-dark" size="small" @click="toggleTheme"></v-btn>
</template>
