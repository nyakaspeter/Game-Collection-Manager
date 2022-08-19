import { showNotification } from "@mantine/notifications";
import { IconCheck } from "@tabler/icons";
import { createElement } from "react";

export const showSuccessToast = (title: string, message?: string) => {
  showNotification({
    title,
    message,
    icon: createElement(IconCheck, { size: 18 }),
    color: "teal",
  });
};
