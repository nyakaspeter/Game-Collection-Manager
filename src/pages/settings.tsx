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
  IconTrash,
} from "@tabler/icons";
import { useMutation } from "@tanstack/react-query";
import { nanoid } from "nanoid";
import { store } from "../store";
import { saveCollections } from "../store/collections";
import { saveSettings } from "../store/settings";
import { refreshIgdbAuthHeaders } from "../utils/igdb/auth";
import { scanPaths } from "../utils/scan";
import { toast } from "../utils/toast";

const SettingsPage = () => {
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

  const handleSave = form.onSubmit(async (values) => {
    store.settings = values.settings;
    store.collections = values.collections;

    await saveSettings();
    await saveCollections();

    refreshIgdbAuthHeaders();

    toast.success("Settings saved", "Settings and collections have been saved");
  });

  const { mutate: scan, isLoading: isScanning } = useMutation(scanPaths, {
    onSuccess: ({ added, removed, fetched }) => {
      toast.success(
        "Paths scanned",
        `Found ${added} new paths, removed ${removed} old entries, and fetched data for ${fetched} games`
      );
    },
    onError: () => {
      toast.error("Scan failed", "Failed to fetch game data from IGDB");
    },
  });

  const handleScanPaths = () => scan();

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
