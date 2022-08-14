import { Directory, useJson } from "~~/utils/json";

export default defineEventHandler(async (event) => {
  const body: Directory = await useBody(event);
  const directories = await useJson("directories");
  const edited = directories.data.find((dir) => dir.path === body.path);
  edited.games = body.games;
  await directories.write();
  return directories.data;
});
