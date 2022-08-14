import { useJson } from "~~/utils/json";

export default defineEventHandler(async (event) => {
  const settings = await useJson("settings");
  return settings.data;
});
