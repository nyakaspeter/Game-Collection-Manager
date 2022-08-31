import {
  Box,
  Group,
  Input,
  MantineTheme,
  Stack,
  Sx,
  TextInput,
  useMantineTheme,
} from "@mantine/core";
import { useDebouncedState } from "@mantine/hooks";
import { IconSearch } from "@tabler/icons";
import { ChangeEvent, useMemo } from "react";
import { useSnapshot } from "valtio";
import { GameCard } from "../components/GameCard";
import { store } from "../store";
import { Game, GameListItem } from "../store/games";
import { getGameLabel } from "../utils/game";

const filterStyles = (theme: MantineTheme): Sx => ({
  position: "sticky",
  marginTop: -16,
  paddingTop: 16,
  paddingBottom: 16,
  top: 0,
  zIndex: 1,
  background: theme.colors.dark[7],
});

const cardsStyles: Sx = {
  justifyContent: "space-around",
  "::after": { content: '""', flex: "auto" },
};

const HomePage = () => {
  const theme = useMantineTheme();
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
    <Stack spacing={0}>
      <Box sx={filterStyles(theme)}>
        <TextInput
          placeholder="Search..."
          rightSection={<IconSearch />}
          defaultValue={query}
          onChange={handleInputChange}
        />
      </Box>
      <Group sx={cardsStyles}>
        {data.map((game) => (
          <GameCard key={game.id} game={game} />
        ))}
      </Group>
    </Stack>
  );
};

export default HomePage;
