import {
  ActionIcon,
  Checkbox,
  Group,
  MultiSelect,
  Select,
  Stack,
} from "@mantine/core";
import { IconSortAscending, IconSortDescending } from "@tabler/icons";
import { useSnapshot } from "valtio";
import modes from "../data/game_modes.json";
import genres from "../data/genres.json";
import { store } from "../store";
import { GameListSort, GameStatus } from "../store/settings";

export const GameFilters = () => {
  const {
    sort,
    collectionFilter,
    descending,
    fadeNotReady,
    fadePlayed,
    genreFilter,
    modeFilter,
    statusFilter,
  } = useSnapshot(store.settings.gameList);

  return (
    <Stack>
      <Select
        rightSection={
          <ActionIcon
            sx={{ opacity: 0.8 }}
            onClick={() => (store.settings.gameList.descending = !descending)}
          >
            {descending ? <IconSortDescending /> : <IconSortAscending />}
          </ActionIcon>
        }
        label="Sort by"
        data={Object.values(GameListSort)}
        value={sort}
        onChange={(value) =>
          (store.settings.gameList.sort = value as GameListSort)
        }
      ></Select>

      <MultiSelect
        label="Genres"
        placeholder="Select genres"
        clearable
        data={genres
          .map((genre) => ({
            value: genre.id.toString(),
            label: genre.short || genre.name,
          }))
          .sort((a, b) => (a.label < b.label ? -1 : 1))}
        value={genreFilter as string[]}
        onChange={(value) => (store.settings.gameList.genreFilter = value)}
      ></MultiSelect>

      <MultiSelect
        label="Game modes"
        placeholder="Select game modes"
        clearable
        data={modes.map((mode) => ({
          value: mode.id.toString(),
          label: mode.name,
        }))}
        value={modeFilter as string[]}
        onChange={(value) => (store.settings.gameList.modeFilter = value)}
      ></MultiSelect>

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
        onChange={(value) => (store.settings.gameList.collectionFilter = value)}
      ></MultiSelect>

      <Select
        label="Status"
        placeholder="Select status"
        clearable
        data={Object.values(GameStatus)}
        value={statusFilter}
        onChange={(value) =>
          (store.settings.gameList.statusFilter = value as GameStatus)
        }
      ></Select>

      <Group position="apart">
        <Checkbox
          label="Fade played"
          checked={fadePlayed}
          onChange={(e) =>
            (store.settings.gameList.fadePlayed = e.target.checked)
          }
        />
        <Checkbox
          label="Fade not ready"
          checked={fadeNotReady}
          onChange={(e) =>
            (store.settings.gameList.fadeNotReady = e.target.checked)
          }
        />
      </Group>

      {/* <Group position="apart">
        <Button>
          <IconX />
        </Button>
        <Button variant="outline">
          <IconCheck />
        </Button>
      </Group> */}
    </Stack>
  );
};
