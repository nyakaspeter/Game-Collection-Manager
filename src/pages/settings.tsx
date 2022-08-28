import {
  ActionIcon,
  Button,
  Checkbox,
  Group,
  MultiSelect,
  Paper,
  Stack,
  TextInput,
  Tooltip,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import {
  IconDeviceFloppy,
  IconPlus,
  IconRefresh,
  IconSearch,
  IconTrash,
} from "@tabler/icons";
import { nanoid } from "nanoid";
import { useEditSettings } from "../hooks/useEditSettings";
import { useRefreshAuthHeaders } from "../hooks/useRefreshAuthHeaders";
import { useRefreshGames } from "../hooks/useRefreshGames";
import { useScanPaths } from "../hooks/useScanPaths";
import { store } from "../store";

const SettingsPage = () => {
  const { mutate: scanPaths, isLoading: isScanning } = useScanPaths();
  const { mutate: refreshGames, isLoading: isRefreshing } = useRefreshGames();
  const { mutateAsync: refreshAuthHeaders } = useRefreshAuthHeaders();

  const { mutate: save } = useEditSettings({
    onSuccess: () => {
      setTimeout(async () => {
        try {
          await refreshAuthHeaders();
          scanPaths();
        } catch (error) {
          console.error(error);
        }
      }, 1000);
    },
  });

  const form = useForm({
    initialValues: { settings: store.settings, collections: store.collections },
  });

  const handleAddCollection = () =>
    form.insertListItem("collections", {
      id: nanoid(),
      name: "",
      roots: [],
      scanDirectories: true,
      scanFiles: false,
      fileTypes: [],
    });

  const handleRemoveCollection = (index: number) =>
    form.removeListItem("collections", index);

  const handleSave = form.onSubmit((values) => save(values));

  const handleRefreshGames = () => refreshGames();

  const handleScanPaths = () => scanPaths();

  return (
    <form onSubmit={handleSave}>
      <Stack>
        <Paper withBorder p="xs">
          <TextInput
            label="Twitch API Client ID"
            {...form.getInputProps("settings.twitchApiClientId")}
          />

          <TextInput
            label="Twitch API Client Secret"
            {...form.getInputProps("settings.twitchApiClientSecret")}
          />
        </Paper>

        {form.values.collections?.map((collection, index) => (
          <Paper key={collection.id} withBorder p="xs">
            <Group>
              <TextInput
                label="Collection name"
                required
                sx={{ flex: 1 }}
                {...form.getInputProps(`collections.${index}.name`)}
              />

              <Group mt={24}>
                <Checkbox
                  label="Ready to play"
                  {...form.getInputProps(`collections.${index}.readyToPlay`, {
                    type: "checkbox",
                  })}
                />

                <Checkbox
                  label="Scan directories"
                  {...form.getInputProps(
                    `collections.${index}.scanDirectories`,
                    {
                      type: "checkbox",
                    }
                  )}
                />

                <Checkbox
                  label="Scan files"
                  {...form.getInputProps(`collections.${index}.scanFiles`, {
                    type: "checkbox",
                  })}
                />

                <Tooltip label="Remove collection">
                  <ActionIcon
                    color="red"
                    onClick={() => handleRemoveCollection(index)}
                  >
                    <IconTrash size={18} />
                  </ActionIcon>
                </Tooltip>
              </Group>
            </Group>

            <MultiSelect
              label="Scan roots"
              getCreateLabel={(query) => `+ ${query}`}
              searchable
              creatable
              clearable
              data={collection.roots}
              defaultValue={collection.roots}
              onChange={(value) =>
                form.setFieldValue(`collections.${index}.roots`, value)
              }
            />

            {collection.scanFiles && (
              <MultiSelect
                label="File types"
                getCreateLabel={(query) => `+ ${query}`}
                searchable
                creatable
                clearable
                data={collection.fileTypes}
                defaultValue={collection.fileTypes}
                onChange={(value) =>
                  form.setFieldValue(`collections.${index}.fileTypes`, value)
                }
              />
            )}
          </Paper>
        ))}

        <Group position="apart">
          <Button
            leftIcon={<IconPlus size={18} />}
            onClick={handleAddCollection}
          >
            Add collection
          </Button>

          <Group>
            <Button
              leftIcon={<IconRefresh size={18} />}
              loading={isRefreshing}
              onClick={handleRefreshGames}
            >
              Refresh all game data
            </Button>

            <Button
              leftIcon={<IconSearch size={18} />}
              loading={isScanning}
              onClick={handleScanPaths}
            >
              Rescan paths
            </Button>

            <Button leftIcon={<IconDeviceFloppy size={18} />} type="submit">
              Save settings
            </Button>
          </Group>
        </Group>
      </Stack>
    </form>
  );
};

export default SettingsPage;
