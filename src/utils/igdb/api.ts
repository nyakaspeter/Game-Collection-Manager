import { Body, fetch } from "@tauri-apps/api/http";
import { splitEvery } from "rambda";
import { store } from "../../store";
import { Game } from "../../store/games";

interface IgdbGameResponse {
  id: number;
  name: string;
  slug: string;
  category?: number;
  summary?: string;
  total_rating?: number;
  first_release_date?: number;
  platforms?: number[];
  genres?: number[];
  game_modes?: number[];
  cover?: { image_id: string };
  artworks?: { image_id: string }[];
  screenshots?: { image_id: string }[];
  videos?: { name: string; video_id: string }[];
}

interface IgdbIdWithParent {
  id: number;
  version_parent?: number;
}

const mapGameData = (game: IgdbGameResponse): Game => ({
  id: game.id.toString(),
  name: game.name,
  slug: game.slug,
  category: game.category,
  summary: game.summary,
  rating: game.total_rating,
  releaseDate: game.first_release_date
    ? new Date(game.first_release_date * 1000).toISOString()
    : undefined,
  platforms: game.platforms,
  genres: game.genres,
  gameModes: game.game_modes,
  cover: game.cover?.image_id || undefined,
  artworks: game.artworks?.map((artwork) => artwork.image_id) || undefined,
  screenshots:
    game.screenshots?.map((screenshot) => screenshot.image_id) || undefined,
  videos:
    game.videos?.map((video) => ({
      name: video.name,
      id: video.video_id,
    })) || undefined,
});

export const fetchIgdbGames = async (ids: string[], slugs: string[] = []) => {
  if (!store.authHeaders) throw new Error("Twitch credentials missing");

  const fields = [
    "name",
    "slug",
    "category",
    "summary",
    "total_rating",
    "first_release_date",
    "platforms",
    "genres",
    "game_modes",
    "cover.*",
    "artworks.*",
    "screenshots.*",
    "videos.*",
  ];

  const fieldsString = fields.join(",");

  const idsAndSlugs = [
    ...ids.map((id) => ({ type: "id", value: id })),
    ...slugs.map((slug) => ({ type: "slug", value: slug })),
  ];

  const games: Game[] = [];
  const chunks = splitEvery(100, idsAndSlugs);

  for (const chunk of chunks) {
    const idsString = chunk
      .filter((id) => id.type === "id")
      .map((id) => id.value)
      .join(",");

    const slugsString = chunk
      .filter((id) => id.type === "slug")
      .map((id) => `"${id.value}"`)
      .join(",");

    const idFilter = idsString.length && `id = (${idsString})`;
    const slugFilter = slugsString.length && `slug = (${slugsString})`;
    const filterString = [idFilter, slugFilter].filter((x) => !!x).join(" | ");
    const bodyString = `fields ${fieldsString}; where ${filterString}; limit 500;`;

    const response = await fetch<IgdbGameResponse[]>(
      "https://api.igdb.com/v4/games",
      {
        method: "POST",
        body: Body.text(bodyString),
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
