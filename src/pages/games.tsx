import {
  ActionIcon,
  Badge,
  Group,
  RingProgress,
  Text,
  Tooltip,
} from "@mantine/core";
import { IconArrowRight } from "@tabler/icons";
import { DataGrid } from "mantine-data-grid";
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
import { collectionFilter } from "../utils/table/collectionFilter";
import { genreFilter } from "../utils/table/genreFilter";
import { modeFilter } from "../utils/table/modeFilter";
import { createTableStyles } from "../utils/table/styles";

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
          accessorFn: (game: Game) => getGameYear(game),
        },
        {
          id: "genre",
          header: "Genres",
          enableSorting: false,
          filterFn: genreFilter,
          accessorFn: (game: Game) => getGameGenres(game),
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
          accessorFn: (game: Game) => getGameModes(game),
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
          filterFn: collectionFilter as any,
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
          accessorFn: (game: Game) => getGameRating(game),
          cell: (cell) => {
            const rating = cell.getValue() as number;
            const color =
              rating >= 80 ? "green" : rating >= 60 ? "yellow" : "red";

            return (
              rating && (
                <RingProgress
                  ml={4}
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
          accessorFn: (game: Game) => game,
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
