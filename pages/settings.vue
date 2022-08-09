<script setup lang="ts">
const { data: paths } = await useFetch("/api/paths");
</script>

<template>
  <div>
    <div v-for="path in paths">{{ path }}</div>
  </div>
</template>
