import { Store } from "tauri-plugin-store-api";

export const loadStore = async (
  file: string,
  key: string,
  defaultValue: any
) => {
  const store = new Store(file);
  if (!(await store.get(key))) store.set(key, defaultValue);
  return store;
};
