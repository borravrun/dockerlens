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
    let cancelled = false;

    const setup = async () => {
      const fn = await listen<ContainerStats>("container-stats", (event) => {
        const stat = event.payload;
        setLatest(stat);
        const next = [...statsRef.current.slice(-(MAX_DATA_POINTS - 1)), stat];
        statsRef.current = next;
        setStats(next);
      });
      if (cancelled) { fn(); return; }
      unlisten = fn;
      await streamStats(id);
    };

    setup();

    return () => {
      cancelled = true;
      unlisten?.();
    };
  }, [id, containerState]);

  return { stats, latest };
}
