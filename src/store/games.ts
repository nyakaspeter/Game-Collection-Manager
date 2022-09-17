import { resolve, resourceDir } from "@tauri-apps/api/path";
import { Store } from "tauri-plugin-store-api";
import { Collection } from "./collections";
import { Path } from "./paths";

export interface Game {
  id: string;
  name: string;
  slug: string;
  played?: boolean;
  category?: number;
  summary?: string;
  rating?: number;
  releaseDate?: string;
  platforms?: number[];
  genres?: number[];
  gameModes?: number[];
  cover?: string;
  artworks?: string[];
  screenshots?: string[];
  videos?: {
    name: string;
    id: string;
  }[];
}

export interface GameListItem extends Game {
  paths: Path[];
  collections: Collection[];
}

const key = "games";
const file = `${key}.json`;
const path = import.meta.env.DEV
  ? file
  : await resolve(await resourceDir(), file);

const store = new Store(path);
const defaultValue: Game[] = [];

export const loadGames = async () => {
  const value = await store.get<Game[]>(key);
  return value || defaultValue;
};

export const saveGames = async (value: Game[]) => {
  await store.set(key, value);
  await store.save();
};
