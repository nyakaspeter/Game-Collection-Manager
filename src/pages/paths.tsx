import { ActionIcon, Badge, Group, Tooltip } from "@mantine/core";
import { openModal } from "@mantine/modals";
import { IconPencil } from "@tabler/icons";
import { sep } from "@tauri-apps/api/path";
import { DataGrid } from "mantine-data-grid";
import { useMemo } from "react";
import { useSnapshot } from "valtio";
import { PathEditor } from "../components/PathEditor";
import { store } from "../store";
import { Collection } from "../store/collections";
import { Game } from "../store/games";
import { Path } from "../store/paths";
import { getGameLabel } from "../utils/game";
import { collectionFilter } from "../utils/table/collectionFilter";
import { createTableStyles } from "../utils/table/styles";

export interface PathItem extends Path {
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
      sx={createTableStyles(["100%", "400px", "200px", "100px", "60px"])}
      columns={[
        {
          id: "path",
          header: "Path",
          accessorKey: "path",
          sortingFn: (a, b, columnId) =>
            (a.getValue<string>(columnId).split(sep).pop() || "") <
            (b.getValue<string>(columnId).split(sep).pop() || "")
              ? -1
              : 1,
          cell: (cell) => (
            <Tooltip
              openDelay={500}
              position="bottom-start"
              label={cell.getValue() as string}
            >
              <span>{(cell.getValue() as string).split(sep).pop()}</span>
            </Tooltip>
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
                <Tooltip
                  openDelay={500}
                  position="bottom-start"
                  key={game.id}
                  label={getGameLabel(game, true, true, true, false, true)}
                >
                  <Badge>{getGameLabel(game)}</Badge>
                </Tooltip>
              ))}
            </Group>
          ),
        },
        {
          id: "collections",
          header: "Collections",
          enableSorting: false,
          filterFn: collectionFilter() as any,
          accessorKey: "collections",
          cell: (cell) => (
            <Group spacing={4}>
              {(cell.getValue() as Collection[]).map((collection) => (
                <Badge
                  key={collection.id}
                  color={collection.readyToPlay ? "green" : undefined}
                >
                  {collection.name}
                </Badge>
              ))}
            </Group>
          ),
        },
        {
          id: "added",
          header: "Added",
          accessorKey: "added",
          sortDescFirst: true,
          cell: (cell) =>
            new Date(cell.getValue() as string).toLocaleDateString(),
        },
        {
          id: "button",
          header: "",
          enableSorting: false,
          accessorFn: (path: PathItem) => path,
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
        sorting: [{ id: "added", desc: true }],
      }}
    />
  );
};

export default PathsPage;
