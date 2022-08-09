import { getDirectoriesDb, getScanPathsDb } from "~~/utils/db";

export default defineEventHandler(async (event) => {
  const directories = await getDirectoriesDb();
  return directories.data.filter((dir) => dir.exists);
});
