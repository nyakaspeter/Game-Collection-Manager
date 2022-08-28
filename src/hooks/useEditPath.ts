import { MutationOptions, useMutation } from "@tanstack/react-query";
import { store } from "../store";
import { saveGames } from "../store/games";
import { Path, savePaths } from "../store/paths";
import { fetchIgdbGames } from "../utils/igdb/api";
import { toast } from "../utils/toast";

export const useEditPath = (
  path?: Path,
  options?: MutationOptions<void, unknown, string[], unknown>
) =>
  useMutation(
    async (igdbIds: string[]) => {
      const igdbGames = await fetchIgdbGames(igdbIds);

      igdbGames.forEach((igdbGame) => {
        if (!store.games.find((game) => game.id === igdbGame.id))
          store.games.push(igdbGame);
      });

      const edited = store.paths.find((p) => p.path === path?.path);
      if (edited) edited.gameIds = igdbIds;

      await saveGames(store.games);
      await savePaths(store.paths);
    },
    {
      ...options,
      onError: (error, variables, context) => {
        toast.error(
          "Data fetching failed",
          "Failed to fetch game data from IGDB"
        );

        if (options?.onError) options.onError(error, variables, context);
      },
    }
  );
