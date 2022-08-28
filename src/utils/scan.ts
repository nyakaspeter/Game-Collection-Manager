import { readDir } from "@tauri-apps/api/fs";
import { extname, sep } from "@tauri-apps/api/path";
import { uniq } from "rambda";
import { store } from "../store";
import { saveGames } from "../store/games";
import { savePaths } from "../store/paths";
import { fetchIgdbGames } from "./igdb/api";
import { searchIgdb } from "./igdb/search";

const getFileExtension = async (path: string) => {
  try {
    return await extname(path);
  } catch (error) {
    console.error(error);
    return "";
  }
};

const getSubPaths = async (
  rootPath: string,
  scanDirectories: boolean = true,
  fileTypes: string[] = []
) => {
  try {
    const subPaths: string[] = [];
    const fileEntries = await readDir(rootPath);

    for await (const entry of fileEntries) {
      if (
        (scanDirectories && entry.children) ||
        (fileTypes.length &&
          fileTypes.includes(await getFileExtension(entry.path)))
      ) {
        subPaths.push(entry.path);
      }
    }

    return subPaths;
  } catch (error) {
    console.error(error);
    return [];
  }
};

const scanCollectionPaths = async () => {
  let paths: string[] = [];

  for await (const collection of store.collections) {
    for await (const root of collection.roots) {
      const subPaths = await getSubPaths(
        root,
        collection.scanDirectories,
        collection.scanFiles ? collection.fileTypes : []
      );

      paths = paths.concat(subPaths);
    }
  }

  return uniq(paths);
};

export const scanPaths = async () => {
  let added = 0;
  let identified = 0;
  let removed = 0;
  let fetched = 0;

  const scannedPaths = await scanCollectionPaths();
  const newPaths = scannedPaths.filter(
    (path) => !store.paths.find((p) => p.path === path)
  );

  for (const path of store.paths) {
    if (path.exists && !scannedPaths.includes(path.path)) {
      path.exists = false;
      removed++;
    } else if (!path.exists && scannedPaths.includes(path.path)) {
      path.exists = true;
      added++;
    }
  }

  await Promise.all(
    newPaths.map(async (path) => {
      let gameIds: string[] = [];
      const name = path.split(sep).pop();
      const sameName = store.paths.find((p) => p.path.endsWith(name!!));

      if (sameName) {
        gameIds = sameName.gameIds;
      } else {
        try {
          const searchResults = await searchIgdb(name!!);
          if (searchResults.length) gameIds = [searchResults[0].id.toString()];
        } catch (error) {
          console.error(error);
        }
      }

      store.paths.push({ path, gameIds, exists: true });
      added++;
    })
  );

  await savePaths(store.paths);

  const newGameIds = store.paths.reduce(
    (prev, current) => [
      ...prev,
      ...current.gameIds.filter(
        (id) => !store.games.find((game) => game.id === id)
      ),
    ],
    [] as string[]
  );

  const newGames = await fetchIgdbGames(newGameIds);
  newGames.forEach((game) => {
    store.games.push(game);
    fetched++;
  });

  await saveGames(store.games);

  return {
    added,
    identified,
    removed,
    fetched,
  };
};
