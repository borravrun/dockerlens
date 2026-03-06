import { Area, AreaChart, XAxis, YAxis } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { useContainerStats } from "@/hooks";
import type { ContainerStats } from "@/types";

const cpuChartConfig = {
  cpu_percent: { label: "CPU %", color: "#3b82f6" },
} satisfies ChartConfig;

const memoryChartConfig = {
  memory_percent: { label: "Memory %", color: "#8b5cf6" },
} satisfies ChartConfig;

import { formatBytes } from "@/lib/utils";

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1 bg-[#1A1A1A] rounded-lg p-3">
      <p className="text-xs text-[#737373] uppercase font-medium">{label}</p>
      <p className="text-sm text-[#E5E5E5] font-mono">{value}</p>
    </div>
  );
}

function StatsChart({
  data,
  dataKey,
  config,
  color,
}: {
  data: ContainerStats[];
  dataKey: string;
  config: ChartConfig;
  color: string;
}) {
  return (
    <ChartContainer config={config} className="h-[120px] w-full aspect-auto">
      <AreaChart data={data} margin={{ top: 5, right: 5, bottom: 0, left: 0 }}>
        <defs>
          <linearGradient id={`fill-${dataKey}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={0.3} />
            <stop offset="100%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
        <XAxis dataKey="timestamp" hide />
        <YAxis hide domain={[0, "auto"]} />
        <ChartTooltip
          content={
            <ChartTooltipContent
              className="bg-[#1A1A1A] border-[#333332] text-[#E5E5E5]"
              formatter={(value) => `${Number(value).toFixed(2)}%`}
            />
          }
        />
        <Area
          type="monotone"
          dataKey={dataKey}
          stroke={color}
          strokeWidth={1.5}
          fill={`url(#fill-${dataKey})`}
          isAnimationActive={false}
        />
      </AreaChart>
    </ChartContainer>
  );
}

export default function DrawerStats({ id }: { id: string }) {
  const { stats, latest } = useContainerStats(id);

  if (!latest) {
    return (
      <div className="flex flex-col flex-1 min-h-0 items-center justify-center">
        <p className="text-[#525252] text-sm">
          {id ? "Waiting for stats..." : "No container selected"}
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-1 min-h-0 overflow-y-auto scrollbar p-4 gap-4">
      {/* CPU Chart */}
      <div className="flex flex-col gap-2">
        <div className="flex justify-between items-center">
          <h3 className="text-xs text-[#737373] uppercase font-medium">
            CPU Usage
          </h3>
          <span className="text-xs text-[#3b82f6] font-mono">
            {latest.cpu_percent.toFixed(2)}%
          </span>
        </div>
        <div className="bg-[#0D0D0D] rounded-lg p-2">
          <StatsChart
            data={stats}
            dataKey="cpu_percent"
            config={cpuChartConfig}
            color="#3b82f6"
          />
        </div>
      </div>

      {/* Memory Chart */}
      <div className="flex flex-col gap-2">
        <div className="flex justify-between items-center">
          <h3 className="text-xs text-[#737373] uppercase font-medium">
            Memory Usage
          </h3>
          <span className="text-xs text-[#8b5cf6] font-mono">
            {formatBytes(latest.memory_usage)} / {formatBytes(latest.memory_limit)}
          </span>
        </div>
        <div className="bg-[#0D0D0D] rounded-lg p-2">
          <StatsChart
            data={stats}
            dataKey="memory_percent"
            config={memoryChartConfig}
            color="#8b5cf6"
          />
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3">
        <StatCard label="Network RX" value={formatBytes(latest.network_rx)} />
        <StatCard label="Network TX" value={formatBytes(latest.network_tx)} />
        <StatCard label="Block Read" value={formatBytes(latest.block_read)} />
        <StatCard label="Block Write" value={formatBytes(latest.block_write)} />
        <StatCard label="PIDs" value={String(latest.pids)} />
        <StatCard
          label="Memory %"
          value={`${latest.memory_percent.toFixed(2)}%`}
        />
      </div>
    </div>
  );
}
