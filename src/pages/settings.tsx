import { Box, Button, Group, Stack, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useSettings, useUpdateSettings } from "../stores/settings";

const SettingsPage = () => {
  const settings = useSettings();
  const updateSettings = useUpdateSettings();

  const form = useForm({
    initialValues: settings.data,
  });

  const handleSave = form.onSubmit((values) => {
    updateSettings.mutate(values);
  });

  return (
    <form onSubmit={handleSave}>
      <Stack>
        <Box>
          <TextInput
            label="Twitch API Client ID"
            placeholder="Client ID"
            {...form.getInputProps("twitchApiClientId")}
          />

          <TextInput
            label="Twitch API Client Secret"
            placeholder="Client Secret"
            {...form.getInputProps("twitchApiClientSecret")}
          />
        </Box>

        <Group position="right">
          <Button type="submit">Save settings</Button>
        </Group>
      </Stack>
    </form>
  );
};

export default SettingsPage;
