import { ThemeIcon } from "@mantine/core";
import { IconCheck } from "@tabler/icons";

export const GamePlayableBadge = () => (
  <ThemeIcon
    color="green"
    variant="outline"
    radius="xl"
    size={24}
    sx={{ borderWidth: 2, borderStyle: "inset" }}
  >
    <IconCheck size={16} />
  </ThemeIcon>
);
