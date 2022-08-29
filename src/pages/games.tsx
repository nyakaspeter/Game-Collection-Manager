import {
  ActionIcon,
  Badge,
  Group,
  RingProgress,
  Text,
  Tooltip,
} from "@mantine/core";
import { IconArrowRight } from "@tabler/icons";
import { DataGrid, numberFilterFn, stringFilterFn } from "mantine-data-grid";
import { useMemo } from "react";
import { useSnapshot } from "valtio";
import { store } from "../store";
import { Collection } from "../store/collections";
import { Game } from "../store/games";
import { Path } from "../store/paths";
import {
  getGameGenres,
  getGameModes,
  getGameRating,
  getGameYear,
} from "../utils/game";
import { createTableStyles } from "../utils/table";

interface GameItem extends Game {
  paths: Path[];
  collections: Collection[];
}

const GamesPage = () => {
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
      } as GameItem;
    });
  }, [paths, collections, games]);

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
      sx={createTableStyles([
        "100%",
        "100px",
        "220px",
        "200px",
        "200px",
        "50px",
        "60px",
      ])}
      columns={[
        {
          id: "name",
          header: "Name",
          filterFn: stringFilterFn,
          accessorKey: "name",
        },
        {
          id: "year",
          header: "Year",
          filterFn: numberFilterFn,
          sortingFn: "alphanumeric",
          accessorFn: (game: GameItem) => getGameYear(game),
        },
        {
          id: "genre",
          header: "Genres",
          enableSorting: false,
          filterFn: stringFilterFn,
          accessorFn: (game: GameItem) => getGameGenres(game),
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
          filterFn: stringFilterFn,
          accessorFn: (game: GameItem) => getGameModes(game),
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
          filterFn: stringFilterFn,
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
          filterFn: numberFilterFn,
          sortingFn: "alphanumeric",
          accessorFn: (game: GameItem) => getGameRating(game),
          cell: (cell) => {
            const rating = cell.getValue() as number;
            const color =
              rating >= 80 ? "green" : rating >= 60 ? "yellow" : "red";

            return (
              rating && (
                <RingProgress
                  ml={5}
                  size={28}
                  thickness={2}
                  sections={[{ value: rating, color }]}
                  label={
                    <Text align="center" size={12} color={color}>
                      {cell.getValue() as number}
                    </Text>
                  }
                />
              )
            );
          },
        },
        {
          id: "button",
          header: "",
          enableSorting: false,
          accessorFn: (game: GameItem) => game,
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
      }}
    />
  );
};

export default GamesPage;
