import { resolve, resourceDir } from "@tauri-apps/api/path";
import { Store } from "tauri-plugin-store-api";

export enum GameListView {
  Table = "Table",
  Grid = "Grid",
}

export enum GameListSort {
  Name = "Name",
  Release = "Release",
  Rating = "Rating",
  Added = "Added",
}

export enum PathListSort {
  Name = "Name",
  Added = "Added",
}

export enum GameStatus {
  Played = "Played",
  NotPlayed = "Not played",
}

export interface Settings {
  gameList: {
    view: GameListView;
    sort: GameListSort;
    descending: boolean;
    genreFilter: string[];
    modeFilter: string[];
    collectionFilter: string[];
    statusFilter?: GameStatus;
    fadePlayed: boolean;
    fadeNotReady: boolean;
  };
  pathList: {
    sort: PathListSort;
    descending: boolean;
    collectionFilter: string[];
  };
}

const key = "settings";
const file = `${key}.json`;
const path = import.meta.env.DEV
  ? file
  : await resolve(await resourceDir(), file);

const store = new Store(path);
const defaultValue: Settings = {
  gameList: {
    view: GameListView.Grid,
    sort: GameListSort.Added,
    descending: true,
    genreFilter: [],
    modeFilter: [],
    collectionFilter: [],
    statusFilter: undefined,
    fadeNotReady: false,
    fadePlayed: false,
  },
  pathList: {
    sort: PathListSort.Added,
    descending: true,
    collectionFilter: [],
  },
};

export const loadSettings = async () => {
  const value = await store.get<Settings>(key);
  return value || defaultValue;
};

export const saveSettings = async (value: Settings) => {
  await store.set(key, value);
  await store.save();
};
