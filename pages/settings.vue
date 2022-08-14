<script setup lang="ts">
const settings = ref(await $fetch("/api/settings"));

const save = async () => {
  settings.value = await $fetch("/api/settings", {
    method: "POST",
    body: settings.value,
  });
  await $fetch("/api/scan", { method: "POST" });
};
</script>

<template>
  <div class="flex flex-col">
    <table class="table table-fixed w-full">
      <tbody>
        <tr>
          <td class="w-60 font-bold">Twitch Client ID</td>
          <td>
            <input
              v-model="settings.twitchApiClientId"
              placeholder="Enter Twitch API Client ID..."
              class="input input-bordered w-full"
            />
          </td>
        </tr>
        <tr>
          <td class="w-60 font-bold">Twitch Client Secret</td>
          <td>
            <input
              v-model="settings.twitchApiClientSecret"
              placeholder="Enter Twitch API Client Secret..."
              class="input input-bordered w-full"
            />
          </td>
        </tr>
        <tr>
          <td class="w-60 font-bold">Root Game Directories</td>
          <td>
            <ChipInput
              placeholder="Enter root path for scanning..."
              :value="settings.scanPaths"
            />
          </td>
        </tr>
        <tr>
          <td class="w-60 font-bold">UI Theme</td>
          <td>
            <ThemeSelector class="w-full" />
          </td>
        </tr>
      </tbody>
    </table>
    <button class="btn self-end m-4 hover:scale-105" @click="save">
      Save settings
    </button>
  </div>
</template>

<style scoped lang="postcss">
td,
th {
  @apply border-none;
}
</style>
