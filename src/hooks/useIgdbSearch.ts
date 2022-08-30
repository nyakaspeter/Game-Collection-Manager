import { useQuery } from "@tanstack/react-query";
import { searchIgdb } from "../utils/igdb/search";

const key = "igdbSearch";

export const useIgdbSearch = (query: string) =>
  useQuery([key, query], async () => await searchIgdb(query), {
    retry: false,
    staleTime: Infinity,
  });
