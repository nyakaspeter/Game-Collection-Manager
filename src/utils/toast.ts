import { showNotification } from "@mantine/notifications";
import { IconCheck, IconX } from "@tabler/icons";
import { createElement } from "react";

export const toast = {
  success: (title: string, message?: string) => {
    showNotification({
      title,
      message,
      icon: createElement(IconCheck, { size: 18 }),
      color: "green",
    });
  },
  error: (title: string, message?: string) => {
    showNotification({
      title,
      message,
      icon: createElement(IconX, { size: 18 }),
      color: "red",
    });
  },
};
