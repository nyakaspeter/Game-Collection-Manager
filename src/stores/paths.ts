import { useMutation, useQuery } from "@tanstack/react-query";
import { queryClient } from "../utils/query";
import { loadStore } from "../utils/store";

export interface Path {
  path: string;
  exists: boolean;
  gameIds: string[];
}

const FILE = "paths.json";
const KEY = "paths";
const DEFAULT: Path[] = [];

const store = await loadStore(FILE, KEY, DEFAULT);

export const getPaths = async () => {
  return (await store.get<Path[]>(KEY)) as Path[];
};

export const setPaths = async (paths: Path[]) => {
  await store.set(KEY, paths);
  await store.save();
};

export const usePaths = () => useQuery([KEY], getPaths, { suspense: true });

export const useUpdatePaths = () =>
  useMutation(setPaths, {
    onSuccess: () => {
      queryClient.invalidateQueries([KEY]);
    },
  });
