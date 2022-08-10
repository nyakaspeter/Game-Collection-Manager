import { Low, JSONFile } from "lowdb";
import { createDataDirIfNeeded, Directory } from "./fs";
import { Game } from "./igdbApi";

export interface Settings {
  twitchApiClientId: string;
  twitchApiClientSecret: string;
  scanPaths: string[];
}

export const getSettingsDb = async () => {
  await createDataDirIfNeeded();
  const db = new Low<Settings>(new JSONFile("./data/settings.json"));
  await db.read();
  db.data ||= {
    twitchApiClientId: "",
    twitchApiClientSecret: "",
    scanPaths: [],
  };
  return db;
};

export const getDirectoriesDb = async () => {
  await createDataDirIfNeeded();
  const db = new Low<Directory[]>(new JSONFile("./data/directories.json"));
  await db.read();
  db.data ||= [];
  return db;
};

export const getGamesDb = async () => {
  await createDataDirIfNeeded();
  const db = new Low<Game[]>(new JSONFile("./data/games.json"));
  await db.read();
  db.data ||= [];
  return db;
};
