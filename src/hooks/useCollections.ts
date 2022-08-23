import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { Collection, getCollections } from "../stores/collections";

export const useCollections = (
  options?: Omit<UseQueryOptions<Collection[]>, "queryKey">
) => useQuery<Collection[]>(["collections"], getCollections, options);
