import { loadStore } from "../utils/store";

export interface Settings {
  twitchApiClientId: string;
  twitchApiClientSecret: string;
}

const defaultSettings: Settings = {
  twitchApiClientId: "",
  twitchApiClientSecret: "",
};

export const settingsKey = "settings";

export const settingsStore = await loadStore(settingsKey, defaultSettings);

export const getSettings = async () => {
  return (await settingsStore.get<Settings>(settingsKey))!!;
};

export const setSettings = async (value: Settings) => {
  await settingsStore.set(settingsKey, value);
};

export const saveSettings = async () => {
  await settingsStore.save();
};
