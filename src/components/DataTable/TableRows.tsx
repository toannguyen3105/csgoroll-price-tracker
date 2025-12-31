import { flexRender } from "@tanstack/react-table";
import { cn } from "@/utils";
import type { Row } from "@tanstack/react-table";
import React from "react";

interface TableRowProps<TData> {
  row: Row<TData>;
  isMatch: boolean;
}

// Memoized Row Component for Performance
export const DataTableRow = React.memo(
  <TData,>({ row, isMatch }: TableRowProps<TData>) => {
    return (
      <tr
        className={cn(
          "border-b border-slate-800/50 transition-all duration-200 hover:bg-slate-800/50",
          {
            "bg-emerald-900/10 hover:bg-emerald-900/20": isMatch,
          }
        )}
      >
        {row.getVisibleCells().map((cell) => (
          <td key={cell.id} className="p-3 align-middle text-sm text-slate-300">
            {flexRender(cell.column.columnDef.cell, cell.getContext())}
          </td>
        ))}
      </tr>
    );
  },
  (prev, next) => prev.row.original === next.row.original // Only re-render if data changes
);
