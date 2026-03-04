import { container_action, listenContainers } from "@/lib/invokes";
import {
  Actions,
  Container,
  ContainerActions,
  ContainerContextType,
} from "@/lib/types";
import { createContext, useContext, useEffect, useState } from "react";

const ContainerContext = createContext<ContainerContextType | null>(null);

export function ContainerProvider({ children }: { children: React.ReactNode }) {
  const [containers, setContainers] = useState<Container[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedContainer, setSelectedContainer] = useState<Container | null>(
    null,
  );

  const fetchContainers = async () => {
    try {
      setLoading(true);
      const data = await listenContainers();
      setContainers(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  async function action(containerActions: ContainerActions) {
    switch (containerActions.action) {
      case "start":
        await container_action({
          id: containerActions.id,
          action: Actions.START,
        });
        break;
      case "stop":
        await container_action({
          id: containerActions.id,
          action: Actions.STOP,
        });
        break;
      case "restart":
        await container_action({
          id: containerActions.id,
          action: Actions.RESTART,
        });
        break;
      case "remove":
        await container_action({
          id: containerActions.id,
          action: Actions.REMOVE,
        });
        break;
    }
    await fetchContainers();
  }

  useEffect(() => {
    const interval = setInterval(() => {
      fetchContainers();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <ContainerContext.Provider
      value={{
        containers,
        loading,
        refresh: fetchContainers,
        action,
        selectedContainer,
        setSelectedContainer,
      }}
    >
      {children}
    </ContainerContext.Provider>
  );
}

export function useContainerContext() {
  const context = useContext(ContainerContext);
  if (!context) {
    throw new Error(
      "useContainerContext must be used within a ContainerProvider",
    );
  }
  return context;
}
