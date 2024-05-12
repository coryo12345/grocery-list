<script setup lang="ts">
import { useDisplay } from "vuetify";

definePageMeta({
  layout: "blank",
});
const router = useRouter();

const { mobile } = useDisplay();

const formValid = ref(false);
const fieldRequired = (val: string) =>
  (val && val.length > 0) || "This field is required";

const password = ref("");
const showErr = ref(false);
const loading = ref(false);

async function signIn() {
  showErr.value = false;
  loading.value = true;

  const resp = await $fetch("/api/auth", {
    method: "POST",
    body: JSON.stringify({ password: password.value }),
  });
  loading.value = false;

  if ((resp as any).err) {
    showErr.value = true;
  } else {
    router.push("/");
  }
}
</script>

<template>
  <v-form v-model="formValid" @submit.prevent="signIn" class="w-100 h-100">
    <div
      class="d-flex flex-col justify-center align-center w-100 h-100 px-4"
      :class="{ 'bg-surface': mobile }"
    >
      <v-card class="auth-card" :elevation="mobile ? 0 : 2">
        <template #title>Sign In</template>
        <template #subtitle>Enter password to access site</template>
        <template #text>
          <v-text-field
            v-model="password"
            label="Password"
            type="password"
            variant="outlined"
            :rules="[fieldRequired]"
            :disabled="loading"
          />
          <v-alert
            v-if="showErr"
            type="error"
            text="Unable to sign you in, check your password."
          />
        </template>
        <template #actions>
          <v-btn
            type="submit"
            color="primary"
            variant="elevated"
            :disabled="loading"
            :loading="loading"
          >
            Submit
          </v-btn>
        </template>
      </v-card>
    </div>
  </v-form>
</template>

<style scoped>
.auth-card {
  max-width: 500px;
  flex: 1 0 auto;
}
</style>
