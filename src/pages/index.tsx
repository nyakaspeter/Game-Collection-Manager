import {
  Box,
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
import { store } from "../store";
import { Game, GameListItem } from "../store/games";
import { getGameLabel } from "../utils/game";

const CARD_WIDTH = 150;

const HomePage = () => {
  const theme = useMantineTheme();
  const { ref: scrollParent, width } = useElementSize();
  const { paths, collections, games } = useSnapshot(store);
  const [query, setQuery] = useDebouncedState("", 200);

  const data = useMemo(() => {
    const existingGameIds = paths
      .filter((p) => p.exists)
      .flatMap((p) => p.gameIds);

    let existingGames = games.filter((g) => existingGameIds.includes(g.id));

    if (query)
      existingGames = existingGames.filter((g) =>
        getGameLabel(g as Game)
          .toLowerCase()
          .includes(query.toLowerCase())
      );

    existingGames.sort((a, b) =>
      (a.releaseDate || "") > (b.releaseDate || "") ? -1 : 1
    );

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
  }, [paths, collections, games, query]);

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setQuery(event.currentTarget.value);
  };

  return (
    <Stack sx={{ height: `calc(100vh - ${2 * theme.spacing.md}px)` }}>
      <Box>
        <TextInput
          placeholder="Search..."
          rightSection={<IconSearch />}
          defaultValue={query}
          onChange={handleInputChange}
        />
      </Box>
      <ScrollArea viewportRef={scrollParent}>
        <VirtuosoGrid
          overscan={500}
          totalCount={data.length}
          itemContent={(index) => <GameCard game={data[index]} />}
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
