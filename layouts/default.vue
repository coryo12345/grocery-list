<script setup lang="ts">
import { useAuthGuard } from "~/composables/authGuard";
await useAuthGuard();

const showNavDrawer = ref(false);
</script>

<template>
  <v-app-bar color="primary">
    <template v-slot:prepend>
      <v-app-bar-nav-icon
        @click.stop="showNavDrawer = !showNavDrawer"
      ></v-app-bar-nav-icon>
    </template>
    <v-app-bar-title></v-app-bar-title>
    <v-spacer />
    <ThemeSwitcher />
    <LogoutButton />
  </v-app-bar>

  <v-main class="mt-4 px-4">
    <slot />
  </v-main>

  <v-navigation-drawer v-model="showNavDrawer" temporary>
    <v-list>
      <v-list-item to="/">Grocery List</v-list-item>
      <v-list-item to="items">Manage Grocery Items</v-list-item>
      <v-list-item to="/categories">Categories</v-list-item>
      <v-list-item to="/stores">Stores</v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>
