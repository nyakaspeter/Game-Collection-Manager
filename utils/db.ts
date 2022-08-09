import { Low, JSONFile } from "lowdb";
import { createDataDirIfNeeded, Directory } from "./fs";
import { Game } from "./igdbApi";

export const getScanPathsDb = async () => {
  await createDataDirIfNeeded();
  const db = new Low<string[]>(new JSONFile("./data/scanPaths.json"));
  await db.read();
  db.data ||= [];
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
