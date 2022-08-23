import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { getSettings, Settings } from "../stores/settings";

export const useSettings = (
  options?: Omit<UseQueryOptions<Settings>, "queryKey">
) => useQuery<Settings>(["settings"], getSettings, options);
