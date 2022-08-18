import { Button, Group, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useSettings, useUpdateSettings } from "../stores/settings";

const Settings = () => {
  const settings = useSettings();
  const updateSettings = useUpdateSettings();

  const form = useForm({
    initialValues: settings.data,
  });

  const handleSave = form.onSubmit((values) => updateSettings.mutate(values));

  return (
    <form onSubmit={handleSave}>
      <TextInput
        label="Client ID"
        placeholder="Client ID"
        {...form.getInputProps("twitchApiClientId")}
      />

      <TextInput
        label="Client Secret"
        placeholder="Client Secret"
        {...form.getInputProps("twitchApiClientSecret")}
      />

      <Group position="right" mt="md">
        <Button type="submit">Submit</Button>
      </Group>
    </form>
  );
};

export default Settings;
