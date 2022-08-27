import { Badge, Button, Group } from "@mantine/core";
import { useViewportSize } from "@mantine/hooks";
import { openModal } from "@mantine/modals";
import { sep } from "@tauri-apps/api/path";
import { DataGrid, stringFilterFn } from "mantine-data-grid";
import { useMemo } from "react";
import { useSnapshot } from "valtio";
import { PathEditor } from "../components/PathEditor";
import { store } from "../store";
import { Game } from "../store/games";
import { Path } from "../store/paths";
import { getGameLabel } from "../utils/game";

const PathsPage = () => {
  const { paths, collections, games } = useSnapshot(store);
  const { height } = useViewportSize();

  const data = useMemo(() => {
    return paths
      .filter((p) => p.exists)
      .map((p) => ({
        ...p,
        collections: collections
          .filter((c) => c.roots.find((r) => p.path.startsWith(r)))
          .map((c) => c.name),
        games: games.filter((g) => p.gameIds.includes(g.id)),
      }));
  }, [paths, collections, games]);

  const handleEdit = (path: Path) => {
    const name = path.path.split(sep).pop();

    openModal({
      title: name,
      centered: true,
      size: "lg",
      children: <PathEditor path={path} />,
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
      data={data}
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
