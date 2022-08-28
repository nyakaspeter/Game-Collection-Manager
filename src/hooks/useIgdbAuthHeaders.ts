import { useQuery } from "@tanstack/react-query";
import { fetchIgdbAuthHeaders, IgdbAuthHeaders } from "../utils/igdb/auth";
import { queryClient } from "../utils/query";
import { toast } from "../utils/toast";

const key = "igdbAuthHeaders";

export const useIgdbAuthHeaders = () =>
  useQuery([key], fetchIgdbAuthHeaders, {
    retry: false,
    staleTime: Infinity,
    onError: () => {
      toast.error(
        "Twitch auth failed",
        "Please check your credentials in settings"
      );
    },
  });

export const getIgdbAuthHeaders = () =>
  queryClient.getQueryData<IgdbAuthHeaders>([key]);

export const refreshIgdbAuthHeaders = async () => {
  await queryClient.refetchQueries([key]);
};
