import { MutationOptions, useMutation } from "@tanstack/react-query";
import { removeUnusedData } from "../utils/scan";
import { toast } from "../utils/toast";

export const useRemoveUnusedData = (
  options?: MutationOptions<{ removedGames: number }, unknown, void, unknown>
) =>
  useMutation(removeUnusedData, {
    ...options,
    onSuccess: (data, variables, context) => {
      const { removedGames } = data;
      toast.success("Database cleaned", `Removed ${removedGames} old games`);

      if (options?.onSuccess) options.onSuccess(data, variables, context);
    },
  });
