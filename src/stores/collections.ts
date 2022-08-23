import { nanoid } from "nanoid";
import { loadStore } from "../utils/store";

export interface Collection {
  id: string;
  name: string;
  roots: string[];
  readyToPlay: boolean;
  scanDirectories: boolean;
  scanFiles: boolean;
  fileTypes: string[];
}

const defaultCollections: Collection[] = [
  {
    id: nanoid(),
    name: "My Games",
    roots: ["D:\\Games"],
    readyToPlay: true,
    scanDirectories: true,
    scanFiles: false,
    fileTypes: ["iso", "cso"],
  },
];

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
