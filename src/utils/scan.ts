import { useMutation } from "@tanstack/react-query";
import { getCollections } from "../stores/collections";
import { showSuccessToast } from "./toast";

export const scanPaths = async () => {
  const collections = await getCollections();
  const rootDirectories = collections.flatMap((c) => c.roots);

  console.log(rootDirectories);
};

export const useScanPaths = () =>
  useMutation(scanPaths, {
    onSuccess: () => {
      showSuccessToast("Paths scanned");
    },
  });
