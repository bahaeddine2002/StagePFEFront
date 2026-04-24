export type ToastType = "success" | "error";

export interface ToastItem {
  type: ToastType;
  title: string;
  message: string;
}
