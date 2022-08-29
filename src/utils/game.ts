import { Game } from "../store/games";
import {
  game_modes,
  genres,
  platforms,
  player_perspectives,
  themes,
} from "./constants";

export const getGameLabel = (game: Game) => {
  let label = game.name;
  const releaseDate = game.releaseDate?.split("-")[0];
  if (releaseDate) label += ` (${releaseDate})`;
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
    if (platform) gamePlatforms.push(platform.name);
  });
  return gamePlatforms;
};

export const getGamePerspectives = (game: Game) => {
  const gamePerspectives: string[] = [];
  game.perspectives?.forEach((id) => {
    const perspective = player_perspectives.find(
      (perspective) => perspective.id === id
    );
    if (perspective) gamePerspectives.push(perspective.name);
  });
  return gamePerspectives;
};

export const getGameThemes = (game: Game) => {
  const gameThemes: string[] = [];
  game.genres?.forEach((id) => {
    const theme = themes.find((theme) => theme.id === id);
    if (theme) gameThemes.push(theme.name);
  });
  return gameThemes;
};

export const getGameModes = (game: Game) => {
  const gameModes: string[] = [];
  game.gameModes?.forEach((id) => {
    const mode = game_modes.find((mode) => mode.id === id);
    if (mode) gameModes.push(mode.short || mode.name);
  });
  return gameModes;
};

export const getGameRating = (game: Game) =>
  game.rating && Math.round(game.rating);
