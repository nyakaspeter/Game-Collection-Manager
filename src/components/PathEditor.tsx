import { Button, Group, MultiSelect, Stack } from "@mantine/core";
import { useDebouncedState } from "@mantine/hooks";
import { closeAllModals } from "@mantine/modals";
import { useMemo, useState } from "react";
import { useSnapshot } from "valtio";
import { useEditPath } from "../hooks/useEditPath";
import { useIgdbSearch } from "../hooks/useIgdbSearch";
import { store } from "../store";
import { Game } from "../store/games";
import { PathListItem } from "../store/paths";
import { getGameLabel } from "../utils/game";

export const PathEditor = ({ pathId }: { pathId: string }) => {
  const path = useSnapshot(store).pathList.find(
    (p) => p.path === pathId
  ) as PathListItem;

  const [query, setQuery] = useDebouncedState("", 500);

  const { data: searchResults, remove: clearSearchResults } =
    useIgdbSearch(query);

  const { mutate: save, isLoading: isSaving } = useEditPath(path, {
    onSuccess: () => handleClose(),
  });

  const [selectItems, setSelectItems] = useState(
    path.games.map((game) => ({
      game,
      value: game.id,
      label: getGameLabel(game, true, true, true, false, true),
    })) || []
  );

  const searchResultItems = useMemo(
    () =>
      searchResults?.map((game) => ({
        game,
        value: game.id,
        label: getGameLabel(game, true, true, true, false, true),
      })) || [],
    [searchResults]
  );

  const selectValues = useMemo(
    () => selectItems.map((item) => item.value),
    [selectItems]
  );

  const handleSearch = (searchQuery: string) => setQuery(searchQuery);

  const handleChange = (gameIds: string[]) => {
    const items: {
      game: Game;
      value: string;
      label: string;
    }[] = [];

    gameIds.forEach((id) => {
      const item =
        selectItems.find((item) => item.value === id) ||
        searchResultItems.find((item) => item.value === id);

      if (item) items.push(item);
    });

    setSelectItems(items);
    clearSearchResults();
  };

  const handleClose = () => closeAllModals();

  const handleSave = () => save(selectItems.map((item) => item.game!!));

  return (
    <Stack>
      <MultiSelect
        searchable
        data={[...selectItems, ...(searchResultItems || [])]}
        filter={(_value, selected, _item) => !selected}
        onSearchChange={handleSearch}
        onChange={handleChange}
        value={selectValues}
      />
      <Group position="right">
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handleSave} loading={isSaving}>
          Save
        </Button>
      </Group>
    </Stack>
  );
};
