import { useMutation, useQuery } from "@tanstack/react-query";
import { queryClient } from "../utils/query";
import { loadStore } from "../utils/store";

interface Settings {
  twitchApiClientId: string;
  twitchApiClientSecret: string;
}

const FILE = "settings.json";
const KEY = "settings";
const DEFAULT: Settings = {
  twitchApiClientId: "",
  twitchApiClientSecret: "",
};

const store = await loadStore(FILE, KEY, DEFAULT);

const getSettings = async () => (await store.get<Settings>(KEY)) || DEFAULT;

const setSettings = async (settings: Settings) => {
  await store.set(KEY, settings);
  await store.save();
};

export const useSettings = () => useQuery([KEY], getSettings);
export const useUpdateSettings = () =>
  useMutation(setSettings, {
    onSuccess: () => queryClient.invalidateQueries([KEY]),
  });
