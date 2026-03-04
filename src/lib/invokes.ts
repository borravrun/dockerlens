import { invoke } from "@tauri-apps/api/core"
import { Container } from "./types";

export async function listenContainers(): Promise<Container[]> {
  const connections = await invoke("list_containers") as Container[];
  return connections;
}