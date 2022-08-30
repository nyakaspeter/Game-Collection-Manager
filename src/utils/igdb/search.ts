import { fetch } from "@tauri-apps/api/http";
import { uniq } from "rambda";
import { Game } from "../../store/games";
import { fetchIgdbGames } from "./api";

export interface IgdbSearchResult {
  id: number;
  slug: string;
  name: string;
  displayName: string;
}

interface IgdbSearchResponse {
  game_suggest: Array<{
    id: number;
    score: number;
    name: string;
    value: string;
    url: string;
  }>;
}

export const searchIgdbIds = async (
  query: string
): Promise<IgdbSearchResult[]> => {
  const sanitizedQuery = query.replace(/[^0-9a-z]/gi, " ").replace(/  +/g, " ");
  if (!sanitizedQuery) return [];

  const response = await fetch<IgdbSearchResponse>(
    `https://www.igdb.com/search_autocomplete_all?q=${sanitizedQuery}`
  );

  return (
    response.data?.game_suggest?.map((g) => ({
      id: g.id,
      slug: g.url.split("/").pop() || "",
      name: g.name,
      displayName: g.value,
    })) || []
  );
};

export const searchIgdbGames = async (query: string): Promise<Game[]> => {
  const sanitizedQuery = query.replace(/[^0-9a-z]/gi, " ").replace(/  +/g, " ");
  if (!sanitizedQuery) return [];

  const response = await fetch<IgdbSearchResponse>(
    `https://www.igdb.com/search_autocomplete_all?q=${sanitizedQuery}`
  );

  const igdbIds =
    response.data?.game_suggest?.map((g) => g.id.toString()) || [];

  return await fetchIgdbGames(igdbIds, [query]);
};
