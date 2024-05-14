<script setup lang="ts">
const { data, pending, error, refresh } = await useFetch("/api/groceries");

const toggleError = ref(false);

async function toggleItem(
  item: GetElementType<NonNullable<typeof data.value>>,
) {
  (item as any).loading = true;
  try {
    const resp = await $fetch("/api/groceries", {
      method: "PUT",
      body: JSON.stringify({
        id: item.grocery_list.id,
        checked: !item.grocery_list.checked,
      }),
    });
    item.grocery_list.checked = !item.grocery_list.checked;
  } catch (err) {
    toggleError.value = true;
  } finally {
    (item as any).loading = false;
  }
}
</script>

<template>
  <div>
    <h1 class="text-h4 font-weight-bold text-center mb-2">Grocery List</h1>
    <p>TODO: delete individual items</p>
    <v-alert v-if="error" type="error" class="mt-2">
      <h6 class="text-h6">Something went wrong...</h6>
      <p>Unable to fetch current grocery list</p>
    </v-alert>
    <v-progress-circular v-else-if="pending" indeterminate size="64" />
    <template v-else>
      <span class="d-block mx-auto w-fit mb-2">
        <AddGrocery class="mr-1" @item-added="refresh" />
        <ClearList class="ml-1" @items-cleared="refresh" />
      </span>
      <v-select
        :model-value="'None'"
        :items="['None', 'Wegmans']"
        variant="outlined"
        label="Choose Store (for sorting)"
        class="mt-6"
        hide-details
      />
      <v-list v-if="data?.length" class="my-2">
        <v-list-item v-for="(item, idx) in data" :key="idx">
          <div class="w-100 d-flex justify-space-between align-center">
            <div>
              <span class="d-block">{{ item.all_groceries.name }}</span>
              <span class="d-block text-caption text-wrap">
                {{ item.all_groceries.description }}
              </span>
            </div>
            <span>
              <v-progress-circular
                v-if="(item as any).loading"
                :size="32"
                indeterminate
                class="my-3 mr-1"
              />
              <v-checkbox
                v-else
                :model-value="item.grocery_list.checked"
                color="primary"
                hide-details
                readonly
                @click="toggleItem(item)"
              />
            </span>
          </div>
        </v-list-item>
      </v-list>
      <p v-else class="text-h6 text-center mt-12">
        Add some items to your cart to get started!
      </p>
    </template>
    <v-snackbar v-model="toggleError" color="error" multi-line :timeout="8000">
      <p class="text-h6">Something went wrong.</p>
      <p>Unable to update this item.</p>
    </v-snackbar>
  </div>
</template>
