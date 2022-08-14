import { useJson } from "~~/utils/json";

export default defineEventHandler(async (event) => {
  const { slug } = event.context.params;
  const games = await useJson("games");
  return games.data.find((game) => game.slug === (slug as string));
});
