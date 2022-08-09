import { getScanPathsDb } from "~~/utils/db";

export default defineEventHandler(async (event) => {
  const scanPaths = await getScanPathsDb();
  return scanPaths.data;
});
