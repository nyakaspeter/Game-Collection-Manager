import {
  ActionIcon,
  Badge,
  Group,
  Tooltip,
  useMantineTheme,
} from "@mantine/core";
import { IconArrowRight } from "@tabler/icons";
import { Table } from "@tanstack/react-table";
import { DataGrid } from "mantine-data-grid";
import { useRef } from "react";
import { useSnapshot } from "valtio";
import { GameScoreBadge } from "../components/GameScoreBadge";
import { store } from "../store";
import { GameListItem } from "../store/games";
import {
  getGameGenres,
  getGameModes,
  getGameRating,
  getGameYear,
  showGameDetails,
} from "../utils/game";
import { openPathInExplorer } from "../utils/path";
import { collectionFilter } from "../utils/table/collectionFilter";
import { genreFilter } from "../utils/table/genreFilter";
import { modeFilter } from "../utils/table/modeFilter";
import { createTableStyles } from "../utils/table/styles";

const GamesPage = () => {
  const theme = useMantineTheme();

  const table = useRef<Table<GameListItem>>(null);
  table.current?.setOptions((options) => ({
    ...options,
    autoResetPageIndex: false,
  }));

  const { gameList } = useSnapshot(store);

  const handleViewGame = (game: GameListItem) => showGameDetails(game);

  return (
    <DataGrid
      tableRef={table}
      data={gameList as GameListItem[]}
      height={`calc(100vh - ${2 * theme.spacing.md}px)`}
      noFlexLayout
      highlightOnHover
      withFixedHeader
      withGlobalFilter
      withColumnFilters
      withSorting
      withPagination
      sx={createTableStyles([
        "100%",
        "100px",
        "220px",
        "200px",
        "200px",
        "80px",
        "60px",
      ])}
      columns={[
        {
          id: "name",
          header: "Name",
          sortingFn: "text",
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
          sortingFn: "alphanumeric",
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
          enableSorting: false,
          filterFn: genreFilter,
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
          enableSorting: false,
          filterFn: modeFilter,
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
          enableSorting: false,
          filterFn: collectionFilter() as any,
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
          sortingFn: "alphanumeric",
          accessorFn: (game) => getGameRating(game),
          cell: (cell) =>
            cell.getValue() && (
              <GameScoreBadge score={cell.getValue() as number} />
            ),
        },
        {
          id: "button",
          header: "",
          enableSorting: false,
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
      initialState={{
        sorting: [{ id: "name", desc: false }],
        pagination: { pageSize: 25 },
      }}
    />
  );
};

export default GamesPage;
