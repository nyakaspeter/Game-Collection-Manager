import { loadStore } from "../utils/store";

export interface Path {
  path: string;
  exists: boolean;
  gameIds: string[];
}

const defaultPaths: Path[] = [];

export const pathsKey = "paths";

export const pathsStore = await loadStore(pathsKey, defaultPaths);

export const getPaths = async () => {
  return (await pathsStore.get<Path[]>(pathsKey))!!;
};

export const setPaths = async (value: Path[]) => {
  await pathsStore.set(pathsKey, value);
};

export const savePaths = async () => {
  await pathsStore.save();
};
