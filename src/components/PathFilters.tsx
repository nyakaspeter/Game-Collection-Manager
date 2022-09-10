import { ActionIcon, MultiSelect, Select, Stack } from "@mantine/core";
import { IconSortAscending, IconSortDescending } from "@tabler/icons";
import { useSnapshot } from "valtio";
import { store } from "../store";
import { PathListSort } from "../store/settings";

export const PathFilters = () => {
  const { sort, collectionFilter, descending } = useSnapshot(
    store.settings.pathList
  );

  return (
    <Stack>
      <Select
        rightSection={
          <ActionIcon
            sx={{ opacity: 0.8 }}
            onClick={() => (store.settings.pathList.descending = !descending)}
          >
            {descending ? <IconSortDescending /> : <IconSortAscending />}
          </ActionIcon>
        }
        label="Sort by"
        data={Object.values(PathListSort)}
        value={sort}
        onChange={(value) =>
          (store.settings.pathList.sort = value as PathListSort)
        }
      ></Select>

      <MultiSelect
        label="Collections"
        placeholder="Select collections"
        clearable
        data={store.collections
          .map((collection) => ({
            value: collection.id,
            label: collection.name,
          }))
          .sort((a, b) => (a.label < b.label ? -1 : 1))}
        value={collectionFilter as string[]}
        onChange={(value) => (store.settings.pathList.collectionFilter = value)}
      ></MultiSelect>
    </Stack>
  );
};
