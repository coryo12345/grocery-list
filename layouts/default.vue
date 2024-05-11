<script setup lang="ts">
import { useAuthGuard } from "~/composables/authGuard";
await useAuthGuard();
</script>

<template>
  <v-app-bar color="primary">
    <template v-slot:prepend>
      <v-app-bar-nav-icon></v-app-bar-nav-icon>
    </template>
    <v-app-bar-title></v-app-bar-title>
    <v-spacer />
    <ThemeSwitcher />
    <LogoutButton />
  </v-app-bar>

  <v-main class="mt-2 px-4">
    <slot />
  </v-main>
</template>
