<script setup lang="ts">
import CONSTANTS from "~/constants";

const token = useCookie(CONSTANTS.JWT_COOKIE_NAME);
const router = useRouter();

function logout() {
  token.value = "";
  router.push("/auth");
}
</script>

<template>
  <v-btn icon="mdi-logout" @click="logout"></v-btn>
</template>
