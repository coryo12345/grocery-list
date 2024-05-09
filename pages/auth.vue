<script setup lang="ts">
definePageMeta({
  layout: "blank",
});
const router = useRouter();

const formValid = ref(false);
const fieldRequired = (val) =>
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

  if (resp.err) {
    showErr.value = true;
  } else {
    router.push("/");
  }
}
</script>

<template>
  <div class="d-flex justify-center align-center w-100 h-100">
    <v-form v-model="formValid" @submit.prevent="signIn">
      <v-card class="auth-card">
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
    </v-form>
  </div>
</template>

<style scoped>
.auth-card {
  min-width: 400px;
}
</style>
