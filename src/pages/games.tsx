import {
  ActionIcon,
  Badge,
  Group,
  RingProgress,
  Text,
  Tooltip,
} from "@mantine/core";
import { IconArrowRight } from "@tabler/icons";
import {
  DataGrid,
  dateFilterFn,
  numberFilterFn,
  stringFilterFn,
} from "mantine-data-grid";
import { useMemo } from "react";
import { useSnapshot } from "valtio";
import { store } from "../store";
import { Collection } from "../store/collections";
import { Game } from "../store/games";
import { Path } from "../store/paths";
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
        "120px",
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
          filterFn: dateFilterFn,
          accessorKey: "releaseDate",
          cell: (cell) =>
            cell.getValue() &&
            new Date(cell.getValue() as string).getFullYear(),
        },
        {
          id: "genre",
          header: "Genre",
          enableSorting: false,
          filterFn: stringFilterFn,
          accessorKey: "genres",
          cell: (cell) => (
            <Group spacing={4}>
              {(
                cell.getValue() as {
                  name: string;
                  slug: string;
                }[]
              )
                ?.slice(0, 1)
                .map((genre, index) => (
                  <Badge key={index}>{genre.slug.split("-").pop()}</Badge>
                ))}
            </Group>
          ),
        },
        {
          id: "modes",
          header: "Modes",
          enableSorting: false,
          filterFn: stringFilterFn,
          accessorFn: (game: GameItem) => "",
          cell: (cell) => (
            <Group spacing={4}>
              <Badge>Single</Badge>
              <Badge>Multi</Badge>
              <Badge>Coop</Badge>
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
              {(cell.getValue() as Collection[]).map((collection, index) => (
                <Badge
                  color={collection.readyToPlay ? "green" : undefined}
                  key={index}
                >
                  {collection.name}
                </Badge>
              ))}
            </Group>
          ),
        },
        {
          id: "rating",
          header: "",
          filterFn: numberFilterFn,
          accessorFn: (game: GameItem) =>
            game.rating && Math.round(game.rating),
          cell: (cell) => {
            const rating = cell.getValue() as number;
            const color =
              rating >= 80 ? "green" : rating >= 60 ? "yellow" : "red";

            return (
              rating && (
                <RingProgress
                  ml={5}
                  size={28}
                  thickness={3}
                  sections={[{ value: rating, color }]}
                  label={
                    <Text align="center" size={10} color={color}>
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
