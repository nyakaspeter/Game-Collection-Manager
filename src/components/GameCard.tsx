import {
  AspectRatio,
  BackgroundImage,
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
  getGamePlayable,
  getGameRating,
} from "../utils/game";
import { GamePlayableBadge } from "./GamePlayableBadge";
import { GameScoreBadge } from "./GameScoreBadge";

export const GameCard = ({ game }: { game?: GameListItem }) => {
  const theme = useMantineTheme();
  const darkMode = theme.colorScheme === "dark";

  if (!game) return null;

  const label = getGameLabel(game);
  const cover = getGameCover(game);
  const score = getGameRating(game);
  const playable = getGamePlayable(game);

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
        <Center
          p="sm"
          sx={{
            backgroundColor: darkMode ? "#000000DD" : "#FFFFFFDD",
            cursor: "pointer",
            width: "100%",
            height: "100%",
            opacity: 0,
            ":hover": { opacity: 1 },
            transition: "opacity 0.2s",
          }}
        >
          <Stack>
            <Text
              color={darkMode ? theme.white : theme.black}
              size="xs"
              align="center"
            >
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
