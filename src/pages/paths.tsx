import { Badge, Box, Button, Group } from "@mantine/core";
import { useViewportSize } from "@mantine/hooks";
import { sep } from "@tauri-apps/api/path";
import { DataGrid, stringFilterFn } from "mantine-data-grid";
import { Path } from "../stores/paths";
import { usePaths } from "../utils/query";

const PathsPage = () => {
  const { data: paths } = usePaths();
  const { height } = useViewportSize();

  return (
    <Box>
      <DataGrid
        sx={{
          table: {
            tableLayout: "fixed",
            width: "calc(100% - 32px) !important",
          },
          ["tr>:nth-child(4)"]: { width: "100px !important" },
          ["td,th"]: {
            width: "unset !important",
          },
        }}
        data={paths!!}
        withGlobalFilter
        withColumnFilters
        withSorting
        withFixedHeader
        highlightOnHover
        noFelxLayout
        height={height - 80}
        columns={[
          {
            header: "Name",

            filterFn: stringFilterFn,
            accessorFn: (path: Path) => path.path.split(sep).pop(),
          },
          {
            header: "Location",

            filterFn: stringFilterFn,
            accessorFn: (path: Path) =>
              path.path.split(sep).slice(0, -1).join(sep),
          },
          {
            header: "Collections",

            enableSorting: false,
            accessorKey: "collections",
            cell: (cell) => (
              <Group spacing={4}>
                {(cell.getValue() as string[]).map((collection, index) => (
                  <Badge key={index}>{collection}</Badge>
                ))}
              </Group>
            ),
          },
          {
            id: "button",
            header: "",
            enableResizing: false,
            cell: () => <Button>asdasd</Button>,
          },
        ]}
      />
    </Box>
  );
};

export default PathsPage;
