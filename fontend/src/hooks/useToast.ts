import { toast } from "sonner";

/**
 * Thin wrapper around sonner toast library.
 * Use this in mutations to show success/error feedback.
 *
 * Example:
 *   const { success, error } = useToast();
 *   useMutation({ onSuccess: () => success("Added to cart! 🌿") })
 */
export function useToast() {
  return {
    success: (msg: string) =>
      toast.success(msg, {
        style: {
          background: "#f0fdf4",
          border: "1px solid #00b566",
          color: "#1c1c1c",
        },
      }),
    error: (msg: string) =>
      toast.error(msg, {
        style: {
          background: "#fef2f2",
          border: "1px solid #ef4444",
          color: "#1c1c1c",
        },
      }),
    info: (msg: string) => toast(msg),
    loading: (msg: string) => toast.loading(msg),
    dismiss: (id?: string | number) => toast.dismiss(id),
  };
}
