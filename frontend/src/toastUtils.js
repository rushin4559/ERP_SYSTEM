// src/utils/toastUtils.js
import { useToast } from "./components/customers/ToastProvider";

export function useCustomToast() {
  const { addToast } = useToast();

  const showSuccess = (message) => {
    addToast(message, "success");
  };

  const showError = (message) => {
    addToast(message, "error");
  };

  const showInfo = (message) => {
    addToast(message, "info");
  };

  const showWarning = (message) => {
    addToast(message, "warning");
  };

  return { showSuccess, showError, showInfo, showWarning };
}
