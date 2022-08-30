import { fetch } from "@tauri-apps/api/http";
import { uniq } from "rambda";
import { Game } from "../../store/games";
import { fetchIgdbGames, fetchIgdbGamesBySlug } from "./api";

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

export const searchIgdb = async (query: string): Promise<Game[]> => {
  const sanitizedQuery = query.replace(/[^0-9a-z]/gi, " ").replace(/  +/g, " ");
  if (!sanitizedQuery) return [];

  const response = await fetch<IgdbSearchResponse>(
    `https://www.igdb.com/search_autocomplete_all?q=${sanitizedQuery}`
  );

  if (!response.ok) return [];

  const igdbIds = response.data?.game_suggest.map((g) => g.id.toString()) || [];

  try {
    return uniq([
      ...(await fetchIgdbGamesBySlug([query])),
      ...(await fetchIgdbGames(igdbIds)),
    ]);
  } catch (error) {
    console.error(error);
    return [];
  }
};
