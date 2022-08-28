import { Store } from "tauri-plugin-store-api";

export interface Path {
  path: string;
  exists: boolean;
  gameIds: string[];
}

const key = "paths";
const store = new Store(`${key}.json`);

export const defaultPaths: Path[] = [];

export const loadPaths = async () => {
  const value = await store.get<Path[]>(key);
  return value || defaultPaths;
};

export const savePaths = async (value: Path[]) => {
  await store.set(key, value);
  await store.save();
};
