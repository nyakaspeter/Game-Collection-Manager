import { getSettingsDb, Settings } from "~~/utils/db";

export default defineEventHandler(async (event) => {
  const body: Settings = await useBody(event);
  const settings = await getSettingsDb();
  settings.data = body;
  await settings.write();
  return settings.data;
});
