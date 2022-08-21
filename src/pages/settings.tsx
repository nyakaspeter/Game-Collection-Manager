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
import { nanoid } from "nanoid";
import { useEffect } from "react";
import {
  useCollections,
  useScanPaths,
  useSettings,
  useUpdateSettingsAndCollections,
} from "../utils/query";

const SettingsPage = () => {
  const { data: settings } = useSettings();
  const { data: collections } = useCollections();

  const { mutate: updateSettingsAndCollections } =
    useUpdateSettingsAndCollections();

  const { mutate: scanPaths } = useScanPaths();

  const form = useForm({
    initialValues: { settings: settings!!, collections: collections!! },
  });

  const handleSave = form.onSubmit((values) => {
    updateSettingsAndCollections(values);
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
                    <IconTrash size={16} />
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
            leftIcon={<IconPlus size={14} />}
            onClick={handleAddCollection}
          >
            Add collection
          </Button>

          <Group>
            <Button
              leftIcon={<IconRefresh size={14} />}
              onClick={handleScanPaths}
            >
              Rescan paths
            </Button>

            <Button leftIcon={<IconDeviceFloppy size={14} />} type="submit">
              Save settings
            </Button>
          </Group>
        </Group>
      </Stack>
    </form>
  );
};

export default SettingsPage;
