import { subscribe } from "valtio";
import { proxyWithComputed } from "valtio/utils";
import { IgdbAuthHeaders } from "../utils/igdb/auth";
import { Collection, loadCollections } from "./collections";
import { Game, GameListItem, loadGames } from "./games";
import { loadPaths, Path, PathListItem } from "./paths";
import { loadSettings, saveSettings } from "./settings";

export const store = proxyWithComputed(
  {
    settings: await loadSettings(),
    collections: await loadCollections(),
    paths: await loadPaths(),
    games: await loadGames(),
    authHeaders: null as IgdbAuthHeaders | null,
  },
  {
    gameList: (snap) => {
      const map: Map<string, GameListItem> = new Map(
        snap.games.map((game) => [
          game.id as string,
          {
            ...game,
            paths: [],
            collections: [],
          } as GameListItem,
        ])
      );

      snap.paths.forEach((path) => {
        if (path.exists) {
          path.gameIds.forEach((gameId) => {
            const game = map.get(gameId);
            game?.paths.push(path as Path);

            snap.collections
              .filter((collection) =>
                collection.roots.find((root) => path.path.startsWith(root))
              )
              .forEach((collection) => {
                if (!game?.collections.includes(collection as Collection))
                  game?.collections.push(collection as Collection);
              });
          });
        }
      });

      return Array.from(map.values()).filter((game) => game.paths.length);
    },
    pathList: (snap) => {
      const gamesMap: Map<string, Game> = new Map(
        snap.games.map((game) => [game.id as string, game as Game])
      );

      return snap.paths
        .filter((path) => path.exists)
        .map(
          (path) =>
            ({
              ...path,
              games: path.gameIds
                .map((id) => gamesMap.get(id))
                .filter((game) => !!game),
              collections: snap.collections.filter((collection) =>
                collection.roots.find((root) => path.path.startsWith(root))
              ),
            } as PathListItem)
        );
    },
  }
);

subscribe(store.settings, () => saveSettings(store.settings));
