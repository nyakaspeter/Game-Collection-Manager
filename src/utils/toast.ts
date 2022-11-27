import { showNotification } from "@mantine/notifications";
import { TbCheck, TbX } from "react-icons/tb";
import { createElement } from "react";

export const toast = {
  success: (title: string, message?: string) => {
    showNotification({
      title,
      message,
      icon: createElement(TbCheck, { size: 18 }),
      color: "green",
    });
  },
  error: (title: string, message?: string) => {
    showNotification({
      title,
      message,
      icon: createElement(TbX, { size: 18 }),
      color: "red",
    });
  },
};
