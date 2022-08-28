import { Button, Group, MultiSelect, SelectItem, Stack } from "@mantine/core";
import { useDebouncedState } from "@mantine/hooks";
import { closeAllModals } from "@mantine/modals";
import { useMemo, useState } from "react";
import { useEditPath } from "../hooks/useEditPath";
import { useIgdbSearch } from "../hooks/useIgdbSearch";
import { store } from "../store";
import { Game } from "../store/games";
import { Path } from "../store/paths";
import { getGameLabel } from "../utils/game";

export const PathEditor = ({ path }: { path?: Path }) => {
  const [query, setQuery] = useDebouncedState("", 500);

  const [selectItems, setSelectItems] = useState<SelectItem[]>(
    path?.gameIds.map((id) => {
      const game = store.games.find((game) => game.id === id);

      return {
        value: id,
        label: (game && getGameLabel(game as Game)) || id,
      };
    }) || []
  );

  const selectValues = useMemo(
    () => selectItems.map((item) => item.value),
    [selectItems]
  );

  const { data: searchResults, remove: clearSearchResults } =
    useIgdbSearch(query);

  const { mutate: save, isLoading: isSaving } = useEditPath(path, {
    onSuccess: () => handleClose(),
  });

  const handleSearch = (searchQuery: string) => setQuery(searchQuery);

  const handleChange = (values: string[]) => {
    setSelectItems(
      values.map((value) => {
        const item = selectItems.find((item) => item.value === value);
        return (
          item || {
            value,
            label: searchResults?.find((result) => result.value === value)
              ?.label,
          }
        );
      })
    );
    clearSearchResults();
  };

  const handleClose = () => closeAllModals();

  const handleSave = () => save(selectValues);

  return (
    <Stack>
      <MultiSelect
        searchable
        data={[...selectItems, ...(searchResults || [])]}
        filter={(_value, selected, _item) => !selected}
        onSearchChange={handleSearch}
        onChange={handleChange}
        value={selectValues}
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
