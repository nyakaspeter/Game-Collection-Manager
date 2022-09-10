import { MutationOptions, useMutation } from "@tanstack/react-query";
import { store } from "../store";
import { fetchIgdbAuthHeaders, IgdbAuthHeaders } from "../utils/igdb/auth";
import { toast } from "../utils/toast";

export const useRefreshAuthHeaders = (
  options?: MutationOptions<IgdbAuthHeaders, unknown, void, unknown>
) =>
  useMutation(fetchIgdbAuthHeaders, {
    retry: false,
    ...options,
    onSuccess: (data, variables, context) => {
      store.authHeaders = data;

      if (options?.onSuccess) options.onSuccess(data, variables, context);
    },
    onError: (error, variables, context) => {
      store.authHeaders = null;

      toast.error(
        "Twitch auth failed",
        "The Twitch API key is probably incorrect"
      );

      if (options?.onError) options.onError(error, variables, context);
    },
  });
