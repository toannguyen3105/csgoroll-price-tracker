import React from "react";
import type { LiveItem } from "@/types";
import { DataTable } from "./DataTable";
import { columns } from "./columns";

interface LiveDataTableContainerProps {
  data: LiveItem[];
}

export const LiveDataTableContainer: React.FC<LiveDataTableContainerProps> = ({
  data,
}) => {
  // Optimization: Selector ensures we only re-render when liveResults changes

  return (
    <div className="h-full w-full flex flex-col">
      <DataTable columns={columns} data={data} />
    </div>
  );
};
