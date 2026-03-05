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

export interface ContainerContextType {
  containers: AppContainer[];
  selectedContainer: AppContainer | null;
  containerDetails: ContainerDetails | null;
  loading: boolean;
  refresh: () => Promise<void>;
  action: (action: ContainerActions) => Promise<void>;
  setSelectedContainer: (container: AppContainer | null) => void;
  fetchContainerDetails: (id: string) => Promise<void>;
}
