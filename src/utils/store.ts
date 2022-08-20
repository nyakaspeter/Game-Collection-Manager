import { Store } from "tauri-plugin-store-api";

export const loadStore = async (key: string, defaultValue?: any) => {
  const store = new Store(`${key}.json`);

  if (defaultValue && !(await store.get(key))) store.set(key, defaultValue);

  return store;
};
