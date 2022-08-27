import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { getGames } from "../stores/games";
import { getSettings, Settings } from "../stores/settings";

export const useGames = () => useQuery(["games"], getGames);
