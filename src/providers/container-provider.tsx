import {
  containerAction,
  getContainers,
  getContainer,
} from "@/services";
import type { AppContainer, ContainerActions, ContainerDetails } from "@/types";
import { listen } from "@tauri-apps/api/event";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ActionContext,
  ContainerListContext,
  SelectedContainerContext,
} from "./contexts";

export function ContainerProvider({ children }: { children: React.ReactNode }) {
  const [containers, setContainers] = useState<AppContainer[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedContainer, setSelectedContainerState] =
    useState<AppContainer | null>(null);
  const [containerDetails, setContainerDetails] =
    useState<ContainerDetails | null>(null);
  const selectedContainerRef = useRef<AppContainer | null>(null);

  const setSelectedContainer = useCallback(
    (container: AppContainer | null) => {
      selectedContainerRef.current = container;
      setSelectedContainerState(container);
    },
    [],
  );

  const updateContainers = useCallback((data: AppContainer[]) => {
    setContainers(data);
    const current = selectedContainerRef.current;
    if (current) {
      const updated = data.find((c) => c.id === current.id);
      if (updated) {
        selectedContainerRef.current = updated;
        setSelectedContainerState(updated);
      } else {
        selectedContainerRef.current = null;
        setSelectedContainerState(null);
        setContainerDetails(null);
      }
    }
  }, []);

  const fetchContainers = useCallback(async () => {
    try {
      setLoading(true);
      updateContainers(await getContainers());
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [updateContainers]);

  const fetchContainerDetails = useCallback(async (id: string) => {
    try {
      setContainerDetails(await getContainer(id));
    } catch (err) {
      console.error(err);
    }
  }, []);

  const action = useCallback(async (containerActions: ContainerActions) => {
    await containerAction(containerActions);
  }, []);

  useEffect(() => {
    fetchContainers();

    const unlisten = listen<AppContainer[]>("containers-changed", (event) => {
      updateContainers(event.payload);
    });

    return () => {
      unlisten.then((fn) => fn());
    };
  }, [fetchContainers, updateContainers]);

  const listValue = useMemo(
    () => ({ containers, loading, refresh: fetchContainers }),
    [containers, loading, fetchContainers],
  );

  const selectedValue = useMemo(
    () => ({
      selectedContainer,
      containerDetails,
      setSelectedContainer,
      fetchContainerDetails,
    }),
    [
      selectedContainer,
      containerDetails,
      setSelectedContainer,
      fetchContainerDetails,
    ],
  );

  const actionValue = useMemo(() => ({ action }), [action]);

  return (
    <ActionContext.Provider value={actionValue}>
      <ContainerListContext.Provider value={listValue}>
        <SelectedContainerContext.Provider value={selectedValue}>
          {children}
        </SelectedContainerContext.Provider>
      </ContainerListContext.Provider>
    </ActionContext.Provider>
  );
}
