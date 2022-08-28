import { MutationOptions, useMutation } from "@tanstack/react-query";
import { store } from "../store";
import { Collection, saveCollections } from "../store/collections";
import { saveSettings, Settings } from "../store/settings";
import { toast } from "../utils/toast";

export const useEditSettings = (
  options?: MutationOptions<
    void,
    unknown,
    {
      settings?: Settings | undefined;
      collections?: Collection[] | undefined;
    },
    unknown
  >
) =>
  useMutation(
    async ({
      settings,
      collections,
    }: {
      settings?: Settings;
      collections?: Collection[];
    }) => {
      if (settings) store.settings = settings;
      if (collections) store.collections = collections;

      await saveSettings(store.settings);
      await saveCollections(store.collections);
    },
    {
      ...options,
      onSuccess: (data, variables, context) => {
        toast.success(
          "Settings saved",
          "Settings and collections have been saved"
        );

        if (options?.onSuccess) options.onSuccess(data, variables, context);
      },
    }
  );
