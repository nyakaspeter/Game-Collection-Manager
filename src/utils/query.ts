import { QueryClient, useMutation, useQuery } from "@tanstack/react-query";
import {
  Collection,
  collectionsKey,
  getCollections,
  saveCollections,
  setCollections,
} from "../stores/collections";
import { getPaths, pathsKey } from "../stores/paths";
import {
  getSettings,
  saveSettings,
  setSettings,
  Settings,
  settingsKey,
} from "../stores/settings";
import { scanPaths } from "./scan";
import { showToast } from "./toast";

export const queryClient = new QueryClient({
  defaultOptions: { queries: { suspense: true } },
});

export const usePaths = () => useQuery([pathsKey], getPaths);

export const useCollections = () => useQuery([collectionsKey], getCollections);

export const useSettings = () => useQuery([settingsKey], getSettings);

export const useUpdateCollections = () =>
  useMutation(
    async (value: Collection[]) => {
      await setCollections(value);
      await saveCollections();
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries([collectionsKey]);
        showToast("success", "Collections saved");
      },
    }
  );

export const useUpdateSettings = () =>
  useMutation(
    async (value: Settings) => {
      setSettings(value);
      saveSettings();
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries([settingsKey]);
        showToast("success", "Settings saved");
      },
    }
  );

export const useScanPaths = () =>
  useMutation(scanPaths, {
    onSuccess: (data) => {
      const { added, identified, removed } = data;
      queryClient.invalidateQueries([pathsKey]);
      showToast(
        "success",
        "Paths scanned",
        `Found ${added} new items, removed ${removed} old items`
      );
    },
  });
