import { Store } from "tauri-plugin-store-api";

export interface Settings {
  twitchApiClientId: string;
  twitchApiClientSecret: string;
}

const key = "settings";
const store = new Store(`${key}.json`);

export const defaultSettings: Settings = {
  twitchApiClientId: "",
  twitchApiClientSecret: "",
};

export const loadSettings = async () => {
  const value = await store.get<Settings>(key);
  return value || defaultSettings;
};

export const saveSettings = async (value: Settings) => {
  await store.set(key, value);
  await store.save();
};
