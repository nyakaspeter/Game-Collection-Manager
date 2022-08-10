<template>
  <div class="navbar bg-base-100">
    <div class="flex-1">
      <NuxtLink to="/" class="btn btn-ghost normal-case text-xl">
        Game Collection Manager
      </NuxtLink>
    </div>
    <div class="flex-none">
      <ul class="menu menu-horizontal p-0">
        <li><NuxtLink to="/games">Games</NuxtLink></li>
        <li><NuxtLink to="/directories">Directories</NuxtLink></li>
        <li><NuxtLink to="/settings">Settings</NuxtLink></li>
      </ul>
    </div>
  </div>
</template>
