import { loadStore } from "../utils/store";

export interface Game {
  id: number;
  name: string;
  slug: string;
  summary?: string;
  rating?: number;
  releaseDate?: string;
  genres?: {
    name: string;
    slug: string;
  }[];
  cover?: string;
  artworks?: string[];
  screenshots?: string[];
  videos?: {
    name: string;
    id: string;
  }[];
}

const defaultGames: Game[] = [];

export const gamesKey = "games";

export const gamesStore = await loadStore(gamesKey, defaultGames);

export const getGames = async () => {
  return (await gamesStore.get<Game[]>(gamesKey))!!;
};

export const setGames = async (value: Game[]) => {
  await gamesStore.set(gamesKey, value);
};

export const saveGames = async () => {
  await gamesStore.save();
};
