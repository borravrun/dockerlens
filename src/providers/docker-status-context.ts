import { createContext } from "react";

export interface DockerStatusContextType {
  connected: boolean | null;
  retry: () => Promise<void>;
}

export const DockerStatusContext =
  createContext<DockerStatusContextType | null>(null);
