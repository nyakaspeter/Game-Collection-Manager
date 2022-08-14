<script setup lang="ts">
import { Directory } from "~~/utils/json";

const props = defineProps<{
  directory: Directory | null;
}>();

const emit = defineEmits<{
  (e: "close"): void;
  (e: "save", editedDirectory: Directory): void;
}>();
</script>

<template>
  <div
    class="modal"
    :class="{ 'modal-open': !!directory }"
    @click="$emit('close')"
  >
    <div
      v-if="directory"
      class="modal-box relative w-3/4 max-w-4xl"
      @click.stop
    >
      <h3 class="text-lg font-bold">{{ directory.name }}</h3>
      <ChipInput
        class="py-4"
        placeholder="Enter IGDB slug for directory..."
        :value="directory.games"
      />
      <div class="w-full flex justify-end gap-4">
        <button class="btn hover:scale-105" @click="$emit('close')">
          Cancel
        </button>
        <button class="btn hover:scale-105" @click="$emit('save', directory)">
          Save
        </button>
      </div>
    </div>
  </div>
</template>
