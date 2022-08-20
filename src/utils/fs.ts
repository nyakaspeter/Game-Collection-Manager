import { readDir } from "@tauri-apps/api/fs";
import { extname } from "@tauri-apps/api/path";

export const getFileExtension = async (path: string) => {
  try {
    return await extname(path);
  } catch (error) {
    console.error(error);
    return "";
  }
};

export const getSubPaths = async (
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
