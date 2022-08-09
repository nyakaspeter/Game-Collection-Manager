import { getGamesDb } from "~~/utils/db";

export default defineEventHandler(async (event) => {
  const games = await getGamesDb();
  return games.data;
});
