import { fetch } from "@tauri-apps/api/http";

interface IgdbIds {
  id?: number;
  slug?: string;
}

interface IgdbSearchResults {
  game_suggest: Array<{
    id: number;
    score: number;
    name: string;
    value: string;
    url: string;
  }>;
}

export const getIgdbIds = async (dirName: string): Promise<IgdbIds> => {
  const sanitizedDirName = dirName
    .replace(/[^0-9a-z]/gi, " ")
    .replace(/  +/g, " ");

  const searchResults = await fetch<IgdbSearchResults>(
    `https://www.igdb.com/search_autocomplete_all?q=${sanitizedDirName}`
  );

  const firstResult = searchResults?.data.game_suggest?.length
    ? searchResults.data.game_suggest[0]
    : undefined;

  return {
    id: firstResult?.id,
    slug: firstResult?.url?.split("/").pop(),
  };
};
