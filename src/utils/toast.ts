import { DefaultMantineColor } from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import { IconCheck, IconX } from "@tabler/icons";
import { createElement, ReactNode } from "react";

type ToastType = "success" | "error";

export const showToast = (type: ToastType, title: string, message?: string) => {
  let icon: ReactNode;
  let color: DefaultMantineColor;

  switch (type) {
    case "success":
      icon = createElement(IconCheck, { size: 18 });
      color = "teal";
      break;
    case "error":
      icon = createElement(IconX, { size: 18 });
      color = "red";
      break;
  }

  showNotification({
    title,
    message,
    icon,
    color,
  });
};
