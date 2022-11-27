import { exists } from "@tauri-apps/api/fs";
import { resolve, resourceDir } from "@tauri-apps/api/path";

export const portableMode = await exists(
  await resolve(await resourceDir(), "PORTABLE")
);

export const getStorePath = async (file: string) =>
  portableMode ? await resolve(await resourceDir(), file) : file;
