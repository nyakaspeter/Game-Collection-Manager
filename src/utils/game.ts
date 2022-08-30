import { Game } from "../store/games";
import genres from "../data/genres.json";
import platforms from "../data/platforms.json";
import perspectives from "../data/player_perspectives.json";
import themes from "../data/themes.json";
import modes from "../data/game_modes.json";

export enum Website {
  Official = 1,
  Wikia = 2,
  Wikipedia = 3,
  Facebook = 4,
  Twitter = 5,
  Twitch = 6,
  Instagram = 8,
  Youtube = 9,
  Iphone = 10,
  Ipad = 11,
  Android = 12,
  Steam = 13,
  Reddit = 14,
  Itch = 15,
  Epicgames = 16,
  Gog = 17,
  Discord = 18,
}

export const getGameLabel = (
  game: Game,
  year: boolean = true,
  platforms: boolean = false,
  genres: boolean = false,
  themes: boolean = false,
  score: boolean = false
) => {
  let label = game.name;

  if (year && game.releaseDate) label += ` (${game.releaseDate.split("-")[0]})`;
  if (platforms && game.platforms)
    label += ` (${getGamePlatforms(game).join(", ")})`;
  if (genres && game.genres) label += ` (${getGameGenres(game).join(", ")})`;
  if (themes && game.themes) label += ` (${getGameThemes(game).join(", ")})`;
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

export const getGamePerspectives = (game: Game) => {
  const gamePerspectives: string[] = [];
  game.perspectives?.forEach((id) => {
    const perspective = perspectives.find(
      (perspective) => perspective.id === id
    );
    if (perspective)
      gamePerspectives.push(perspective.short || perspective.name);
  });
  return gamePerspectives;
};

export const getGameThemes = (game: Game) => {
  const gameThemes: string[] = [];
  game.genres?.forEach((id) => {
    const theme = themes.find((theme) => theme.id === id);
    if (theme) gameThemes.push(theme.short || theme.name);
  });
  return gameThemes;
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
