<script setup lang="ts">
const props = defineProps<{
  title?: string;
  text?: string;
  activatorText?: string;
}>();

const emit = defineEmits<{
  (e: "cancel"): void;
  (e: "save"): void;
}>();

const dialogModel = ref(false);

function onClick() {
  dialogModel.value = true;
}

function cancel() {
  dialogModel.value = false;
  emit("cancel");
}

async function save() {
  await emit("save");
  dialogModel.value = false;
}
</script>

<template>
  <div>
    <slot name="activator" :on="{ click: onClick }">
      <v-btn @click="onClick">
        {{ props.activatorText ?? "Confirm" }}
      </v-btn>
    </slot>
    <v-dialog v-model="dialogModel">
      <v-card
        class="mx-auto"
        max-width="320"
        :title="props.title ?? 'Are you sure?'"
      >
        <template v-slot:text>
          <slot name="text">
            <p>{{ props.text ?? "" }}</p>
          </slot>
        </template>

        <template v-slot:actions>
          <v-spacer></v-spacer>
          <v-btn color="error" @click="cancel">Cancel</v-btn>
          <v-btn color="success" @click="save">Confirm</v-btn>
        </template>
      </v-card>
    </v-dialog>
  </div>
</template>
