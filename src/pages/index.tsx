import {
  ActionIcon,
  Group,
  Popover,
  Stack,
  TextInput,
  Tooltip,
  useMantineTheme,
} from "@mantine/core";
import { useDebouncedState } from "@mantine/hooks";
import { IconFilter, IconLayoutGrid, IconListDetails } from "@tabler/icons";
import { ChangeEvent, useMemo } from "react";
import { useSnapshot } from "valtio";
import { GameFilters } from "../components/GameFilters";
import { GamesGrid } from "../components/GamesGrid";
import { GamesTable } from "../components/GamesTable";
import { store } from "../store";
import { GameListItem } from "../store/games";
import { GameListSort, GameListView, GameStatus } from "../store/settings";
import { getGameLabel } from "../utils/game";

const GamesPage = () => {
  const theme = useMantineTheme();

  const { gameList } = useSnapshot(store);

  const {
    view,
    sort,
    descending,
    genreFilter,
    modeFilter,
    collectionFilter,
    statusFilter,
    fadeNotReady,
    fadePlayed,
  } = useSnapshot(store.settings.gameList);

  const [query, setQuery] = useDebouncedState("", 200);

  const filteredGameList = useMemo(() => {
    let list = gameList as GameListItem[];

    list = list = list.filter(
      (item) =>
        (!query ||
          getGameLabel(item).toLowerCase().includes(query.toLowerCase())) &&
        (!genreFilter.length ||
          genreFilter.find((genre) =>
            item.genres?.includes(parseInt(genre))
          )) &&
        (!modeFilter.length ||
          modeFilter.find((mode) =>
            item.gameModes?.includes(parseInt(mode))
          )) &&
        (!collectionFilter.length ||
          collectionFilter.find((collectionId) =>
            item.collections.find((c) => c.id === collectionId)
          )) &&
        (!statusFilter ||
          (statusFilter === GameStatus.Played && item.played) ||
          (statusFilter === GameStatus.NotPlayed && !item.played))
    );

    list.sort((a, b) => {
      let comparison = 0;

      if (sort === GameListSort.Name) {
        comparison = a.name.toLowerCase() < b.name.toLowerCase() ? -1 : 1;
      } else if (sort === GameListSort.Release) {
        if (!a.releaseDate) return 1;
        if (!b.releaseDate) return -1;
        comparison = a.releaseDate < b.releaseDate ? -1 : 1;
      } else if (sort === GameListSort.Rating) {
        if (!a.rating) return 1;
        if (!b.rating) return -1;
        comparison = a.rating < b.rating ? -1 : 1;
      } else if (sort === GameListSort.Added) {
        comparison =
          a.paths.slice().sort((a, b) => (a.added < b.added ? -1 : 1))[0] <
          b.paths.slice().sort((a, b) => (a.added < b.added ? -1 : 1))[0]
            ? -1
            : 1;
      }

      return descending ? -comparison : comparison;
    });

    return list;
  }, [
    gameList,
    query,
    sort,
    descending,
    genreFilter,
    modeFilter,
    collectionFilter,
    statusFilter,
  ]);

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setQuery(event.currentTarget.value);
  };

  const handleChangeView = () => {
    const views = Object.values(GameListView);
    const currentIndex = views.findIndex((v) => v === view);
    const nextIndex = (currentIndex + 1) % views.length;
    store.settings.gameList.view = views[nextIndex];
  };

  return (
    <Stack sx={{ height: `calc(100vh - ${2 * theme.spacing.md}px)` }}>
      <TextInput
        placeholder="Search..."
        rightSection={
          <Group noWrap spacing="xs" mr={40}>
            <Tooltip label="Switch view" position="left">
              <ActionIcon onClick={handleChangeView}>
                {view === GameListView.Grid && (
                  <IconListDetails opacity={0.8} />
                )}
                {view === GameListView.Table && (
                  <IconLayoutGrid opacity={0.8} />
                )}
              </ActionIcon>
            </Tooltip>
            <Popover width={300} position="bottom-end" withArrow>
              <Popover.Target>
                <Tooltip label="Filter and sort" position="left">
                  <ActionIcon>
                    <IconFilter opacity={0.8} />
                  </ActionIcon>
                </Tooltip>
              </Popover.Target>
              <Popover.Dropdown>
                <GameFilters />
              </Popover.Dropdown>
            </Popover>
          </Group>
        }
        defaultValue={query}
        onChange={handleInputChange}
      />

      {view === GameListView.Grid && (
        <GamesGrid
          games={filteredGameList}
          fadePlayed={fadePlayed}
          fadeNotReady={fadeNotReady}
        />
      )}

      {view === GameListView.Table && (
        <GamesTable
          games={filteredGameList}
          fadePlayed={fadePlayed}
          fadeNotReady={fadeNotReady}
        />
      )}
    </Stack>
  );
};

export default GamesPage;
