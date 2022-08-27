import {
  Autocomplete,
  Button,
  Group,
  MultiSelect,
  SelectItem,
  Stack,
} from "@mantine/core";
import { useDebouncedState } from "@mantine/hooks";
import { closeAllModals } from "@mantine/modals";
import { FormEvent, useMemo, useState } from "react";
import { useGames } from "../hooks/useGames";
import { useIgdbSearch } from "../hooks/useIgdbSearch";
import { usePaths } from "../hooks/usePaths";
import { getGames, saveGames, setGames } from "../stores/games";
import { getPaths, Path, savePaths, setPaths } from "../stores/paths";
import { getGameLabel } from "../utils/game";
import { getIgdbGames } from "../utils/igdb/api";
import { queryClient } from "../utils/query";

interface Props {
  path?: Path;
}

const PathEditModal = ({ path }: Props) => {
  const { data: games } = useGames();
  const [query, setQuery] = useDebouncedState("", 500);
  const { data: igdbSearchResults, isFetching } = useIgdbSearch(query);

  const [items, setItems] = useState<SelectItem[]>(
    path?.gameIds.map((id) => {
      const game = games?.find((game) => game.id === id);

      return {
        value: id,
        label: game && getGameLabel(game),
      };
    }) || []
  );

  const value = useMemo(() => items.map((item) => item.value), [items]);

  const handleSearch = (searchQuery: string) => setQuery(searchQuery);

  const handleChange = (values: string[]) => {
    setItems(
      values.map((value) => {
        const item = items.find((item) => item.value === value);
        return (
          item || {
            value,
            label: igdbSearchResults?.find((result) => result.value === value)
              ?.label,
          }
        );
      })
    );
  };

  const handleClose = () => closeAllModals();

  const handleSave = async () => {
    const games = await getGames();

    (await getIgdbGames(value)).forEach((g) => {
      if (!games.find((game) => game.id === g.id)) games.push(g);
    });

    await setGames(games);
    await saveGames();

    const paths = await getPaths();
    const edited = paths.find((p) => p.path === path?.path);
    if (edited) edited.gameIds = value;

    await setPaths(paths);
    await savePaths();

    queryClient.invalidateQueries(["paths"]);
    queryClient.invalidateQueries(["games"]);

    handleClose();
  };

  return (
    <Stack>
      <MultiSelect
        searchable
        data={[...items, ...(igdbSearchResults || [])]}
        filter={(_value, selected, _item) => !selected}
        onSearchChange={handleSearch}
        onChange={handleChange}
        value={value}
      />
      <Group position="right">
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handleSave}>Save</Button>
      </Group>
    </Stack>
  );
};

export default PathEditModal;
