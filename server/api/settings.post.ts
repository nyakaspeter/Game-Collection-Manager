import { Settings, useJson } from "~~/utils/json";

export default defineEventHandler(async (event) => {
  const body: Settings = await useBody(event);
  const settings = await useJson("settings");
  settings.data = body;
  await settings.write();
  return settings.data;
});
