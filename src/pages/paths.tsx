import { Badge, Box, Button, Group, Tooltip } from "@mantine/core";
import { useViewportSize } from "@mantine/hooks";
import { sep } from "@tauri-apps/api/path";
import { DataGrid, stringFilterFn } from "mantine-data-grid";
import { Path } from "../stores/paths";
import { usePaths } from "../utils/query";

const PathsPage = () => {
  const { data: paths } = usePaths();
  const { height } = useViewportSize();

  return (
    <DataGrid
      sx={{
        table: {
          tableLayout: "fixed",
          width: "100% !important",
          thead: { zIndex: 1 },
          "td>:nth-of-type(1),th>:nth-of-type(1)": { width: "100% !important" },
          "tr>:nth-of-type(1)": { width: "100% !important" },
          "tr>:nth-of-type(2)": { width: "100% !important" },
          "tr>:nth-of-type(3)": { width: "100% !important" },
          "tr>:nth-of-type(4)": { width: "90px !important" },
          "tr:hover button": { visibility: "visible" },
        },
        ".mantine-ScrollArea-scrollbar": { zIndex: 2 },
      }}
      data={paths!!}
      height={height - 80}
      noFelxLayout
      highlightOnHover
      withFixedHeader
      withGlobalFilter
      withColumnFilters
      withSorting
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
          cell: () => (
            <Button className="button" sx={{ visibility: "hidden" }}>
              Edit
            </Button>
          ),
        },
      ]}
    />
  );
};

export default PathsPage;
