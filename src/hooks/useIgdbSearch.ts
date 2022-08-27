import { useQuery } from "@tanstack/react-query";
import { searchIgdb } from "../utils/igdb/search";

export const useIgdbSearch = (query: string) =>
  useQuery(
    ["igdbSearch", query],
    async () => {
      return await searchIgdb(query);
    },
    {
      suspense: false,
      retry: false,
      select: (results) =>
        results.map((result) => ({
          value: result.id.toString(),
          label: result.displayName,
        })),
    }
  );
