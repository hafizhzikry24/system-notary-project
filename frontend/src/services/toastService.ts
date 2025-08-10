
import { toast } from "react-hot-toast";

/**
 * show toast success message
 * @param message message to display
 * @description Displays a success toast notification with a custom background and text color.
 * The toast will automatically disappear after 3 seconds.
 */
export const showSuccess = (message: string) => {
  toast.success(message, {
    duration: 3000,
    style: {
      background: "#4ade80",
      color: "#fff",
    },
  });
};

/**
 * show toast error message
 * @param message message to display
 * @description Displays an error toast notification with a custom background and text color.
 * The toast will automatically disappear after 4 seconds.
 */
export const showError = (message: string) => {
  toast.error(message, {
    duration: 4000,
    style: {
      background: "#ef4444",
      color: "#fff",
    },
  });
};

/**
 * show toast validation message
 * @param message message to display
 * @description Displays an validation toast notification with a custom background and text color.
 * The toast will automatically disappear after 4 seconds.
 */
export const showValidationErrors = (errors: Record<string, string[]>) => {
  Object.values(errors).forEach((messages) => {
    messages.forEach((msg) => {
      toast.error(msg, {
        duration: 4000,
        style: {
          background: "#f97316",
          color: "#fff",
        },
      });
    });
  });
};
