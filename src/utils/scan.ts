import { sep } from "@tauri-apps/api/path";
import { uniq } from "rambda";
import { getCollections } from "../stores/collections";
import { getGames, saveGames, setGames } from "../stores/games";
import { getPaths, savePaths, setPaths } from "../stores/paths";
import { getSubPaths } from "./fs";
import { getIgdbGames } from "./igdb/api";
import { searchIgdb } from "./igdb/search";

const scanCollectionPaths = async () => {
  let paths: string[] = [];
  const collections = await getCollections();

  for await (const collection of collections) {
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

  const paths = await getPaths();
  const scannedPaths = await scanCollectionPaths();
  const newPaths = scannedPaths.filter(
    (path) => !paths.find((p) => p.path === path)
  );

  for (const path of paths) {
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
      const sameName = paths.find((p) => p.path.endsWith(name!!));

      if (sameName) {
        gameIds = sameName.gameIds;
      } else {
        const searchResults = await searchIgdb(name!!);
        if (searchResults.length) gameIds = [searchResults[0].id.toString()];
      }

      paths.push({ path, gameIds, exists: true });
      added++;
    })
  );

  await setPaths(paths);
  await savePaths();

  const games = await getGames();
  const newGameIds = paths.reduce(
    (prev, current) => [
      ...prev,
      ...current.gameIds.filter((id) => !games.find((game) => game.id === id)),
    ],
    [] as string[]
  );

  const newGames = await getIgdbGames(newGameIds);
  newGames.forEach((game) => {
    games.push(game);
    fetched++;
  });

  await setGames(games);
  await saveGames();

  return {
    added,
    identified,
    removed,
    fetched,
  };
};
