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
import { GameListItem } from "../store/games";
import { getGameLabel } from "../utils/game";

const CARD_WIDTH = 150;

const HomePage = () => {
  const theme = useMantineTheme();
  const { ref: scrollParent, width } = useElementSize();
  const { gameList } = useSnapshot(store);
  const [query, setQuery] = useDebouncedState("", 200);

  const filteredGameList = useMemo(() => {
    let list = gameList as GameListItem[];

    if (query)
      list = list.filter((item) =>
        getGameLabel(item).toLowerCase().includes(query.toLowerCase())
      );

    list.sort((a, b) =>
      (a.releaseDate || "") > (b.releaseDate || "") ? -1 : 1
    );

    return list;
  }, [gameList, query]);

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
          totalCount={filteredGameList.length}
          itemContent={(index) => <GameCard game={filteredGameList[index]} />}
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
