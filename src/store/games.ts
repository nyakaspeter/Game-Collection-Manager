import { Store } from "tauri-plugin-store-api";

export interface Game {
  id: string;
  name: string;
  slug: string;
  summary?: string;
  storyline?: string;
  rating?: number;
  releaseDate?: string;
  platforms?: {
    name: string;
    slug: string;
    abbreviation: string;
  }[];
  genres?: {
    name: string;
    slug: string;
  }[];
  franchises?: {
    name: string;
    slug: string;
  }[];
  themes?: {
    name: string;
    slug: string;
  }[];
  gameModes?: {
    name: string;
    slug: string;
  }[];
  multiplayerModes?: {
    campaigncoop?: boolean;
    dropin?: boolean;
    lancoop?: boolean;
    offlinecoop?: boolean;
    offlinecoopmax?: number;
    offlinemax?: number;
    onlinecoop?: number;
    onlinecoopmax?: number;
    onlinemax?: number;
    splitscreen?: boolean;
    splitscreenonline?: boolean;
  }[];
  perspectives?: {
    name: string;
    slug: string;
  }[];
  gameEngines?: {
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
  websites?: {
    category: number;
    url: string;
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
