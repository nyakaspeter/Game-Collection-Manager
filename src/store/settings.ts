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

let settingPromise = Promise.resolve();

export const setSettings = async (value: Settings) => {
  settingPromise = store.set(key, value);
  await settingPromise;
};

export const saveSettings = async () => {
  await settingPromise;
  await store.save();
};
