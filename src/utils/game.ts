import { Game } from "../stores/games";

export const getGameLabel = (game: Game) => {
  let label = game.name;
  const releaseDate = game.releaseDate?.split("-")[0];
  if (releaseDate) label += ` (${releaseDate})`;
  return label;
};
