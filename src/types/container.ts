export interface AppContainer {
  id: string;
  name: string;
  image: string;
  state: string;
  status: string;
}

export interface ContainerDetails extends AppContainer {
  created: string;
  ports: string[];
  mounts: string[];
  restart_policy: string;
}

export enum Actions {
  START = "start",
  STOP = "stop",
  RESTART = "restart",
  REMOVE = "remove",
}

export interface ContainerActions {
  id: string;
  action: Actions;
}

export interface LogEntry {
  stream: string;
  message: string;
}

export interface AppImage {
  id: string;
  tags: string[];
  size: number;
  created: number;
  containers: number;
}

export interface ContainerStats {
  cpu_percent: number;
  memory_usage: number;
  memory_limit: number;
  memory_percent: number;
  network_rx: number;
  network_tx: number;
  block_read: number;
  block_write: number;
  pids: number;
  timestamp: number;
}
