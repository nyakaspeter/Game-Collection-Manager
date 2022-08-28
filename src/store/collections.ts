import { nanoid } from "nanoid";
import { Store } from "tauri-plugin-store-api";

export interface Collection {
  id: string;
  name: string;
  roots: string[];
  readyToPlay: boolean;
  scanDirectories: boolean;
  scanFiles: boolean;
  fileTypes: string[];
}

const key = "collections";
const store = new Store(`${key}.json`);

export const defaultCollections: Collection[] = [
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

export const loadCollections = async () => {
  const value = await store.get<Collection[]>(key);
  return value || defaultCollections;
};

export const saveCollections = async (value: Collection[]) => {
  await store.set(key, value);
  await store.save();
};
