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
import { useMemo, useRef } from "react";
import { useSnapshot } from "valtio";
import { GameScore } from "../components/GameScore";
import { store } from "../store";
import { Collection } from "../store/collections";
import { GameListItem } from "../store/games";
import {
  getGameGenres,
  getGameModes,
  getGameRating,
  getGameYear,
} from "../utils/game";
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

  const { paths, collections, games } = useSnapshot(store);

  const data = useMemo(() => {
    const existingGameIds = paths
      .filter((p) => p.exists)
      .flatMap((p) => p.gameIds);

    const existingGames = games.filter((g) => existingGameIds.includes(g.id));

    return existingGames.map((game) => {
      const gamePaths = paths.filter(
        (path) => path.exists && path.gameIds.includes(game.id)
      );

      const gameCollections = collections.filter((collection) =>
        collection.roots.find((root) =>
          gamePaths.find((path) => path.path.startsWith(root))
        )
      );

      return {
        ...game,
        paths: gamePaths,
        collections: gameCollections,
      } as GameListItem;
    });
  }, [paths, collections, games]);

  return (
    <DataGrid
      tableRef={table}
      data={data}
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
        "80px",
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
          accessorKey: "name",
        },
        {
          id: "year",
          header: "Year",
          sortingFn: "alphanumeric",
          accessorFn: (game) => getGameYear(game),
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
          id: "rating",
          header: "Score",
          sortingFn: "alphanumeric",
          accessorFn: (game) => getGameRating(game),
          cell: (cell) => <GameScore score={cell.getValue() as number} />,
        },
        {
          id: "button",
          header: "",
          enableSorting: false,
          accessorFn: (game) => game,
          cell: () => (
            <Tooltip label="View game" position="left">
              <ActionIcon
                className="button"
                variant="filled"
                sx={{ visibility: "hidden" }}
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
