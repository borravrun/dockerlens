import { useContext } from "react";
import { ActionContext } from "@/providers/contexts";

export function useContainerAction() {
  const context = useContext(ActionContext);
  if (!context) {
    throw new Error(
      "useContainerAction must be used within a ContainerProvider",
    );
  }
  return context;
}
