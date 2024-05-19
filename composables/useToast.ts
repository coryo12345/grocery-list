export interface FullToasterMessage {
  type: "success" | "error" | "info";
  icon: string;
  message: string;
}

export type ToastMessage = string;

export type ToasterCallback = (msg: FullToasterMessage) => void;

const toasters: ToasterCallback[] = [];

export function useToast() {
  const registerToaster = (callback: ToasterCallback) => {
    toasters.push(callback);
  };

  const success = (msg: ToastMessage) => {
    toasters.forEach((toaster) => {
      toaster({
        type: "success",
        icon: "mdi-check-circle-outline",
        message: msg,
      });
    });
  };

  const error = (msg: ToastMessage) => {
    toasters.forEach((toaster) => {
      toaster({
        type: "error",
        icon: "mdi-alert-circle-outline",
        message: msg,
      });
    });
  };

  const info = (msg: ToastMessage) => {
    toasters.forEach((toaster) => {
      toaster({
        type: "info",
        icon: "mdi-information-outline",
        message: msg,
      });
    });
  };

  return {
    registerToaster,
    success,
    error,
    info,
  };
}
