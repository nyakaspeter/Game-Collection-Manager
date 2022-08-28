import { useQuery } from "@tanstack/react-query";
import { searchIgdb } from "../utils/igdb/search";

const key = "igdbSearch";

export const useIgdbSearch = (query: string) =>
  useQuery([key, query], async () => await searchIgdb(query), {
    retry: false,
    staleTime: Infinity,
    select: (results) =>
      results.map((result) => ({
        value: result.id.toString(),
        label: result.displayName,
      })),
  });
