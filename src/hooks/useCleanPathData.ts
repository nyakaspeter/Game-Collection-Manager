import { MutationOptions, useMutation } from "@tanstack/react-query";
import { cleanPathData } from "../utils/scan";
import { toast } from "../utils/toast";

export const useCleanPathData = (
  options?: MutationOptions<{ removedPaths: number }, unknown, void, unknown>
) =>
  useMutation(cleanPathData, {
    ...options,
    onSuccess: (data, variables, context) => {
      const { removedPaths } = data;
      toast.success("Database cleaned", `Removed ${removedPaths} old paths`);

      if (options?.onSuccess) options.onSuccess(data, variables, context);
    },
  });
