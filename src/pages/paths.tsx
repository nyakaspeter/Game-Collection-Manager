import {
  ActionIcon,
  Group,
  Popover,
  Stack,
  TextInput,
  Tooltip,
  useMantineTheme,
} from "@mantine/core";
import { useDebouncedState } from "@mantine/hooks";
import { MdFilterList } from "react-icons/md";
import { sep } from "@tauri-apps/api/path";
import { ChangeEvent, useMemo } from "react";
import { useSnapshot } from "valtio";
import { PathFilters } from "../components/PathFilters";
import { PathsTable } from "../components/PathsTable";
import { store } from "../store";
import { PathListItem } from "../store/paths";
import { PathListSort } from "../store/settings";

const PathsPage = () => {
  const theme = useMantineTheme();

  const { pathList } = useSnapshot(store);

  const { sort, collectionFilter, descending } = useSnapshot(
    store.settings.pathList
  );

  const [query, setQuery] = useDebouncedState("", 200);

  const filteredPathList = useMemo(() => {
    let list = pathList as PathListItem[];

    list = list = list.filter(
      (item) =>
        (!query || item.path.toLowerCase().includes(query.toLowerCase())) &&
        (!collectionFilter.length ||
          collectionFilter.find((collectionId) =>
            item.collections.find((c) => c.id === collectionId)
          ))
    );

    list.sort((a, b) => {
      let comparison = 0;

      if (sort === PathListSort.Name) {
        comparison =
          (a.path.split(sep).pop()?.toLowerCase() || "") <
          (b.path.split(sep).pop()?.toLowerCase() || "")
            ? -1
            : 1;
      } else if (sort === PathListSort.Added) {
        comparison = a.added < b.added ? -1 : 1;
      }

      return descending ? -comparison : comparison;
    });

    return list;
  }, [pathList, query, collectionFilter, sort, descending]);

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setQuery(event.currentTarget.value);
  };

  return (
    <Stack sx={{ height: `calc(100vh - ${2 * theme.spacing.md}px)` }}>
      <TextInput
        placeholder="Search..."
        rightSection={
          <Group noWrap spacing="xs" mr={2}>
            <Popover width={300} position="bottom-end" withArrow>
              <Popover.Target>
                <Tooltip label="Filter and sort" position="left">
                  <ActionIcon>
                    <MdFilterList opacity={0.8} />
                  </ActionIcon>
                </Tooltip>
              </Popover.Target>
              <Popover.Dropdown>
                <PathFilters />
              </Popover.Dropdown>
            </Popover>
          </Group>
        }
        defaultValue={query}
        onChange={handleInputChange}
      />

      <PathsTable paths={filteredPathList} />
    </Stack>
  );
};

export default PathsPage;
