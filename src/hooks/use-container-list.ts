import { useContext } from "react";
import { ContainerListContext } from "@/providers/contexts";

export function useContainerList() {
  const context = useContext(ContainerListContext);
  if (!context) {
    throw new Error("useContainerList must be used within a ContainerProvider");
  }
  return context;
}
