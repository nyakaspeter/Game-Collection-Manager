import { Box } from "@mantine/core";
import { useElementSize, useViewportSize } from "@mantine/hooks";
import { dirname, sep } from "@tauri-apps/api/path";
import { booleanFilterFn, DataGrid, stringFilterFn } from "mantine-data-grid";
import { useMemo } from "react";
import { useCollections } from "../stores/collections";
import { Path, usePaths } from "../stores/paths";

const PathsPage = () => {
  const paths = usePaths();
  const collections = useCollections();
  const { height } = useViewportSize();

  const pathsWithCollections = useMemo(() => {
    return paths.data!!.map((p) => ({
      ...p,
      collections: collections
        .data!!.filter((c) => c.roots.find((r) => p.path.startsWith(r)))
        .map((c) => c.name),
    }));
  }, [paths.data, collections.data]);

  return (
    <Box>
      <DataGrid
        sx={{
          ["th"]: {
            width: "unset !important",
          },
        }}
        data={pathsWithCollections}
        withGlobalFilter
        withColumnFilters
        withFixedHeader
        withColumnResizing
        highlightOnHover
        height={height - 80}
        columns={[
          {
            accessorFn: (path: Path) => path.path.split(sep).pop(),
            header: "Name",
            filterFn: stringFilterFn,
            size: 500,
          },
          {
            accessorKey: "path",
            header: "Path",
            filterFn: stringFilterFn,
            size: 400,
          },
          {
            accessorKey: "collections",
            header: "Collections",
            size: 200,
          },
          {
            accessorKey: "exists",
            header: "Exists",
            filterFn: booleanFilterFn,
            size: 80,
          },
        ]}
        initialState={{
          columnFilters: [{ id: "exists", value: { op: "eq", value: true } }],
        }}
      />
    </Box>
  );
};

export default PathsPage;
