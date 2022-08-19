import { useMutation, useQuery } from "@tanstack/react-query";
import { queryClient } from "../utils/query";
import { loadStore } from "../utils/store";
import { showSuccessToast } from "../utils/toast";

export interface Collection {
  id: string;
  name: string;
  roots: string[];
  scanDirectories: boolean;
  scanFiles: boolean;
  fileTypes: string[];
}

const FILE = "collections.json";
const KEY = "collections";
const DEFAULT: Collection[] = [];

const store = await loadStore(FILE, KEY, DEFAULT);

export const getCollections = async () => {
  return (await store.get<Collection[]>(KEY)) as Collection[];
};

export const setCollections = async (collections: Collection[]) => {
  await store.set(KEY, collections);
  await store.save();
};

export const useCollections = () =>
  useQuery([KEY], getCollections, { suspense: true });

export const useUpdateCollections = () =>
  useMutation(setCollections, {
    onSuccess: () => {
      queryClient.invalidateQueries([KEY]);
      showSuccessToast("Collections saved");
    },
  });
