import {
  ActionIcon,
  Button,
  Checkbox,
  Group,
  MultiSelect,
  Paper,
  ScrollArea,
  Stack,
  TextInput,
  Tooltip,
  useMantineTheme,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import {
  IconDeviceFloppy,
  IconFileSearch,
  IconPlus,
  IconRefresh,
  IconTrash,
} from "@tabler/icons";
import { nanoid } from "nanoid";
import { useEditSettings } from "../hooks/useEditSettings";
import { useRefreshAuthHeaders } from "../hooks/useRefreshAuthHeaders";
import { useRefreshGames } from "../hooks/useRefreshGames";
import { useRemoveUnusedData } from "../hooks/useRemoveUnusedData";
import { useScanPaths } from "../hooks/useScanPaths";
import { store } from "../store";

const SettingsPage = () => {
  const theme = useMantineTheme();
  const { mutate: scanPaths, isLoading: isScanning } = useScanPaths();
  const { mutate: refreshGames, isLoading: isRefreshing } = useRefreshGames();
  const { mutate: cleanDatabase, isLoading: isCleaning } =
    useRemoveUnusedData();
  const { mutate: refreshAuthHeaders } = useRefreshAuthHeaders();

  const { mutate: save } = useEditSettings({
    onSuccess: () => {
      refreshAuthHeaders();
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

  const handleRemoveUnusedData = () => cleanDatabase();
  const handleRefreshGames = () => refreshGames();
  const handleScanPaths = () => scanPaths();
  const handleSave = form.onSubmit((values) => save(values));

  return (
    <form onSubmit={handleSave}>
      <Stack
        justify="space-between"
        sx={{ height: `calc(100vh - ${2 * theme.spacing.md}px)` }}
      >
        <ScrollArea>
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
                      {...form.getInputProps(
                        `collections.${index}.readyToPlay`,
                        {
                          type: "checkbox",
                        }
                      )}
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
                      form.setFieldValue(
                        `collections.${index}.fileTypes`,
                        value
                      )
                    }
                  />
                )}
              </Paper>
            ))}
          </Stack>
        </ScrollArea>

        <Group position="apart">
          <Button
            leftIcon={<IconPlus size={18} />}
            onClick={handleAddCollection}
          >
            Add collection
          </Button>

          <Group>
            <Button
              leftIcon={<IconTrash size={18} />}
              loading={isCleaning}
              onClick={handleRemoveUnusedData}
            >
              Clean database
            </Button>

            <Button
              leftIcon={<IconRefresh size={18} />}
              loading={isRefreshing}
              onClick={handleRefreshGames}
            >
              Refresh games
            </Button>

            <Button
              leftIcon={<IconFileSearch size={18} />}
              loading={isScanning}
              onClick={handleScanPaths}
            >
              Scan paths
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
