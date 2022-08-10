<script setup lang="ts">
const { data: settings } = await useFetch("/api/settings");

const scan = async () => await useLazyFetch("/api/scan", { method: "POST" });

const save = async () =>
  await useLazyFetch("/api/settings", { method: "POST", body: settings.value });
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
              @input="settings.scanPaths = $event"
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
    <div class="self-end flex gap-4 p-4">
      <button class="btn hover:scale-105" @click="scan">Scan games</button>
      <button class="btn hover:scale-105" @click="save">Save settings</button>
    </div>
  </div>
</template>

<style scoped lang="postcss">
td,
th {
  @apply border-none;
}
</style>
