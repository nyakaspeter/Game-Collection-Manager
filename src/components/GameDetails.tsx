import {
  AspectRatio,
  BackgroundImage,
  Badge,
  Box,
  Button,
  Group,
  Stack,
  Text,
  Title,
  useMantineTheme,
} from "@mantine/core";
import { IconPlayerPlay } from "@tabler/icons";
import { useSnapshot } from "valtio";
import { store } from "../store";
import { Game, GameListItem, saveGames } from "../store/games";
import {
  getGameCover,
  getGameGenres,
  getGameModes,
  getGamePlatforms,
  getGameRating,
  getGameReady,
} from "../utils/game";
import { openPathInExplorer } from "../utils/path";
import { GameScoreBadge } from "./GameScoreBadge";

export const GameDetails = ({ gameId }: { gameId: string }) => {
  const game = useSnapshot(store).gameList.find(
    (g) => g.id === gameId
  ) as GameListItem;

  const theme = useMantineTheme();

  const cover = getGameCover(game);
  const score = getGameRating(game);
  const platforms = getGamePlatforms(game);
  const playable = getGameReady(game);
  const modes = getGameModes(game);
  const genres = getGameGenres(game);
  const releaseDate = game.releaseDate
    ? new Date(game.releaseDate).toLocaleDateString()
    : undefined;
  const backdrop = game?.screenshots?.length
    ? `https://images.igdb.com/igdb/image/upload/t_720p/${game?.screenshots[0]}.jpg`
    : "";

  const handleTogglePlayed = async () => {
    const edited = store.games.find((g) => g.id === game.id) as Game;
    edited.played = !edited.played;
    await saveGames(store.games);
  };

  return (
    <Stack
      spacing={0}
      sx={{
        margin: -20,
        marginTop: -64,
        maxHeight: "80vh",
        width: "unset",
      }}
    >
      <BackgroundImage src={backdrop} radius="sm" sx={{ height: 300 }}>
        <Box
          sx={{
            width: "100%",
            height: "100%",
            backgroundImage: theme.fn.gradient({
              from: "#00000055",
              to: theme.colors.dark[7],
              deg: 180,
            }),
          }}
        />
      </BackgroundImage>

      <Group m={20} mt={-100} noWrap align="stretch" spacing="lg">
        <Stack>
          <AspectRatio ratio={3 / 4} sx={{ width: 200 }}>
            <BackgroundImage
              src={cover}
              radius="md"
              sx={{
                borderWidth: 1,
                borderColor: theme.colors.gray[8],
                borderStyle: "solid",
              }}
            />
          </AspectRatio>
          <Button
            radius="md"
            leftIcon={<IconPlayerPlay size={18} />}
            onClick={handleTogglePlayed}
          >
            {game.played ? "Mark as unplayed" : "Mark as played"}
          </Button>
        </Stack>

        <Stack justify="space-between" sx={{ overflow: "hidden" }}>
          <Stack spacing={0}>
            <Group align="end" spacing={4} noWrap>
              <Title lineClamp={1}>{game.name}</Title>
              {score && (
                <Box mb={4}>
                  <GameScoreBadge score={score} />
                </Box>
              )}
            </Group>
            <Group spacing={4}>
              {releaseDate && <Text>Released on {releaseDate}</Text>}
              {game.played && <Badge color="green">Played</Badge>}
              {playable && <Badge color="green">Ready to play</Badge>}
            </Group>
          </Stack>

          {game.summary && <Text size="sm">{game.summary}</Text>}

          <Group>
            {platforms.length && (
              <Stack spacing={4} sx={{ maxWidth: "100%" }}>
                <Text size="sm">Platforms</Text>
                <Group spacing={4} noWrap={false}>
                  {getGamePlatforms(game).map((platform) => (
                    <Badge key={platform}>{platform}</Badge>
                  ))}
                </Group>
              </Stack>
            )}
            {genres.length && (
              <Stack spacing={4} sx={{ maxWidth: "100%" }}>
                <Text size="sm">Genres</Text>
                <Group spacing={4} noWrap={false}>
                  {getGameGenres(game).map((genre) => (
                    <Badge key={genre}>{genre}</Badge>
                  ))}
                </Group>
              </Stack>
            )}
            {modes.length && (
              <Stack spacing={4} sx={{ maxWidth: "100%" }}>
                <Text size="sm">Modes</Text>
                <Group spacing={4} noWrap={false}>
                  {getGameModes(game).map((mode) => (
                    <Badge key={mode}>{mode}</Badge>
                  ))}
                </Group>
              </Stack>
            )}
            <Stack spacing={4} sx={{ maxWidth: "100%" }}>
              <Text size="sm">Collections</Text>
              <Group spacing={4} noWrap={false}>
                {game.collections.map((collection) => (
                  <Badge key={collection.id}>{collection.name}</Badge>
                ))}
              </Group>
            </Stack>
            <Stack spacing={4} sx={{ maxWidth: "100%" }}>
              <Text size="sm">Paths</Text>
              <Group spacing={4} noWrap={false}>
                {game.paths.map((path) => (
                  <Badge
                    key={path.path}
                    sx={{ cursor: "pointer" }}
                    onClick={() => openPathInExplorer(path)}
                  >
                    {path.path}
                  </Badge>
                ))}
              </Group>
            </Stack>
          </Group>
        </Stack>
      </Group>
    </Stack>
  );
};
