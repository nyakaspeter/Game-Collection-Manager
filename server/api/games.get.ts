import { useJson } from "~~/utils/json";

export default defineEventHandler(async (event) => {
  const games = await useJson("games");
  const directories = await useJson("directories");
  return games.data.filter((game) =>
    directories.data.find((dir) => dir.exists && dir.games.includes(game.slug))
  );
});
