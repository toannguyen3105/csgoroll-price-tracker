import { useState } from "react";
import {
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
  flexRender,
} from "@tanstack/react-table";
import type { ColumnDef, SortingState } from "@tanstack/react-table";
import { DataTableToolbar } from "./TableToolbar";
import { DataTableRow } from "./TableRows";
import type { LiveItem } from "@/store/useConfigStore";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export function DataTable<TData extends LiveItem, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([
    { id: "timestamp", desc: true },
  ]); // Default sort new to old
  const [globalFilter, setGlobalFilter] = useState("");

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      globalFilter,
    },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    getRowId: (row) => row.id, // Ensure stable rows
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  return (
    <div className="flex flex-col h-full bg-slate-950 overflow-hidden relative">
      <DataTableToolbar table={table} />
      <div className="flex-1 overflow-auto scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent relative z-10">
        <table className="w-full caption-bottom text-sm text-left border-collapse">
          <thead className="bg-slate-900/90 backdrop-blur-sm sticky top-0 z-20 shadow-lg after:content-[''] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[1px] after:bg-slate-800">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <th
                      key={header.id}
                      className="h-10 px-4 py-3 font-semibold text-xs text-slate-400 uppercase tracking-wider"
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </th>
                  );
                })}
              </tr>
            ))}
          </thead>
          <tbody className="divide-y divide-slate-800/50">
            {table.getRowModel().rows?.length ? (
              table
                .getRowModel()
                .rows.map((row) => (
                  <DataTableRow
                    key={row.id}
                    row={row as any}
                    isMatch={(row.original as any).isMatch}
                  />
                ))
            ) : (
              <tr>
                <td
                  colSpan={columns.length}
                  className="h-32 text-center text-slate-500 italic"
                >
                  <div className="flex flex-col items-center justify-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-slate-700 animate-pulse"></div>
                    <span>Waiting for market data...</span>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="p-2 border-t border-slate-800/50 text-[10px] text-slate-500 text-center bg-slate-950 uppercase tracking-widest font-mono">
        Market Feed • {table.getRowModel().rows.length} items cached
      </div>
    </div>
  );
}
