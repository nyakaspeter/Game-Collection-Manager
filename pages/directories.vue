<script setup lang="ts">
import { cloneDeep } from "lodash";
import { Directory } from "~~/utils/json";

const { data: directories, refresh: refreshDirectories } = await useFetch(
  "/api/directories",
  { key: "directories" }
);

const editedDirectory = ref<Directory | null>(null);

const handleClose = () => {
  editedDirectory.value = null;
};

const handleSave = async (edited: Directory) => {
  handleClose();
  await $fetch("/api/directories", { method: "POST", body: edited });
  await refreshDirectories();
};
</script>

<template>
  <div>
    <table class="table table-fixed w-full">
      <thead class="sticky top-0">
        <tr>
          <th class="w-12"></th>
          <th class="w-48">Source</th>
          <th>Name</th>
          <th class="">Games</th>
          <th class="w-24"></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(dir, idx) in directories" class="hover">
          <td class="text-right font-bold">{{ idx as number + 1 }}</td>
          <td class="truncate">
            {{ dir.path.slice(0, -(dir.name.length + 1)) }}
          </td>
          <td class="truncate">{{ dir.name }}</td>
          <td>
            <div class="flex flex-wrap gap-1">
              <span
                v-for="game in dir.games"
                class="badge badge-lg max-w-full justify-start truncate hover:scale-105"
              >
                <NuxtLink :to="`/games/${game}`">
                  {{ game }}
                </NuxtLink>
              </span>
            </div>
          </td>
          <td class="text-right px-5">
            <label
              for="my-modal-4"
              class="btn btn-sm invisible hover:scale-105 modal-button"
              @click="editedDirectory = cloneDeep(dir)"
            >
              Edit
            </label>
          </td>
        </tr>
      </tbody>
    </table>

    <EditDirectoryModal
      :directory="editedDirectory"
      @close="handleClose"
      @save="handleSave"
    />
  </div>
</template>

<style lang="postcss" scoped>
tr:hover .btn {
  @apply visible;
}
</style>
