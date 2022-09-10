import { ActionIcon, Badge, Group, Tooltip } from "@mantine/core";
import { IconArrowRight } from "@tabler/icons";
import { Table } from "@tanstack/react-table";
import { DataGrid } from "mantine-data-grid";
import { useRef } from "react";
import { GameScoreBadge } from "../components/GameScoreBadge";
import { GameListItem } from "../store/games";
import {
  getGameGenres,
  getGameModes,
  getGameRating,
  getGameReady,
  getGameYear,
  showGameDetails,
} from "../utils/game";
import { openPathInExplorer } from "../utils/path";
import { createTableStyles } from "../utils/table";

export const GamesTable = ({
  games,
  fadeNotReady,
  fadePlayed,
}: {
  games: GameListItem[];
  fadeNotReady?: boolean;
  fadePlayed?: boolean;
}) => {
  const table = useRef<Table<GameListItem>>(null);
  table.current?.setOptions((options) => ({
    ...options,
    autoResetPageIndex: false,
  }));

  const handleViewGame = (game: GameListItem) => showGameDetails(game);

  return (
    <DataGrid
      tableRef={table}
      data={games}
      noFlexLayout
      highlightOnHover
      withFixedHeader
      withPagination
      sx={createTableStyles([
        "100%",
        "80px",
        "200px",
        "200px",
        "200px",
        "60px",
        "60px",
      ])}
      onRow={(row) =>
        (fadeNotReady && !getGameReady(row.original)) ||
        (fadePlayed && row.original.played)
          ? { style: { opacity: 0.3 } }
          : {}
      }
      initialState={{
        pagination: { pageSize: 25 },
      }}
      columns={[
        {
          id: "name",
          header: "Name",
          accessorKey: "name",
          cell: (cell) => (
            <Tooltip
              openDelay={500}
              position="bottom-start"
              label={cell.row.original.name}
            >
              <span>{cell.row.original.name}</span>
            </Tooltip>
          ),
        },
        {
          id: "year",
          header: "Release",
          accessorKey: "releaseDate",
          cell: (cell) =>
            cell.row.original.releaseDate && (
              <Tooltip
                openDelay={500}
                position="bottom-start"
                label={new Date(
                  cell.row.original.releaseDate
                ).toLocaleDateString()}
              >
                <span>{getGameYear(cell.row.original)}</span>
              </Tooltip>
            ),
        },
        {
          id: "genre",
          header: "Genres",
          accessorFn: (game) => getGameGenres(game),
          cell: (cell) => (
            <Group spacing={4}>
              {(cell.getValue() as string[]).slice(0, 2).map((genre) => (
                <Badge key={genre}>{genre}</Badge>
              ))}
            </Group>
          ),
        },
        {
          id: "modes",
          header: "Modes",
          accessorFn: (game) => getGameModes(game),
          cell: (cell) => (
            <Group spacing={4}>
              {(cell.getValue() as string[]).map((mode) => (
                <Badge key={mode}>{mode}</Badge>
              ))}
            </Group>
          ),
        },
        {
          id: "collections",
          header: "Collections",
          accessorKey: "collections",
          cell: (cell) => (
            <Group spacing={4}>
              {cell.row.original.paths.map((path) => {
                const collection = cell.row.original.collections.find(
                  (collection) =>
                    collection.roots.find((root) => path.path.startsWith(root))
                );

                return (
                  <Tooltip
                    key={path.path}
                    openDelay={500}
                    position="bottom-start"
                    label={path.path}
                  >
                    <Badge
                      color={collection!!.readyToPlay ? "green" : undefined}
                      sx={{ cursor: "pointer" }}
                      onClick={() => openPathInExplorer(path)}
                    >
                      {collection!!.name}
                    </Badge>
                  </Tooltip>
                );
              })}
            </Group>
          ),
        },
        {
          id: "rating",
          header: "Score",
          accessorFn: (game) => getGameRating(game),
          cell: (cell) =>
            cell.getValue() && (
              <GameScoreBadge score={cell.getValue() as number} />
            ),
        },
        {
          id: "button",
          header: "",
          cell: (cell) => (
            <Tooltip label="View game" position="left">
              <ActionIcon
                className="button"
                variant="filled"
                sx={{ visibility: "hidden" }}
                onClick={() => handleViewGame(cell.row.original)}
              >
                <IconArrowRight size={18} />
              </ActionIcon>
            </Tooltip>
          ),
        },
      ]}
    />
  );
};
