import { Badge, Box, Button, Group, Tooltip } from "@mantine/core";
import { useViewportSize } from "@mantine/hooks";
import { openModal } from "@mantine/modals";
import { sep } from "@tauri-apps/api/path";
import { DataGrid, stringFilterFn } from "mantine-data-grid";
import PathEditModal from "../components/PathEditModal";
import { usePaths } from "../hooks/usePaths";
import { Game } from "../stores/games";
import { Path } from "../stores/paths";
import { getGameLabel } from "../utils/game";

const PathsPage = () => {
  const { data: paths } = usePaths();
  const { height } = useViewportSize();

  const handleEdit = (path: Path) => {
    const name = path.path.split(sep).pop();

    openModal({
      title: name,
      centered: true,
      size: "lg",
      children: <PathEditModal path={path} />,
    });
  };

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
          "tr>:nth-of-type(3)": { width: "200px !important" },
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
        // {
        //   header: "Location",
        //   filterFn: stringFilterFn,
        //   accessorFn: (path: Path) =>
        //     path.path.split(sep).slice(0, -1).join(sep),
        // },
        {
          header: "Games",
          enableSorting: false,
          accessorKey: "games",
          cell: (cell) => (
            <Group spacing={4}>
              {(cell.getValue() as Game[]).map((game) => (
                <Badge key={game.id}>{getGameLabel(game)}</Badge>
              ))}
            </Group>
          ),
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
          accessorFn: (path: Path) => path,
          cell: (cell) => (
            <Button
              className="button"
              sx={{ visibility: "hidden" }}
              onClick={() => handleEdit(cell.getValue() as Path)}
            >
              Edit
            </Button>
          ),
        },
      ]}
    />
  );
};

export default PathsPage;
