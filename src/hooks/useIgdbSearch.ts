import { useQuery } from "@tanstack/react-query";
import { searchIgdbGames } from "../utils/igdb/search";

const key = "igdbSearch";

export const useIgdbSearch = (query: string) =>
  useQuery([key, query], async () => await searchIgdbGames(query), {
    retry: false,
    staleTime: Infinity,
  });
