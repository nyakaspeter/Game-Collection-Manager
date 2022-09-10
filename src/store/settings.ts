import { Store } from "tauri-plugin-store-api";

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
  twitchApiClientId: string;
  twitchApiClientSecret: string;
  gameList: {
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
const path = `${key}.json`;
const store = new Store(path);
const defaultValue: Settings = {
  twitchApiClientId: "",
  twitchApiClientSecret: "",
  gameList: {
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
