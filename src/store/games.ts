import { Store } from "tauri-plugin-store-api";

export interface Game {
  id: string;
  name: string;
  slug: string;
  summary?: string;
  rating?: number;
  releaseDate?: string;
  genres?: {
    name: string;
    slug: string;
  }[];
  cover?: string;
  artworks?: string[];
  screenshots?: string[];
  videos?: {
    name: string;
    id: string;
  }[];
}

const key = "games";
const store = new Store(`${key}.json`);

export const defaultGames: Game[] = [];

export const loadGames = async () => {
  const value = await store.get<Game[]>(key);
  return value || defaultGames;
};

let settingPromise = Promise.resolve();

export const setGames = async (value: Game[]) => {
  settingPromise = store.set(key, value);
  await settingPromise;
};

export const saveGames = async () => {
  await settingPromise;
  await store.save();
};
