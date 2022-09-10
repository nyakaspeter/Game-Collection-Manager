import {
  ActionIcon,
  Box,
  Popover,
  ScrollArea,
  SimpleGrid,
  Stack,
  TextInput,
  useMantineTheme,
} from "@mantine/core";
import { useDebouncedState, useElementSize } from "@mantine/hooks";
import { IconSearch } from "@tabler/icons";
import { ChangeEvent, forwardRef, useMemo } from "react";
import { VirtuosoGrid } from "react-virtuoso";
import { useSnapshot } from "valtio";
import { GameCard } from "../components/GameCard";
import { GameFilters } from "../components/GameFilters";
import { store } from "../store";
import { GameListItem } from "../store/games";
import { GameListSort, GameStatus } from "../store/settings";
import { getGameLabel, getGameReady } from "../utils/game";

const CARD_WIDTH = 150;

const HomePage = () => {
  const theme = useMantineTheme();
  const { ref: scrollParent, width } = useElementSize();
  const { gameList } = useSnapshot(store);
  const {
    collectionFilter,
    descending,
    fadeNotReady,
    fadePlayed,
    genreFilter,
    modeFilter,
    sort,
    statusFilter,
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
    genreFilter,
    modeFilter,
    collectionFilter,
    statusFilter,
    sort,
    descending,
  ]);

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setQuery(event.currentTarget.value);
  };

  return (
    <Stack sx={{ height: `calc(100vh - ${2 * theme.spacing.md}px)` }}>
      <Box>
        <TextInput
          placeholder="Search..."
          rightSection={
            <Popover width={300} position="bottom-end" withArrow>
              <Popover.Target>
                <ActionIcon>
                  <IconSearch opacity={0.8} />
                </ActionIcon>
              </Popover.Target>
              <Popover.Dropdown>
                <GameFilters />
              </Popover.Dropdown>
            </Popover>
          }
          defaultValue={query}
          onChange={handleInputChange}
        />
      </Box>
      <ScrollArea viewportRef={scrollParent}>
        <VirtuosoGrid
          overscan={500}
          totalCount={filteredGameList.length}
          itemContent={(index) => (
            <GameCard
              game={filteredGameList[index]}
              fade={
                (fadeNotReady && !getGameReady(filteredGameList[index])) ||
                (fadePlayed && filteredGameList[index].played)
              }
            />
          )}
          customScrollParent={scrollParent.current || undefined}
          components={{
            List: forwardRef(({ style, children }, ref) => {
              return (
                <SimpleGrid
                  ref={ref}
                  cols={Math.trunc(width / CARD_WIDTH)}
                  style={style}
                >
                  {children}
                </SimpleGrid>
              );
            }),
          }}
        />
      </ScrollArea>
    </Stack>
  );
};

export default HomePage;
