import { invoke } from "@tauri-apps/api/core";
import type { AppContainer, AppImage, ContainerActions, ContainerDetails } from "@/types";

export async function checkDocker(): Promise<boolean> {
  return (await invoke("check_docker")) as boolean;
}

export async function getContainers(): Promise<AppContainer[]> {
  return (await invoke("list_containers")) as AppContainer[];
}

export async function containerAction({
  id,
  action,
}: ContainerActions): Promise<void> {
  return await invoke("container_action", { id, action });
}

export async function getContainer(id: string): Promise<ContainerDetails> {
  return (await invoke("get_container", { id })) as ContainerDetails;
}

export async function getImages(): Promise<AppImage[]> {
  return (await invoke("list_images")) as AppImage[];
}

export async function runImage(image: string): Promise<string> {
  return (await invoke("run_image", { image })) as string;
}

export async function deleteImage(id: string): Promise<void> {
  return await invoke("delete_image", { id });
}

export async function pullImage(image: string): Promise<void> {
  return await invoke("pull_image", { image });
}

export async function streamLogs(id: string): Promise<void> {
  return await invoke("stream_logs", { id });
}

export async function streamStats(id: string): Promise<void> {
  return await invoke("stream_stats", { id });
}
