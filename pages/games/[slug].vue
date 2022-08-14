<script setup lang="ts">
const route = useRoute();
const { slug } = route.params;
const game = ref(await $fetch(`/api/games/${slug}`));
</script>

<template>
  <div>
    <div>{{ game }}</div>
  </div>
</template>
