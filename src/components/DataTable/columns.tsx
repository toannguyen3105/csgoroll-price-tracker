import type { ColumnDef } from "@tanstack/react-table";
import type { LiveItem } from "@/store/useConfigStore";
import { cn } from "@/utils";
import { ArrowUpDown } from "lucide-react";

export const columns: ColumnDef<LiveItem>[] = [
  {
    accessorKey: "timestamp",
    header: ({ column }) => {
      return (
        <button
          className="flex items-center gap-1 hover:text-cyan-400 transition-colors"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          TIMESTAMP
          <ArrowUpDown size={12} />
        </button>
      );
    },
    cell: ({ row }) => {
      const date = new Date(row.getValue("timestamp"));
      return (
        <span className="text-slate-500 font-mono text-[10px] tracking-wide">
          {date.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
          })}
        </span>
      );
    },
  },
  {
    accessorKey: "name",
    header: "ITEM NAME",
    cell: ({ row }) => (
      <div className="flex flex-col">
        <span
          className="font-semibold text-slate-200 text-xs truncate max-w-[180px]"
          title={row.getValue("name")}
        >
          {row.getValue("name")}
        </span>
      </div>
    ),
  },
  {
    accessorKey: "price",
    header: ({ column }) => {
      return (
        <button
          className="flex items-center gap-1 hover:text-cyan-400 transition-colors"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          PRICE
          <ArrowUpDown size={12} />
        </button>
      );
    },
    cell: ({ row }) => (
      <span className="font-bold text-emerald-400 font-mono text-sm">
        ${row.getValue<number>("price").toFixed(2)}
      </span>
    ),
  },
  {
    accessorKey: "markup",
    header: "MARKUP",
    cell: ({ row }) => (
      <span
        className={cn(
          "text-[10px] font-bold px-2 py-0.5 rounded-sm font-mono",
          {
            "bg-rose-900/30 text-rose-400 border border-rose-900/50":
              row.getValue<number>("markup") <= 0,
            "bg-emerald-900/30 text-emerald-400 border border-emerald-900/50":
              row.getValue<number>("markup") > 0,
          }
        )}
      >
        {row.getValue<number>("markup")}%
      </span>
    ),
  },
  {
    id: "status",
    header: "STATUS",
    cell: ({ row }) => {
      const isMatch = row.original.isMatch;
      return isMatch ? (
        <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-cyan-900/30 text-cyan-400 border border-cyan-800 uppercase tracking-wider animate-pulse">
          MATCH
        </span>
      ) : null;
    },
  },
];
