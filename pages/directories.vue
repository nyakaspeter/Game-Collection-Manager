<script setup lang="ts">
const { data: directories } = await useFetch("/api/directories");
</script>

<template>
  <div>
    <div v-for="dir in directories">{{ dir }}</div>
  </div>
</template>
