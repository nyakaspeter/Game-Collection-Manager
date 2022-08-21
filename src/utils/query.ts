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
  defaultOptions: { queries: { suspense: true, refetchOnWindowFocus: false } },
});

export const usePaths = () =>
  useQuery([pathsKey], async () => {
    const paths = await getPaths();
    const collections = await getCollections();

    return paths
      .filter((p) => p.exists)
      .map((p) => ({
        ...p,
        collections: collections
          .filter((c) => c.roots.find((r) => p.path.startsWith(r)))
          .map((c) => c.name),
      }));
  });

export const useCollections = () => useQuery([collectionsKey], getCollections);

export const useSettings = () => useQuery([settingsKey], getSettings);

export const useUpdateSettingsAndCollections = () =>
  useMutation(
    async ({
      settings,
      collections,
    }: {
      settings: Settings;
      collections: Collection[];
    }) => {
      await setSettings(settings);
      await setCollections(collections);
      await saveSettings();
      await saveCollections();
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries([settingsKey]);
        queryClient.invalidateQueries([collectionsKey]);
        queryClient.invalidateQueries([pathsKey]);
        showToast(
          "success",
          "Settings saved",
          "Settings and collections have been saved"
        );
      },
    }
  );

export const useScanPaths = () =>
  useMutation(scanPaths, {
    onSuccess: (data) => {
      const { added, identified, removed } = data;
      queryClient.removeQueries([pathsKey]);
      showToast(
        "success",
        "Paths scanned",
        `Found ${added} new items, removed ${removed} old items`
      );
    },
  });
