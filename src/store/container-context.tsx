import { containerAction, getContainers, getContainer } from "@/lib/invokes";
import {
  AppContainer,
  ContainerActions,
  ContainerContextType,
  ContainerDetails,
} from "@/lib/types";
import { listen } from "@tauri-apps/api/event";
import { createContext, useContext, useEffect, useRef, useState } from "react";

const ContainerContext = createContext<ContainerContextType | null>(null);

export function ContainerProvider({ children }: { children: React.ReactNode }) {
  const [containers, setContainers] = useState<AppContainer[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedContainer, setSelectedContainer] =
    useState<AppContainer | null>(null);
  const [containerDetails, setContainerDetails] =
    useState<ContainerDetails | null>(null);
  const selectedContainerRef = useRef<AppContainer | null>(null);

  useEffect(() => {
    selectedContainerRef.current = selectedContainer;
  }, [selectedContainer]);

  const updateContainers = (data: AppContainer[]) => {
    setContainers(data);
    const current = selectedContainerRef.current;
    if (current) {
      const updated = data.find((c) => c.id === current.id);
      setSelectedContainer(updated ?? null);
      if (!updated) setContainerDetails(null);
    }
  };

  const fetchContainers = async () => {
    try {
      setLoading(true);
      updateContainers(await getContainers());
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchContainerDetails = async (id: string) => {
    try {
      setContainerDetails(await getContainer(id));
    } catch (err) {
      console.error(err);
    }
  };

  const action = async (containerActions: ContainerActions) => {
    await containerAction(containerActions);
  };

  useEffect(() => {
    fetchContainers();

    const unlisten = listen<AppContainer[]>("containers-changed", (event) => {
      updateContainers(event.payload);
    });

    return () => {
      unlisten.then((fn) => fn());
    };
  }, []);

  return (
    <ContainerContext.Provider
      value={{
        containers,
        loading,
        refresh: fetchContainers,
        action,
        selectedContainer,
        containerDetails,
        setSelectedContainer,
        fetchContainerDetails,
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
