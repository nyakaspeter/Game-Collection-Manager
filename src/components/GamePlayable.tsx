import { ThemeIcon } from "@mantine/core";
import { IconCheck } from "@tabler/icons";

export const GamePlayable = ({ playable }: { playable?: boolean }) => {
  if (!playable) return null;

  return (
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
};
