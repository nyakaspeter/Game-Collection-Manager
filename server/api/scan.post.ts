import fs from "fs";
import path from "path";
import { getIgdbGames } from "~~/utils/igdbApi";
import { getIgdbIds } from "~~/utils/igdbSearch";
import { Directory, useJson } from "~~/utils/json";

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

export default defineEventHandler(async (event) => {
  const games = await useJson("games");
  const directories = await useJson("directories");
  const settings = await useJson("settings");

  const { scanPaths, twitchApiClientId, twitchApiClientSecret } = settings.data;

  const subDirs = (
    await Promise.all(scanPaths.map((path) => getSubDirectories(path)))
  ).flat();

  const prevDirs = directories.data.filter((dir) => dir.exists);
  prevDirs.forEach((dir) => (dir.exists = false));

  let addedDirs = 0;
  let identifiedDirs = 0;
  let removedDirs = prevDirs.length;

  for await (const subDir of subDirs) {
    const prevDir = prevDirs.find((dir) => dir.path === subDir.path);
    if (prevDir) {
      prevDir.exists = true;
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
