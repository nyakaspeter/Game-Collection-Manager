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

let settingPromise = Promise.resolve();

export const setPaths = async (value: Path[]) => {
  settingPromise = store.set(key, value);
  await settingPromise;
};

export const savePaths = async () => {
  await settingPromise;
  await store.save();
};
