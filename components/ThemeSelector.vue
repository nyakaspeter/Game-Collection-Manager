<script setup lang="ts">
const colorMode = useColorMode();

console.log(colorMode.preference);

const themes = [
  "system",
  "light",
  "dark",
  "cupcake",
  "bumblebee",
  "emerald",
  "corporate",
  "synthwave",
  "retro",
  "cyberpunk",
  "valentine",
  "halloween",
  "garden",
  "forest",
  "aqua",
  "lofi",
  "pastel",
  "fantasy",
  "wireframe",
  "black",
  "luxury",
  "dracula",
  "cmyk",
  "autumn",
  "business",
  "acid",
  "lemonade",
  "night",
  "coffee",
  "winter",
];
</script>

<template>
  <select class="select select-bordered" v-model="colorMode.preference">
    <option v-for="theme of themes" :key="theme" :value="theme">
      {{ theme.replace(/^\w/, (c) => c.toUpperCase()) }}
    </option>
  </select>
</template>
