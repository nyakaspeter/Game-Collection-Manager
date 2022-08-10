import { getSettingsDb } from "~~/utils/db";

export default defineEventHandler(async (event) => {
  const settings = await getSettingsDb();
  return settings.data;
});
