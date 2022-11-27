import { Store } from "tauri-plugin-store-api";
import { getStorePath } from "../utils/portable";
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
const path = await getStorePath(`${key}.json`);

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
