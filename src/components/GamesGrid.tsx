import { ScrollArea, SimpleGrid } from "@mantine/core";
import { useElementSize } from "@mantine/hooks";
import { forwardRef } from "react";
import { VirtuosoGrid } from "react-virtuoso";
import { GameCard } from "../components/GameCard";
import { GameListItem } from "../store/games";
import { getGameReady } from "../utils/game";

const CARD_WIDTH = 150;

export const GamesGrid = ({
  games,
  fadeNotReady,
  fadePlayed,
}: {
  games: GameListItem[];
  fadeNotReady?: boolean;
  fadePlayed?: boolean;
}) => {
  const { ref: scrollParent, width } = useElementSize();

  return (
    <ScrollArea viewportRef={scrollParent}>
      <VirtuosoGrid
        overscan={500}
        totalCount={games.length}
        itemContent={(index) => (
          <GameCard
            game={games[index]}
            fade={
              (fadeNotReady && !getGameReady(games[index])) ||
              (fadePlayed && games[index].played)
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
  );
};
