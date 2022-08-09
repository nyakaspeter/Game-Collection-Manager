<script setup lang="ts">
const { data: games } = await useFetch("/api/games");
</script>

<template>
  <div>
    <div v-for="game in games">
      <NuxtLink :to="`/games/${game.slug}`">{{ game.name }}</NuxtLink>
    </div>
  </div>
</template>
