import { proxy } from "valtio";
import { IgdbAuthHeaders } from "../utils/igdb/auth";
import { loadCollections } from "./collections";
import { loadGames } from "./games";
import { loadPaths } from "./paths";
import { loadSettings } from "./settings";

export const store = proxy({
  settings: await loadSettings(),
  collections: await loadCollections(),
  paths: await loadPaths(),
  games: await loadGames(),
  authHeaders: null as IgdbAuthHeaders | null,
});
