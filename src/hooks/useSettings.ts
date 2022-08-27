import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { getSettings, Settings } from "../stores/settings";

export const useSettings = () => useQuery(["settings"], getSettings);
