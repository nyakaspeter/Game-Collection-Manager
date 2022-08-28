import { resolve, resourceDir } from "@tauri-apps/api/path";
import { Store } from "tauri-plugin-store-api";

export interface Settings {
  twitchApiClientId: string;
  twitchApiClientSecret: string;
}

const key = "settings";
const path = await resolve(await resourceDir(), `${key}.json`);
const store = new Store(path);
const defaultValue: Settings = {
  twitchApiClientId: "",
  twitchApiClientSecret: "",
};

export const loadSettings = async () => {
  const value = await store.get<Settings>(key);
  return value || defaultValue;
};

export const saveSettings = async (value: Settings) => {
  await store.set(key, value);
  await store.save();
};
