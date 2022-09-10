import {
  AspectRatio,
  BackgroundImage,
  Box,
  Center,
  Group,
  Stack,
  Text,
  useMantineTheme,
} from "@mantine/core";
import { GameListItem } from "../store/games";
import {
  getGameCover,
  getGameLabel,
  getGameReady,
  getGameRating,
  showGameDetails,
} from "../utils/game";
import { GamePlayableBadge } from "./GamePlayableBadge";
import { GameScoreBadge } from "./GameScoreBadge";

export const GameCard = ({
  game,
  fade,
}: {
  game: GameListItem;
  fade?: boolean;
}) => {
  const theme = useMantineTheme();
  const darkMode = theme.colorScheme === "dark";
  const fadeBackdropColor = "#000000DD";

  const label = getGameLabel(game);
  const cover = getGameCover(game);
  const score = getGameRating(game);
  const playable = getGameReady(game);

  const handleViewGame = () => showGameDetails(game);

  return (
    <AspectRatio ratio={3 / 4}>
      <BackgroundImage
        src={cover}
        radius="md"
        sx={{
          borderWidth: 0.5,
          borderColor: theme.colors.gray[darkMode ? 7 : 2],
          borderStyle: "solid",
        }}
      >
        {fade && (
          <Box
            sx={{
              position: "absolute",
              backgroundColor: fadeBackdropColor,
              width: "100%",
              height: "100%",
            }}
          />
        )}
        <Center
          p="sm"
          sx={{
            position: "absolute",
            backgroundColor: fadeBackdropColor,
            width: "100%",
            height: "100%",
            opacity: 0,
            ":hover": { opacity: 1 },
            transition: "opacity 0.2s",
            cursor: "pointer",
          }}
          onClick={handleViewGame}
        >
          <Stack>
            <Text color={theme.white} size="xs" align="center">
              {label}
            </Text>
            {(playable || score) && (
              <Group position="center" spacing="xs">
                {playable && <GamePlayableBadge />}
                {score && <GameScoreBadge score={score} />}
              </Group>
            )}
          </Stack>
        </Center>
      </BackgroundImage>
    </AspectRatio>
  );
};
