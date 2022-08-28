import { proxy } from "valtio";
import { loadCollections } from "./collections";
import { loadGames } from "./games";
import { loadPaths } from "./paths";
import { loadSettings } from "./settings";

export const store = proxy({
  settings: await loadSettings(),
  collections: await loadCollections(),
  paths: await loadPaths(),
  games: await loadGames(),
});
