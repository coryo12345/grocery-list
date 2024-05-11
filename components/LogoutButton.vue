<script setup lang="ts">
import CONSTANTS from "~/constants";

const token = useCookie(CONSTANTS.JWT_COOKIE_NAME);

function logout() {
  token.value = "";
  window.location.reload();
}
</script>

<template>
  <v-btn icon="mdi-logout" @click="logout"></v-btn>
</template>
