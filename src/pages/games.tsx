import { ActionIcon, Badge, Button, Group } from "@mantine/core";
import { useViewportSize } from "@mantine/hooks";
import { IconArrowRight } from "@tabler/icons";
import { DataGrid, dateFilterFn, stringFilterFn } from "mantine-data-grid";
import { useMemo } from "react";
import { useSnapshot } from "valtio";
import { store } from "../store";
import { Collection } from "../store/collections";
import { Game } from "../store/games";
import { Path } from "../store/paths";

interface GameItem extends Game {
  paths: Path[];
  collections: Collection[];
}

const GamesPage = () => {
  const { paths, collections, games } = useSnapshot(store);
  const { height } = useViewportSize();

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
      sx={{
        table: {
          tableLayout: "fixed",
          width: "100% !important",
          thead: { zIndex: 1 },
          "td>:nth-of-type(1),th>:nth-of-type(1)": { width: "100% !important" },
          "tr>:nth-of-type(1)": { width: "100% !important" },
          "tr>:nth-of-type(2)": { width: "100% !important" },
          "tr>:nth-of-type(3)": { width: "100% !important" },
          "tr>:nth-of-type(4)": { width: "60px !important" },
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
          id: "collections",
          header: "Collections",
          enableSorting: false,
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
          id: "button",
          header: "",
          enableSorting: false,
          accessorFn: (path: Path) => path,
          cell: (cell) => (
            <ActionIcon
              className="button"
              variant="filled"
              sx={{ visibility: "hidden" }}
            >
              <IconArrowRight size={18} />
            </ActionIcon>
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
