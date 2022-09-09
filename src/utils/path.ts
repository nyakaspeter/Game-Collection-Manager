import { openModal } from "@mantine/modals";
import { invoke } from "@tauri-apps/api";
import { readDir } from "@tauri-apps/api/fs";
import { sep } from "@tauri-apps/api/path";
import { createElement } from "react";
import { PathEditor } from "../components/PathEditor";
import { Path } from "../store/paths";

export const showPathEditor = (path: Path) => {
  const name = path.path.split(sep).pop();

  openModal({
    title: name,
    centered: true,
    size: "lg",
    children: createElement(PathEditor, { pathId: path.path }),
  });
};

export const openPathInExplorer = async (path: Path) => {
  let args = [path.path];

  try {
    await readDir(path.path);
  } catch {
    args = ["/select,", path.path];
  }

  invoke("exec_command", { process: "explorer", args: args });
};
