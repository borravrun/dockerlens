import { useContext } from "react";
import { SelectedContainerContext } from "@/providers/contexts";

export function useSelectedContainer() {
  const context = useContext(SelectedContainerContext);
  if (!context) {
    throw new Error(
      "useSelectedContainer must be used within a ContainerProvider",
    );
  }
  return context;
}
