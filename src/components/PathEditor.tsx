import { Button, Group, MultiSelect, SelectItem, Stack } from "@mantine/core";
import { useDebouncedState } from "@mantine/hooks";
import { closeAllModals } from "@mantine/modals";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { store } from "../store";
import { Game, saveGames } from "../store/games";
import { Path, savePaths } from "../store/paths";
import { getGameLabel } from "../utils/game";
import { fetchIgdbGames } from "../utils/igdb/api";
import { searchIgdb } from "../utils/igdb/search";
import { toast } from "../utils/toast";

interface Props {
  path?: Path;
}

export const PathEditor = ({ path }: Props) => {
  const [query, setQuery] = useDebouncedState("", 500);

  const { data: searchResults } = useQuery(
    ["igdbSearch", query],
    async () => await searchIgdb(query),
    {
      retry: false,
      select: (results) =>
        results.map((result) => ({
          value: result.id.toString(),
          label: result.displayName,
        })),
    }
  );

  const [items, setItems] = useState<SelectItem[]>(
    path?.gameIds.map((id) => {
      const game = store.games.find((game) => game.id === id);

      return {
        value: id,
        label: (game && getGameLabel(game as Game)) || id,
      };
    }) || []
  );

  const value = useMemo(() => items.map((item) => item.value), [items]);

  const { mutate: save, isLoading: isSaving } = useMutation(
    async () => {
      const igdbGames = await fetchIgdbGames(value);

      igdbGames.forEach((igdbGame) => {
        if (!store.games.find((game) => game.id === igdbGame.id))
          store.games.push(igdbGame);
      });

      const edited = store.paths.find((p) => p.path === path?.path);
      if (edited) edited.gameIds = value;

      await saveGames();
      await savePaths();

      handleClose();
    },
    {
      onError: () => {
        toast.error(
          "Data fetching failed",
          "Failed to fetch game data from IGDB"
        );
      },
    }
  );

  const handleSearch = (searchQuery: string) => setQuery(searchQuery);

  const handleChange = (values: string[]) => {
    setItems(
      values.map((value) => {
        const item = items.find((item) => item.value === value);
        return (
          item || {
            value,
            label: searchResults?.find((result) => result.value === value)
              ?.label,
          }
        );
      })
    );
  };

  const handleClose = () => closeAllModals();

  const handleSave = () => save();

  return (
    <Stack>
      <MultiSelect
        searchable
        data={[...items, ...(searchResults || [])]}
        filter={(_value, selected, _item) => !selected}
        onSearchChange={handleSearch}
        onChange={handleChange}
        value={value}
      />
      <Group position="right">
        <Button onClick={handleClose}>Cancel</Button>
        <Button loading={isSaving} onClick={handleSave}>
          Save
        </Button>
      </Group>
    </Stack>
  );
};
