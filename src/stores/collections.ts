import { useMutation, useQuery } from "@tanstack/react-query";
import { queryClient } from "../utils/query";
import { loadStore } from "../utils/store";
import { showToast } from "../utils/toast";

export interface Collection {
  id: string;
  name: string;
  roots: string[];
  scanDirectories: boolean;
  scanFiles: boolean;
  fileTypes: string[];
}

const defaultCollections: Collection[] = [];

export const collectionsKey = "collections";

export const collectionsStore = await loadStore(
  collectionsKey,
  defaultCollections
);

export const getCollections = async () => {
  return (await collectionsStore.get<Collection[]>(collectionsKey))!!;
};

export const setCollections = async (value: Collection[]) => {
  await collectionsStore.set(collectionsKey, value);
};

export const saveCollections = async () => {
  await collectionsStore.save();
};
