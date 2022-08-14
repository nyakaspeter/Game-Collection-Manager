import { useJson } from "~~/utils/json";

export default defineEventHandler(async (event) => {
  const games = await useJson("games");
  return games.data;
});
