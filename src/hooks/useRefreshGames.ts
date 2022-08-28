import { MutationOptions, useMutation } from "@tanstack/react-query";
import { refreshGames } from "../utils/scan";
import { toast } from "../utils/toast";

export const useRefreshGames = (
  options?: MutationOptions<
    {
      refreshed: number;
    },
    unknown,
    void,
    unknown
  >
) =>
  useMutation(refreshGames, {
    ...options,
    onSuccess: (data, variables, context) => {
      const { refreshed } = data;
      toast.success("Games refreshed", `Refreshed data of ${refreshed} games`);

      if (options?.onSuccess) options.onSuccess(data, variables, context);
    },
    onError: (error, variables, context) => {
      toast.error("Refresh failed", "Failed to fetch game data from IGDB");

      if (options?.onError) options.onError(error, variables, context);
    },
  });
