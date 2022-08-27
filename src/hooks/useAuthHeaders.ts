import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { getIgdbAuthHeaders, IgdbAuthHeaders } from "../utils/igdb/auth";
import { showToast } from "../utils/toast";

export const useAuthHeaders = () =>
  useQuery(["authHeaders"], getIgdbAuthHeaders, {
    suspense: false,
    retry: false,
    staleTime: Infinity,
    refetchInterval: 2 * 3600 * 1000,
    onError: () => {
      showToast(
        "error",
        "Twitch auth failed",
        "Please check credentials in settings"
      );
    },
  });
