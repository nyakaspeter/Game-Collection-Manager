import {
  ActionIcon,
  Badge,
  Group,
  Tooltip,
  useMantineTheme,
} from "@mantine/core";
import { openModal } from "@mantine/modals";
import { IconArrowRight } from "@tabler/icons";
import { Table } from "@tanstack/react-table";
import { sep } from "@tauri-apps/api/path";
import { DataGrid } from "mantine-data-grid";
import { useRef } from "react";
import { useSnapshot } from "valtio";
import { PathEditor } from "../components/PathEditor";
import { store } from "../store";
import { Collection } from "../store/collections";
import { Game } from "../store/games";
import { PathListItem } from "../store/paths";
import { getGameLabel } from "../utils/game";
import { openPathInExplorer } from "../utils/path";
import { collectionFilter } from "../utils/table/collectionFilter";
import { createTableStyles } from "../utils/table/styles";

const PathsPage = () => {
  const theme = useMantineTheme();

  const table = useRef<Table<PathListItem>>(null);
  table.current?.setOptions((options) => ({
    ...options,
    autoResetPageIndex: false,
  }));

  const { pathList } = useSnapshot(store);

  const handleEdit = (path: PathListItem) => {
    const name = path.path.split(sep).pop();

    openModal({
      title: name,
      centered: true,
      size: "lg",
      children: <PathEditor path={path} />,
    });
  };

  const handleViewInExplorer = async (path: PathListItem) =>
    openPathInExplorer(path);

  return (
    <DataGrid
      tableRef={table}
      data={pathList as PathListItem[]}
      height={`calc(100vh - ${2 * theme.spacing.md}px)`}
      noFlexLayout
      highlightOnHover
      withFixedHeader
      withGlobalFilter
      withColumnFilters
      withSorting
      withPagination
      sx={createTableStyles(["100%", "400px", "200px", "100px", "60px"])}
      columns={[
        {
          id: "path",
          header: "Path",
          accessorKey: "path",
          sortingFn: (a, b, columnId) =>
            (a.getValue<string>(columnId).split(sep).pop()?.toLowerCase() ||
              "") <
            (b.getValue<string>(columnId).split(sep).pop()?.toLowerCase() || "")
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
                  <Badge
                    sx={{ cursor: "pointer" }}
                    onClick={() => handleEdit(cell.row.original)}
                  >
                    {getGameLabel(game)}
                  </Badge>
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
          cell: (cell) => (
            <Tooltip label="View in file explorer" position="left">
              <ActionIcon
                className="button"
                variant="filled"
                sx={{ visibility: "hidden" }}
                onClick={() => handleViewInExplorer(cell.row.original)}
              >
                <IconArrowRight size={18} />
              </ActionIcon>
            </Tooltip>
          ),
        },
      ]}
      initialState={{
        sorting: [{ id: "added", desc: true }],
        pagination: { pageSize: 25 },
      }}
    />
  );
};

export default PathsPage;
