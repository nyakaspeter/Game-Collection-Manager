import { nanoid } from "nanoid";
import { Store } from "tauri-plugin-store-api";
import { getStorePath } from "../utils/portable";

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
const path = await getStorePath(`${key}.json`);

const store = new Store(path);
const defaultValue: Collection[] = [
  {
    id: nanoid(),
    name: "My Games",
    roots: [],
    readyToPlay: true,
    scanDirectories: true,
    scanFiles: true,
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
