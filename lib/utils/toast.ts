import { toast } from "sonner";

const baseStyle = {
  fontSize: "14px",
};

type Option = { id?: string; duration?: number; icon?: string } | undefined;

export const toastSuccess = (message: string, options?: Option) =>
  toast.success(message, {
    // icon: options?.icon === "default" ? undefined : options?.icon ? options?.icon : "👍🏽",
    id: options?.id,
    style: { ...baseStyle },
    duration: options?.duration || 2000,
  });

export const toastError = (message: string, options?: Option) =>
  toast.error(message, {
    // icon: options?.icon === "default" ? undefined : options?.icon ? options?.icon : "❌",
    id: options?.id,
    style: { ...baseStyle },
    duration: options?.duration || 2000,
  });

export const toastLoading = (message: string, options?: Option) =>
  toast.loading(message, {
    // icon: options?.icon === "default" ? undefined : options?.icon ? options?.icon : "⌛",
    id: options?.id,
    style: { ...baseStyle },
    duration: options?.duration || 2000,
  });
