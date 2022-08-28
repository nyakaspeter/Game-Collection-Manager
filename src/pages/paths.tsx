import { ActionIcon, Badge, Group, Tooltip } from "@mantine/core";
import { openModal } from "@mantine/modals";
import { IconPencil } from "@tabler/icons";
import { sep } from "@tauri-apps/api/path";
import { DataGrid, stringFilterFn } from "mantine-data-grid";
import { useMemo } from "react";
import { useSnapshot } from "valtio";
import { PathEditor } from "../components/PathEditor";
import { store } from "../store";
import { Collection } from "../store/collections";
import { Game } from "../store/games";
import { Path } from "../store/paths";
import { getGameLabel } from "../utils/game";
import { createTableStyles } from "../utils/table";

interface PathItem extends Path {
  collections: Collection[];
  games: Game[];
}

const PathsPage = () => {
  const { paths, collections, games } = useSnapshot(store);

  const data = useMemo(() => {
    return paths
      .filter((path) => path.exists)
      .map(
        (path) =>
          ({
            ...path,
            collections: collections.filter((collection) =>
              collection.roots.find((root) => path.path.startsWith(root))
            ),
            games: games.filter((game) => path.gameIds.includes(game.id)),
          } as PathItem)
      );
  }, [paths, collections, games]);

  const handleEdit = (path: PathItem) => {
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
      data={data}
      height="calc(100vh - 32px)"
      noFlexLayout
      highlightOnHover
      withFixedHeader
      withGlobalFilter
      withColumnFilters
      withSorting
      sx={createTableStyles(["100%", "200px", "200px", "300px", "60px"])}
      columns={[
        {
          id: "name",
          header: "Name",
          filterFn: stringFilterFn,
          accessorFn: (path: PathItem) => path.path.split(sep).pop(),
        },
        {
          id: "location",
          header: "Location",
          filterFn: stringFilterFn,
          accessorFn: (path: Path) =>
            path.path.split(sep).slice(0, -1).join(sep),
        },
        {
          id: "collections",
          header: "Collections",
          enableSorting: false,
          filterFn: stringFilterFn,
          accessorKey: "collections",
          cell: (cell) => (
            <Group spacing={4}>
              {(cell.getValue() as Collection[]).map((collection, index) => (
                <Badge key={index}>{collection.name}</Badge>
              ))}
            </Group>
          ),
        },
        {
          id: "games",
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
          id: "button",
          header: "",
          enableSorting: false,
          accessorFn: (path: Path) => path,
          cell: (cell) => (
            <Tooltip label="Edit games" position="left">
              <ActionIcon
                className="button"
                variant="filled"
                sx={{ visibility: "hidden" }}
                onClick={() => handleEdit(cell.getValue() as PathItem)}
              >
                <IconPencil size={18} />
              </ActionIcon>
            </Tooltip>
          ),
        },
      ]}
      initialState={{
        sorting: [{ id: "name", desc: false }],
      }}
    />
  );
};

export default PathsPage;
