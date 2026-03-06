import { useEffect, useRef, useState } from "react";
import { listen } from "@tauri-apps/api/event";
import { streamLogs } from "@/services";
import { useSelectedContainer } from "@/hooks";
import type { LogEntry } from "@/types";

export default function DrawerLogs({ id }: { id: string }) {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const bottomRef = useRef<HTMLDivElement>(null);
  const { selectedContainer } = useSelectedContainer();
  const containerState = selectedContainer?.state;

  useEffect(() => {
    if (!id) return;

    setLogs([]);

    let unlisten: (() => void) | null = null;
    let cancelled = false;

    const setup = async () => {
      const fn = await listen<LogEntry>("container-logs", (event) => {
        setLogs((prev) => {
          const next = [...prev, event.payload];
          return next.length > 5000 ? next.slice(-5000) : next;
        });
      });
      if (cancelled) { fn(); return; }
      unlisten = fn;
      await streamLogs(id);
    };

    setup();

    return () => {
      cancelled = true;
      unlisten?.();
    };
  }, [id, containerState]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs]);

  return (
    <div className="flex flex-col flex-1 min-h-0">
      <div className="flex-1 min-h-0 overflow-y-auto scrollbar rounded bg-[#0D0D0D] p-3 font-mono text-xs leading-5">
        {logs.length === 0 ? (
          <p className="text-[#525252]">No logs available</p>
        ) : (
          logs.map((log, i) => (
            <div key={i} className="flex gap-2">
              <span
                className={
                  log.stream === "stderr" ? "text-red-400" : "text-[#A3A3A3]"
                }
              >
                {log.message}
              </span>
            </div>
          ))
        )}
        <div ref={bottomRef} />
      </div>
    </div>
  );
}
