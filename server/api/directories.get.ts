import { useJson } from "~~/utils/json";

export default defineEventHandler(async (event) => {
  const directories = await useJson("directories");
  return directories.data.filter((dir) => dir.exists);
});
