import { useMutation, useQuery } from "@tanstack/react-query";
import { queryClient } from "../utils/query";
import { loadStore } from "../utils/store";
import { showSuccessToast } from "../utils/toast";

export interface Settings {
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

const getSettings = async () => {
  return (await store.get<Settings>(KEY)) || DEFAULT;
};

const setSettings = async (settings: Settings) => {
  await store.set(KEY, settings);
  await store.save();
};

export const useSettings = () =>
  useQuery([KEY], getSettings, { suspense: true });

export const useUpdateSettings = () =>
  useMutation(setSettings, {
    onSuccess: () => {
      queryClient.invalidateQueries([KEY]);
      showSuccessToast("Settings saved");
    },
  });
