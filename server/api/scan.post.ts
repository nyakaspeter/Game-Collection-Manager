import fs from "fs";
import path from "path";
import { getIgdbGames } from "~~/utils/igdbApi";
import { getIgdbIds } from "~~/utils/igdbSearch";
import { Directory, useJson } from "~~/utils/json";

interface ScanResults {
  addedDirs: number;
  identifiedDirs: number;
  removedDirs: number;
  fetchedGames: number;
}

const getSubDirectories = async (source: string): Promise<Directory[]> =>
  (await fs.promises.readdir(source, { withFileTypes: true }))
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => {
      return {
        name: dirent.name,
        path: path.join(source, dirent.name),
        exists: true,
        games: [],
      };
    });

export default defineEventHandler(async (event): Promise<ScanResults> => {
  const games = await useJson("games");
  const directories = await useJson("directories");
  const settings = await useJson("settings");

  const { scanPaths, twitchApiClientId, twitchApiClientSecret } = settings.data;

  const subDirs = (
    await Promise.all(scanPaths.map((path) => getSubDirectories(path)))
  ).flat();

  let addedDirs = 0;
  let identifiedDirs = 0;
  let removedDirs = directories.data.filter((dir) => dir.exists).length;

  directories.data.forEach((dir) => (dir.exists = false));

  for await (const subDir of subDirs) {
    const existing = directories.data.find((dir) => dir.path === subDir.path);
    if (existing) {
      existing.exists = true;
      removedDirs--;
      continue;
    }

    const sameName = directories.data.find((dir) => dir.name === subDir.name);

    subDir.games = sameName?.games || [(await getIgdbIds(subDir.name)).slug];
    if (subDir.games.length) identifiedDirs++;
    directories.data.push(subDir);
    addedDirs++;
  }

  const directoriesGameSlugs = directories.data.flatMap((dir) => dir.games);
  const newGameSlugs = directoriesGameSlugs.filter(
    (slug) => !games.data.find((game) => game.slug === slug)
  );

  const igdbGames = await getIgdbGames(newGameSlugs, {
    twitchApiClientId,
    twitchApiClientSecret,
  });
  igdbGames.forEach((game) => games.data.push(game));

  await directories.write();
  await games.write();

  return {
    addedDirs,
    identifiedDirs,
    removedDirs,
    fetchedGames: igdbGames.length,
  };
});
