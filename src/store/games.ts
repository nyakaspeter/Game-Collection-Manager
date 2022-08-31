import { resolve, resourceDir } from "@tauri-apps/api/path";
import { Store } from "tauri-plugin-store-api";
import { Collection } from "./collections";
import { Path } from "./paths";

export interface Game {
  id: string;
  name: string;
  slug: string;
  summary?: string;
  storyline?: string;
  rating?: number;
  releaseDate?: string;
  platforms?: number[];
  genres?: number[];
  themes?: number[];
  perspectives?: number[];
  gameModes?: number[];
  multiplayer?: {
    lan?: boolean;
    coopCampaign?: boolean;
    offlineCoop?: boolean;
    onlineCoop?: boolean;
    splitscreen?: boolean;
    offlineMultiMaxPlayers?: number;
    onlineMultiMaxPlayers?: number;
    offlineCoopMaxPlayers?: number;
    onlineCoopMaxPlayers?: number;
  };
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

export interface GameListItem extends Game {
  paths: Path[];
  collections: Collection[];
}

const key = "games";
const path = await resolve(await resourceDir(), `${key}.json`);
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
