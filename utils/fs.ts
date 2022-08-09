import fs from "fs";
import path from "path";

export interface Directory {
  name: string;
  path: string;
  exists: boolean;
  games: string[];
}

export const getSubDirectories = async (source: string): Promise<Directory[]> =>
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

export const createDataDirIfNeeded = async () => {
  try {
    await fs.promises.access("./data");
  } catch {
    await fs.promises.mkdir("./data");
  }
};
