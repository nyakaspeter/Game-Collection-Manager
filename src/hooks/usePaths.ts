import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { getCollections } from "../stores/collections";
import { getPaths, Path } from "../stores/paths";

interface PathWithCollections extends Path {
  collections: string[];
}

const getPathsWithCollections = async (): Promise<PathWithCollections[]> => {
  const paths = await getPaths();
  const collections = await getCollections();

  return paths
    .filter((p) => p.exists)
    .map((p) => ({
      ...p,
      collections: collections
        .filter((c) => c.roots.find((r) => p.path.startsWith(r)))
        .map((c) => c.name),
    }));
};

export const usePaths = (
  options?: Omit<UseQueryOptions<PathWithCollections[]>, "queryKey">
) =>
  useQuery<PathWithCollections[]>(["paths"], getPathsWithCollections, options);
