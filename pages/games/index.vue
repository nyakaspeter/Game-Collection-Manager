<script setup lang="ts">
const games = ref(await $fetch("/api/games"));
</script>

<template>
  <div>
    <div v-for="game in games">
      <NuxtLink :to="`/games/${game.slug}`">{{ game.name }}</NuxtLink>
    </div>
  </div>
</template>
