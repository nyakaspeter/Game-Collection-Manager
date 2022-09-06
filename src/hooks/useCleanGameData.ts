import { MutationOptions, useMutation } from "@tanstack/react-query";
import { cleanGameData } from "../utils/scan";
import { toast } from "../utils/toast";

export const useCleanGameData = (
  options?: MutationOptions<{ removedGames: number }, unknown, void, unknown>
) =>
  useMutation(cleanGameData, {
    ...options,
    onSuccess: (data, variables, context) => {
      const { removedGames } = data;
      toast.success("Database cleaned", `Removed ${removedGames} old games`);

      if (options?.onSuccess) options.onSuccess(data, variables, context);
    },
  });
