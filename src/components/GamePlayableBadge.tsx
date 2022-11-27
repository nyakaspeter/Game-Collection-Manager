import { ThemeIcon } from "@mantine/core";
import { TbCheck } from "react-icons/tb";

export const GamePlayableBadge = () => (
  <ThemeIcon
    color="green"
    variant="outline"
    radius="xl"
    size={24}
    sx={{ borderWidth: 2, borderStyle: "inset" }}
  >
    <TbCheck size={16} />
  </ThemeIcon>
);
