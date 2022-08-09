<script setup lang="ts">
const route = useRoute();
const { slug } = route.params;
const { data: game } = await useFetch(`/api/games/${slug}`, {
  key: slug as string,
});
</script>

<template>
  <div>
    <div>{{ game }}</div>
  </div>
</template>
