import { openModal } from "@mantine/modals";
import { createElement } from "react";
import placeholder1 from "../assets/placeholder1.png";
import placeholder2 from "../assets/placeholder2.png";
import placeholder3 from "../assets/placeholder3.png";
import placeholder4 from "../assets/placeholder4.png";
import { GameDetails } from "../components/GameDetails";
import modes from "../data/game_modes.json";
import genres from "../data/genres.json";
import platforms from "../data/platforms.json";
import { Game, GameListItem } from "../store/games";

const placeholders = [placeholder1, placeholder2, placeholder3, placeholder4];

export const showGameDetails = (game: Game) => {
  openModal({
    centered: true,
    size: "min(80%, 1200px)",
    children: createElement(GameDetails, { gameId: game.id }),
  });
};

export const getGameLabel = (
  game: Game,
  year: boolean = true,
  platforms: boolean = false,
  genres: boolean = false,
  score: boolean = false
) => {
  let label = game.name;

  if (year && game.releaseDate) label += ` (${game.releaseDate.split("-")[0]})`;
  if (platforms && game.platforms)
    label += ` (${getGamePlatforms(game).join(", ")})`;
  if (genres && game.genres) label += ` (${getGameGenres(game).join(", ")})`;
  if (score && game.rating) label += ` (${Math.round(game.rating)}%)`;

  return label;
};

export const getGameYear = (game: Game) =>
  game.releaseDate && new Date(game.releaseDate).getFullYear();

export const getGameGenres = (game: Game) => {
  const gameGenres: string[] = [];
  game.genres?.forEach((id) => {
    const genre = genres.find((genre) => genre.id === id);
    if (genre) gameGenres.push(genre.short || genre.name);
  });
  return gameGenres;
};

export const getGamePlatforms = (game: Game) => {
  const gamePlatforms: string[] = [];
  game.platforms?.forEach((id) => {
    const platform = platforms.find((platform) => platform.id === id);
    if (platform) gamePlatforms.push(platform.short || platform.name);
  });
  return gamePlatforms;
};

export const getGameModes = (game: Game) => {
  const gameModes: string[] = [];
  game.gameModes?.forEach((id) => {
    const mode = modes.find((mode) => mode.id === id);
    if (mode) gameModes.push(mode.short || mode.name);
  });
  return gameModes;
};

export const getGameRating = (game: Game) =>
  game.rating && Math.round(game.rating);

export const getGameCover = (game: Game) =>
  game.cover
    ? `https://images.igdb.com/igdb/image/upload/t_cover_big/${game.cover}.jpg`
    : placeholders[parseInt(game.id) % 4];

export const getGameReady = (game: GameListItem) => {
  for (const collection of game.collections) {
    if (collection.readyToPlay) return true;
  }

  return false;
};
