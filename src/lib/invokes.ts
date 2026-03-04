import { invoke } from "@tauri-apps/api/core";
import { Container, ContainerActions } from "./types";

export async function listenContainers(): Promise<Container[]> {
  const connections = (await invoke("list_containers")) as Container[];
  return connections;
}

export async function container_action({ id, action }: ContainerActions) {
  const res = await invoke("container_action", { id, action });
  return res;
}
