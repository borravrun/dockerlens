import { useContext } from "react";
import { DockerStatusContext } from "@/providers/docker-status-context";

export function useDockerStatus() {
  const context = useContext(DockerStatusContext);
  if (!context) {
    throw new Error(
      "useDockerStatus must be used within a DockerStatusProvider",
    );
  }
  return context;
}
