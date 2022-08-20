import { Box, Button, Group, Stack, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useScanPaths, useSettings, useUpdateSettings } from "../utils/query";

const SettingsPage = () => {
  const settings = useSettings();
  const updateSettings = useUpdateSettings();
  const scanPaths = useScanPaths();

  const form = useForm({
    initialValues: settings.data,
  });

  const handleSave = form.onSubmit((values) => {
    updateSettings.mutate(values);
  });

  const handleScanPaths = () => scanPaths.mutate();

  return (
    <form onSubmit={handleSave}>
      <Stack>
        <Box>
          <TextInput
            label="Twitch API Client ID"
            {...form.getInputProps("twitchApiClientId")}
          />

          <TextInput
            label="Twitch API Client Secret"
            {...form.getInputProps("twitchApiClientSecret")}
          />
        </Box>

        <Group position="right">
          <Button onClick={handleScanPaths}>Rescan paths</Button>
          <Button type="submit">Save settings</Button>
        </Group>
      </Stack>
    </form>
  );
};

export default SettingsPage;
