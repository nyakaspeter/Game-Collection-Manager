import { resolve, resourceDir } from "@tauri-apps/api/path";
import { Store } from "tauri-plugin-store-api";
import { Collection } from "./collections";
import { Game } from "./games";

export interface Path {
  path: string;
  exists: boolean;
  gameIds: string[];
  added: string;
}

export interface PathListItem extends Path {
  collections: Collection[];
  games: Game[];
}

const key = "paths";
const path = `${key}.json`;
const store = new Store(path);
const defaultValue: Path[] = [];

export const loadPaths = async () => {
  const value = await store.get<Path[]>(key);
  return value || defaultValue;
};

export const savePaths = async (value: Path[]) => {
  await store.set(key, value);
  await store.save();
};
