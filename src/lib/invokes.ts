import { invoke } from "@tauri-apps/api/core";
import { AppContainer, ContainerActions, ContainerDetails } from "./types";

export async function getContainers(): Promise<AppContainer[]> {
  return (await invoke("list_containers")) as AppContainer[];
}

export async function containerAction({ id, action }: ContainerActions) {
  return await invoke("container_action", { id, action });
}

export async function getContainer(id: string): Promise<ContainerDetails> {
  return (await invoke("get_container", { id })) as ContainerDetails;
}
