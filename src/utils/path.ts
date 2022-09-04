import { invoke } from "@tauri-apps/api";
import { readDir } from "@tauri-apps/api/fs";
import { Path } from "../store/paths";

export const openPathInExplorer = async (path: Path) => {
  let args = [path.path];

  try {
    await readDir(path.path);
  } catch {
    args = ["/select,", path.path];
  }

  invoke("exec_command", { process: "explorer", args: args });
};
