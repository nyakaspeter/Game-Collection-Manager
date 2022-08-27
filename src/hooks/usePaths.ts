import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { getCollections } from "../stores/collections";
import { getGames } from "../stores/games";
import { getPaths, Path } from "../stores/paths";

export const usePaths = () =>
  useQuery(["paths"], async () => {
    const paths = await getPaths();
    const collections = await getCollections();
    const games = await getGames();

    return paths
      .filter((p) => p.exists)
      .map((p) => ({
        ...p,
        collections: collections
          .filter((c) => c.roots.find((r) => p.path.startsWith(r)))
          .map((c) => c.name),
        games: games.filter((g) => p.gameIds.includes(g.id)),
      }));
  });
