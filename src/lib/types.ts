export interface Container {
  id: string;
  name: string;
  image: string;
  state: string;
  status: string;
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
  containers: Container[];
  selectedContainer: Container;
  loading: boolean;
  refresh: () => Promise<void>;
  action: (action: ContainerActions) => Promise<void>;
  setSelectedContainer: (container: Container) => void;
}
