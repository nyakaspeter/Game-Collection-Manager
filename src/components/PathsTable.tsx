import { ActionIcon, Badge, Group, Tooltip } from "@mantine/core";
import { TbPencil } from "react-icons/tb";
import { Table } from "@tanstack/react-table";
import { sep } from "@tauri-apps/api/path";
import { DataGrid } from "mantine-data-grid";
import { useRef } from "react";
import { store } from "../store";
import { Game, GameListItem } from "../store/games";
import { PathListItem } from "../store/paths";
import { getGameLabel, showGameDetails } from "../utils/game";
import { openPathInExplorer, showPathEditor } from "../utils/path";
import { createTableStyles } from "../utils/table";

export const PathsTable = ({ paths }: { paths: PathListItem[] }) => {
  const table = useRef<Table<PathListItem>>(null);
  table.current?.setOptions((options) => ({
    ...options,
    autoResetPageIndex: false,
  }));

  const handleEditPath = (path: PathListItem) => showPathEditor(path);
  const handleOpenPath = (path: PathListItem) => openPathInExplorer(path);
  const handleViewGame = (game: GameListItem) => showGameDetails(game);

  return (
    <DataGrid
      tableRef={table}
      data={paths}
      noFlexLayout
      highlightOnHover
      withFixedHeader
      withPagination
      sx={createTableStyles(["100%", "400px", "200px", "100px", "60px"])}
      initialState={{
        pagination: { pageSize: 25 },
      }}
      columns={[
        {
          id: "path",
          header: "Path",
          accessorKey: "path",
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
          accessorKey: "games",
          cell: (cell) => (
            <Group spacing={4}>
              {(cell.getValue() as Game[]).map((game) => {
                const gameListItem = store.gameList.find(
                  (g) => g.id === game.id
                );

                return (
                  <Tooltip
                    openDelay={500}
                    position="bottom-start"
                    key={game.id}
                    label={getGameLabel(game, true, true, true, true)}
                  >
                    <Badge
                      sx={{ cursor: "pointer" }}
                      onClick={
                        gameListItem && (() => handleViewGame(gameListItem))
                      }
                    >
                      {getGameLabel(game)}
                    </Badge>
                  </Tooltip>
                );
              })}
            </Group>
          ),
        },
        {
          id: "collections",
          header: "Collections",
          accessorKey: "collections",
          cell: (cell) => (
            <Group spacing={4}>
              {cell.row.original.collections.map((collection) => (
                <Tooltip
                  openDelay={500}
                  position="bottom-start"
                  key={collection.id}
                  label={cell.row.original.path}
                >
                  <Badge
                    color={collection.readyToPlay ? "green" : undefined}
                    sx={{ cursor: "pointer" }}
                    onClick={() => handleOpenPath(cell.row.original)}
                  >
                    {collection.name}
                  </Badge>
                </Tooltip>
              ))}
            </Group>
          ),
        },
        {
          id: "added",
          header: "Added",
          accessorKey: "added",
          cell: (cell) =>
            new Date(cell.getValue() as string).toLocaleDateString(),
        },
        {
          id: "button",
          header: "",
          cell: (cell) => (
            <Tooltip label="Edit games" position="left">
              <ActionIcon
                className="button"
                variant="filled"
                sx={{ visibility: "hidden" }}
                onClick={() => handleEditPath(cell.row.original)}
              >
                <TbPencil size={18} />
              </ActionIcon>
            </Tooltip>
          ),
        },
      ]}
    />
  );
};
