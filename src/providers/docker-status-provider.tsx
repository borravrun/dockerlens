import { checkDocker } from "@/services";
import { listen } from "@tauri-apps/api/event";
import { useCallback, useEffect, useMemo, useState } from "react";
import { DockerStatusContext } from "./docker-status-context";

export function DockerStatusProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [connected, setConnected] = useState<boolean | null>(null);

  const retry = useCallback(async () => {
    setConnected(null);
    setConnected(await checkDocker());
  }, []);

  useEffect(() => {
    checkDocker().then(setConnected);

    const unlisten = listen<boolean>("docker-status", (event) => {
      setConnected(event.payload);
    });

    return () => {
      unlisten.then((fn) => fn());
    };
  }, []);

  const value = useMemo(() => ({ connected, retry }), [connected, retry]);

  return (
    <DockerStatusContext.Provider value={value}>
      {children}
    </DockerStatusContext.Provider>
  );
}
