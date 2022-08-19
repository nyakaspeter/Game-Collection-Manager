import {
  ActionIcon,
  Box,
  Button,
  Divider,
  Group,
  MultiSelect,
  Paper,
  Stack,
  Switch,
  TextInput,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconTrash } from "@tabler/icons";
import { v4 as uuidv4 } from "uuid";
import { useCollections, useUpdateCollections } from "../stores/collections";

const CollectionsPage = () => {
  const collections = useCollections();
  const updateCollections = useUpdateCollections();

  const form = useForm({
    initialValues: { collections: collections.data || [] },
  });

  const handleSave = form.onSubmit((values) => {
    updateCollections.mutate(values.collections);
  });

  const createCollection = () => ({
    id: uuidv4(),
    name: "",
    roots: [],
    scanDirectories: true,
    scanFiles: false,
    fileTypes: [],
  });

  return (
    <form onSubmit={handleSave}>
      <Stack>
        {form.values.collections?.map((collection, index) => (
          <Paper key={collection.id} withBorder p="xs">
            <Group>
              <TextInput
                label="Collection name"
                required
                sx={{ flex: 1 }}
                {...form.getInputProps(`collections.${index}.name`)}
              />
              <Switch
                mt={24}
                label="Scan directories"
                {...form.getInputProps(`collections.${index}.scanDirectories`, {
                  type: "checkbox",
                })}
              />
              <Switch
                mt={24}
                label="Scan files"
                {...form.getInputProps(`collections.${index}.scanFiles`, {
                  type: "checkbox",
                })}
              />
              <ActionIcon
                mt={24}
                color="red"
                onClick={() => form.removeListItem("collections", index)}
              >
                <IconTrash size={16} />
              </ActionIcon>
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

        <Group position="right">
          <Button
            onClick={() =>
              form.insertListItem("collections", createCollection())
            }
          >
            Add collection
          </Button>
          <Button type="submit">Save collections</Button>
        </Group>
      </Stack>
    </form>
  );
};

export default CollectionsPage;
