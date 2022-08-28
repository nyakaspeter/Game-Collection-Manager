import { Body, fetch } from "@tauri-apps/api/http";
import { splitEvery } from "rambda";
import { store } from "../../store";
import { Game } from "../../store/games";

interface IgdbGameResponse {
  id: number;
  name: string;
  slug: string;
  summary?: string;
  storyline?: string;
  total_rating?: number;
  first_release_date?: number;
  platforms?: {
    name: string;
    slug: string;
    abbreviation: string;
  }[];
  genres?: {
    name: string;
    slug: string;
  }[];
  franchises?: {
    name: string;
    slug: string;
  }[];
  themes?: {
    name: string;
    slug: string;
  }[];
  game_modes?: {
    name: string;
    slug: string;
  }[];
  multiplayer_modes?: {
    campaigncoop?: boolean;
    dropin?: boolean;
    lancoop?: boolean;
    offlinecoop?: boolean;
    offlinecoopmax?: number;
    offlinemax?: number;
    onlinecoop?: number;
    onlinecoopmax?: number;
    onlinemax?: number;
    splitscreen?: boolean;
    splitscreenonline?: boolean;
  }[];
  player_perspectives?: {
    name: string;
    slug: string;
  }[];
  game_engines?: {
    name: string;
    slug: string;
  }[];
  cover?: { image_id: string };
  artworks?: { image_id: string }[];
  screenshots?: { image_id: string }[];
  videos?: { name: string; video_id: string }[];
  websites?: {
    category: number;
    url: string;
  }[];
}

interface IgdbIdWithParent {
  id: number;
  version_parent?: number;
}

const mapGameData = (game: IgdbGameResponse): Game => ({
  id: game.id.toString(),
  name: game.name,
  slug: game.slug,
  summary: game.summary,
  storyline: game.storyline,
  rating: game.total_rating,
  releaseDate: game.first_release_date
    ? new Date(game.first_release_date * 1000).toISOString()
    : undefined,
  platforms:
    game.platforms?.map((platform) => ({
      name: platform.name,
      slug: platform.slug,
      abbreviation: platform.abbreviation,
    })) || undefined,
  genres:
    game.genres?.map((genre) => ({
      name: genre.name,
      slug: genre.slug,
    })) || undefined,
  franchises:
    game.franchises?.map((franchise) => ({
      name: franchise.name,
      slug: franchise.slug,
    })) || undefined,
  themes:
    game.themes?.map((theme) => ({
      name: theme.name,
      slug: theme.slug,
    })) || undefined,
  gameModes:
    game.game_modes?.map((gameMode) => ({
      name: gameMode.name,
      slug: gameMode.slug,
    })) || undefined,
  multiplayerModes:
    game.multiplayer_modes?.map((mode) => ({
      campaigncoop: mode.campaigncoop,
      dropin: mode.dropin,
      lancoop: mode.lancoop,
      offlinecoop: mode.offlinecoop,
      offlinecoopmax: mode.offlinecoopmax,
      offlinemax: mode.offlinemax,
      onlinecoop: mode.onlinecoop,
      onlinecoopmax: mode.onlinecoopmax,
      onlinemax: mode.onlinemax,
      splitscreen: mode.splitscreen,
      splitscreenonline: mode.splitscreenonline,
    })) || undefined,
  perspectives:
    game.player_perspectives?.map((perspective) => ({
      name: perspective.name,
      slug: perspective.slug,
    })) || undefined,
  gameEngines:
    game.game_engines?.map((engine) => ({
      name: engine.name,
      slug: engine.slug,
    })) || undefined,
  cover: game.cover?.image_id || undefined,
  artworks: game.artworks?.map((artwork) => artwork.image_id) || undefined,
  screenshots:
    game.screenshots?.map((screenshot) => screenshot.image_id) || undefined,
  videos:
    game.videos?.map((video) => ({
      name: video.name,
      id: video.video_id,
    })) || undefined,
  websites:
    game.websites?.map((website) => ({
      category: website.category,
      url: website.url,
    })) || undefined,
});

export const fetchIgdbGames = async (ids: string[]) => {
  if (!store.authHeaders) throw new Error("Twitch credentials missing");

  const fields = [
    "name",
    "slug",
    "summary",
    "storyline",
    "total_rating",
    "first_release_date",
    "platforms.*",
    "genres.*",
    "themes.*",
    "franchises.*",
    "game_engines.*",
    "game_modes.*",
    "multiplayer_modes.*",
    "player_perspectives.*",
    "cover.*",
    "artworks.*",
    "screenshots.*",
    "videos.*",
    "websites.*",
  ];
  const fieldsString = fields.join(",");

  const games: Game[] = [];
  const chunks = splitEvery(100, ids);

  for (const ids of chunks) {
    const idsString = ids.join(",");

    const response = await fetch<IgdbGameResponse[]>(
      "https://api.igdb.com/v4/games",
      {
        method: "POST",
        body: Body.text(
          `fields ${fieldsString}; where id = (${idsString}); limit 500;`
        ),
        headers: store.authHeaders,
      }
    );

    if (!response.ok) throw new Error("Downloading game data failed");

    response.data?.forEach((game) => games.push(mapGameData(game)));
  }

  return games;
};

export const fetchIgdbVersionParents = async (ids: string[]) => {
  if (!store.authHeaders) throw new Error("Twitch credentials missing");

  const idsWithParents: IgdbIdWithParent[] = [];
  const chunks = splitEvery(100, ids);

  for (const ids of chunks) {
    const idsString = ids.join(",");

    const response = await fetch<IgdbIdWithParent[]>(
      "https://api.igdb.com/v4/games",
      {
        method: "POST",
        body: Body.text(
          `fields version_parent; where id = (${idsString}); limit 500;`
        ),
        headers: store.authHeaders,
      }
    );

    if (!response.ok) throw new Error("Downloading game data failed");

    idsWithParents.push(...response.data);
  }

  return idsWithParents;
};
