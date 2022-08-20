import { uniq } from "rambda";
import { getCollections } from "../stores/collections";
import { getPaths, savePaths, setPaths } from "../stores/paths";
import { getSubPaths } from "./fs";

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

  for await (const path of newPaths) {
    paths.push({ path, exists: true, gameIds: [] });
    added++;
  }

  setPaths(paths);
  savePaths();

  return {
    added,
    identified,
    removed,
  };
};
