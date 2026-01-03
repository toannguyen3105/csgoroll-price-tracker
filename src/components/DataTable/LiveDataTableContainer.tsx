import React from "react";

import type { LiveItem } from "@/types";
import { useCrawlerStatus } from "@/hooks";
import { DataTable } from "./DataTable";
import { columns } from "./columns";

interface LiveDataTableContainerProps {
  data: LiveItem[];
}

export const LiveDataTableContainer: React.FC<LiveDataTableContainerProps> = ({
  data,
}) => {
  const { cycles, nextCycleTime, isRunning } = useCrawlerStatus();

  // Format status
  const getStatusText = () => {
    if (!isRunning) return "STOPPED";
    if (nextCycleTime === null) return "SCANNING...";

    // Calculate remaining time or show the target time
    return `NEXT CYCLE: ${new Date(nextCycleTime).toLocaleTimeString()}`;
  };

  return (
    <div className="h-full w-full flex flex-col">
      <div className="bg-slate-900/50 backdrop-blur-sm px-4 py-2 border-b border-slate-800 flex justify-between items-center shrink-0 text-xs text-slate-400 font-mono">
        <div className="flex items-center gap-4">
          <span className={isRunning ? "text-emerald-400" : "text-slate-500"}>
            ● {isRunning ? "RUNNING" : "STOPPED"}
          </span>
          <span>
            Cycles: <b className="text-slate-200">{cycles}</b>
          </span>
        </div>
        <div>
          <b
            className={
              nextCycleTime === null && isRunning
                ? "text-cyan-400 animate-pulse"
                : "text-slate-200"
            }
          >
            {getStatusText()}
          </b>
        </div>
      </div>
      <DataTable columns={columns} data={data} />
    </div>
  );
};
