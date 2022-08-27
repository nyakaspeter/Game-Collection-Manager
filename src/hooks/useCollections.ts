import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { Collection, getCollections } from "../stores/collections";

export const useCollections = () => useQuery(["collections"], getCollections);
