import { getDirectoriesDb } from "~~/utils/db";
import { Directory } from "~~/utils/fs";

export default defineEventHandler(async (event) => {
  const body: Directory = await useBody(event);
  const directories = await getDirectoriesDb();
  const edited = directories.data.find((dir) => dir.path === body.path);
  edited.games = body.games;
  await directories.write();
  return edited;
});
