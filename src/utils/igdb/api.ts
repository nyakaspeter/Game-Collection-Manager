import { Body, fetch } from "@tauri-apps/api/http";
import { splitEvery } from "rambda";
import { Game } from "../../stores/games";
import { queryClient } from "../query";
import { IgdbAuthHeaders } from "./auth";

interface IgdbGameResponse {
  id: number;
  name: string;
  slug: string;
  summary?: string;
  total_rating?: number;
  first_release_date?: number;
  genres?: {
    name: string;
    slug: string;
  }[];
  cover?: { image_id: string };
  artworks?: { image_id: string }[];
  screenshots?: { image_id: string }[];
  videos?: { name: string; video_id: string }[];
}

const mapGameData = (game: IgdbGameResponse): Game => ({
  id: game.id.toString(),
  name: game.name,
  slug: game.slug,
  summary: game.summary,
  rating: game.total_rating,
  releaseDate: game.first_release_date
    ? new Date(game.first_release_date * 1000).toISOString()
    : undefined,
  genres:
    game.genres?.map((genre) => ({
      name: genre.name,
      slug: genre.slug,
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
});

export const getIgdbGames = async (ids: string[]) => {
  const fields = [
    "name",
    "slug",
    "summary",
    "total_rating",
    "first_release_date",
    "genres.*",
    "cover.*",
    "artworks.*",
    "screenshots.*",
    "videos.*",
  ];
  const fieldsString = fields.join(",");
  const authHeaders = queryClient.getQueryData<IgdbAuthHeaders>([
    "authHeaders",
  ]);

  const games: Game[] = [];
  const chunks = splitEvery(100, ids);

  for (const ids of chunks) {
    try {
      const idsString = ids.join(",");

      const { data: igdbGames } = await fetch<IgdbGameResponse[]>(
        "https://api.igdb.com/v4/games",
        {
          method: "POST",
          body: Body.text(
            `fields ${fieldsString}; where id = (${idsString}); limit 500;`
          ),
          headers: authHeaders,
        }
      );

      igdbGames.forEach((game) => games.push(mapGameData(game)));
    } catch {}
  }

  return games;
};
