import fs from "fs";
import { JSONFile, Low } from "lowdb";

type JsonFile = "games" | "directories" | "settings";

export interface Game {
  id: number;
  name: string;
  slug: string;
  summary?: string;
  rating?: number;
  releaseDate?: string;
  genres?: Array<{
    name: string;
    slug: string;
  }>;
  cover?: {
    original: string;
    small: string;
    big: string;
    hd: string;
    fhd: string;
  };
  artworks?: Array<{
    original: string;
    small: string;
    big: string;
    hd: string;
    fhd: string;
  }>;
  screenshots?: Array<{
    original: string;
    medium: string;
    big: string;
    huge: string;
    hd: string;
    fhd: string;
  }>;
  videos?: Array<{
    name: string;
    url: string;
  }>;
}

export interface Directory {
  name: string;
  path: string;
  exists: boolean;
  games: string[];
}

export interface Settings {
  twitchApiClientId: string;
  twitchApiClientSecret: string;
  scanPaths: string[];
}

const schema = {
  games: {
    json: new Low<Game[]>(new JSONFile(`./data/games.json`)),
    defaultValue: [],
  },
  directories: {
    json: new Low<Directory[]>(new JSONFile(`./data/directories.json`)),
    defaultValue: [],
  },
  settings: {
    json: new Low<Settings>(new JSONFile(`./data/settings.json`)),
    defaultValue: {
      twitchApiClientId: "",
      twitchApiClientSecret: "",
      scanPaths: [],
    },
  },
};

const createDataDirIfNeeded = async () => {
  try {
    await fs.promises.access("./data");
  } catch {
    await fs.promises.mkdir("./data");
  }
};

export const useJson = async <T extends JsonFile>(file: T) => {
  await createDataDirIfNeeded();
  const json = schema[file].json;
  await json.read();
  json.data ||= schema[file].defaultValue;

  return json as T extends "games"
    ? Low<Game[]>
    : T extends "directories"
    ? Low<Directory[]>
    : T extends "settings"
    ? Low<Settings>
    : any;
};
