import { getScanPathsDb } from "~~/utils/db";

export default defineEventHandler(async (event) => {
  const body: string[] = await useBody(event);
  const scanPaths = await getScanPathsDb();
  scanPaths.data = body;
  await scanPaths.write();
  return scanPaths.data;
});
