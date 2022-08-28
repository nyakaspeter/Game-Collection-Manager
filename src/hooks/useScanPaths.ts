import { MutationOptions, useMutation } from "@tanstack/react-query";
import { scanPaths } from "../utils/scan";
import { toast } from "../utils/toast";

let scanPromise: Promise<{
  added: number;
  identified: number;
  removed: number;
  fetched: number;
}> | null = null;

export const useScanPaths = (
  options?: MutationOptions<
    {
      added: number;
      identified: number;
      removed: number;
      fetched: number;
    },
    unknown,
    void,
    unknown
  >
) =>
  useMutation(
    async () => {
      if (!scanPromise) scanPromise = scanPaths();
      return await scanPromise;
    },
    {
      ...options,
      onSuccess: (data, variables, context) => {
        scanPromise = null;

        const { added, removed, fetched } = data;
        toast.success(
          "Paths scanned",
          `Found ${added} new paths, removed ${removed} old entries, and fetched data for ${fetched} games`
        );

        if (options?.onSuccess) options.onSuccess(data, variables, context);
      },
      onError: (error, variables, context) => {
        scanPromise = null;

        toast.error("Scan failed", "Failed to fetch game data from IGDB");

        if (options?.onError) options.onError(error, variables, context);
      },
    }
  );
