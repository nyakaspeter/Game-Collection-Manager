import { getGamesDb } from "~~/utils/db";

export default defineEventHandler(async (event) => {
  const { slug } = event.context.params;
  const games = await getGamesDb();
  return games.data.find((game) => game.slug === (slug as string));
});
