import { resolve, resourceDir } from "@tauri-apps/api/path";
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
const file = `${key}.json`;
const path = import.meta.env.DEV
  ? file
  : await resolve(await resourceDir(), file);

const store = new Store(path);
const defaultValue: Collection[] = [
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
  return value || defaultValue;
};

export const saveCollections = async (value: Collection[]) => {
  await store.set(key, value);
  await store.save();
};
