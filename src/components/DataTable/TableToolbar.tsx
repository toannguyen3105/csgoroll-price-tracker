import type { Table } from "@tanstack/react-table";
import { Search, X } from "lucide-react";

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
}

export function DataTableToolbar<TData>({
  table,
}: DataTableToolbarProps<TData>) {
  const isFiltered =
    table.getState().globalFilter && table.getState().globalFilter.length > 0;

  return (
    <div className="flex items-center justify-between p-4 border-b border-slate-800 bg-slate-900/50 backdrop-blur-md">
      <div className="flex flex-1 items-center space-x-2">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
          <input
            placeholder="Search items..."
            value={(table.getState().globalFilter as string) ?? ""}
            onChange={(event) => table.setGlobalFilter(event.target.value)}
            className="h-9 w-full rounded-md border border-slate-700 bg-slate-950/50 pl-9 pr-8 py-1 text-sm shadow-inner text-slate-200 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 placeholder-slate-600 transition-all font-mono"
          />
          {isFiltered && (
            <button
              onClick={() => table.resetGlobalFilter()}
              className="absolute right-2 top-2 text-slate-500 hover:text-rose-400 transition-colors"
            >
              <X size={16} />
            </button>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1.5 px-3 py-1 bg-slate-800 rounded-full border border-slate-700">
          <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wide">
            Live Feed
          </span>
        </div>
      </div>
    </div>
  );
}
