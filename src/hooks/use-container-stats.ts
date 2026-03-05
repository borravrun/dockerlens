import { useEffect, useRef, useState } from "react";
import { listen } from "@tauri-apps/api/event";
import { streamStats } from "@/services";
import { useSelectedContainer } from "@/hooks";
import type { ContainerStats } from "@/types";

const MAX_DATA_POINTS = 60;

export function useContainerStats(id: string) {
  const [stats, setStats] = useState<ContainerStats[]>([]);
  const [latest, setLatest] = useState<ContainerStats | null>(null);
  const { selectedContainer } = useSelectedContainer();
  const containerState = selectedContainer?.state;
  const statsRef = useRef<ContainerStats[]>([]);

  useEffect(() => {
    if (!id || containerState !== "running") {
      setStats([]);
      setLatest(null);
      statsRef.current = [];
      return;
    }

    setStats([]);
    setLatest(null);
    statsRef.current = [];

    let unlisten: (() => void) | null = null;

    const setup = async () => {
      unlisten = await listen<ContainerStats>("container-stats", (event) => {
        const stat = event.payload;
        setLatest(stat);
        statsRef.current = [...statsRef.current.slice(-(MAX_DATA_POINTS - 1)), stat];
        setStats([...statsRef.current]);
      });
      await streamStats(id);
    };

    setup();

    return () => {
      unlisten?.();
    };
  }, [id, containerState]);

  return { stats, latest };
}
