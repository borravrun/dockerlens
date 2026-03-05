import { createContext } from "react";
import type {
  AppContainer,
  ContainerActions,
  ContainerDetails,
} from "@/types";

export interface ContainerListContextType {
  containers: AppContainer[];
  loading: boolean;
  refresh: () => Promise<void>;
}

export interface SelectedContainerContextType {
  selectedContainer: AppContainer | null;
  containerDetails: ContainerDetails | null;
  setSelectedContainer: (container: AppContainer | null) => void;
  fetchContainerDetails: (id: string) => Promise<void>;
}

export interface ActionContextType {
  action: (action: ContainerActions) => Promise<void>;
}

export const ContainerListContext =
  createContext<ContainerListContextType | null>(null);
export const SelectedContainerContext =
  createContext<SelectedContainerContextType | null>(null);
export const ActionContext = createContext<ActionContextType | null>(null);
