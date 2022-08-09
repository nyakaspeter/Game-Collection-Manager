import { getDirectoriesDb, getGamesDb, getScanPathsDb } from "~~/utils/db";
import { getSubDirectories } from "~~/utils/fs";
import { getIgdbGames } from "~~/utils/igdbApi";
import { getIgdbIds } from "~~/utils/igdbSearch";

export default defineEventHandler(async (event) => {
  const scanPaths = await getScanPathsDb();
  const subDirs = (
    await Promise.all(scanPaths.data.map((path) => getSubDirectories(path)))
  ).flat();

  const directories = await getDirectoriesDb();
  const prevDirs = directories.data.filter(
    (dir) =>
      scanPaths.data.find((path) => dir.path.startsWith(path)) && dir.exists
  );

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

  const games = await getGamesDb();
  const directoriesGameSlugs = directories.data.flatMap((dir) => dir.games);
  const newGameSlugs = directoriesGameSlugs.filter(
    (slug) => !games.data.find((game) => game.slug === slug)
  );

  const igdbGames = await getIgdbGames(newGameSlugs);
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
