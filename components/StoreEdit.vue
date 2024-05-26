<script setup lang="ts">
import { useDraggable } from "vue-draggable-plus";
import { categories, type presets } from "~/db/schema";

const props = defineProps<{
  categories: (typeof categories.$inferSelect)[];
  usedNames: string[];
  store: typeof presets.$inferSelect;
}>();

const toast = useToast();

const listEl = ref<HTMLElement | null>(null);
const list = ref<(typeof categories.$inferSelect)[]>([]);
const name = ref("");
const valid = ref(true);
const loading = ref(false);

watch(
  () => props.store,
  () => {
    name.value = props.store.name;
    list.value = [...props.store.categories]
      .map((id) => props.categories.find((c) => c.id === id))
      .filter((x) => !!x) as any; // filter gets rid of undefined so this is actually valid
  },
  { immediate: true },
);

const nameNotInUse = (val: string) =>
  !props.usedNames.includes(val) ||
  props.store.name === val ||
  "This name is not available";

const draggable = useDraggable(listEl, list, {
  animation: 150,
  handle: ".category-handle",
});

const hasUnsavedChanges = computed(() => {
  return (
    name.value !== props.store.name ||
    JSON.stringify(list.value.map((s) => s.id)) !==
      JSON.stringify(props.store.categories)
  );
});

async function saveChanges() {
  loading.value = true;
  try {
    const resp = await $fetch("/api/stores", {
      method: "PUT",
      body: JSON.stringify({
        id: props.store.id,
        name: name.value,
        categories: list.value.map((s) => s.id),
      }),
    });
    toast.success("Changes were saved.");
  } catch (err) {
    toast.error("Unable to save changes. Try again later.");
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <v-form v-model="valid" @submit.prevent="saveChanges">
    <v-text-field
      v-model="name"
      label="Name"
      variant="outlined"
      :rules="[formRules.required, nameNotInUse]"
      class="mb-2"
    />
    <v-list ref="listEl">
      <v-list-item v-for="category in list" :key="category.id">
        <v-icon
          icon="mdi-dots-vertical"
          class="category-handle cursor-pointer"
        />
        {{ category.name }}
      </v-list-item>
    </v-list>
    <p
      v-if="hasUnsavedChanges"
      class="font-italic font-weight-bold text-center"
    >
      You have unsaved changes
    </p>
    <div class="d-flex justify-center my-2">
      <v-btn
        color="success"
        type="submit"
        :disabled="!valid || loading || !hasUnsavedChanges"
        :loading="loading"
      >
        Save
      </v-btn>
    </div>
  </v-form>
</template>
