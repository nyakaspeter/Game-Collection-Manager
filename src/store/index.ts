import { proxy, subscribe } from "valtio";
import { loadCollections, setCollections } from "./collections";
import { loadGames, setGames } from "./games";
import { loadPaths, setPaths } from "./paths";
import { loadSettings, setSettings } from "./settings";

export const store = proxy({
  settings: await loadSettings(),
  collections: await loadCollections(),
  paths: await loadPaths(),
  games: await loadGames(),
});

subscribe(store, async () => {
  await setSettings(store.settings);
  await setCollections(store.collections);
  await setPaths(store.paths);
  await setGames(store.games);
});
