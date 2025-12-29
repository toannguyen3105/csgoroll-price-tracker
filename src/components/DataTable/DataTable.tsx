import { useState } from 'react';
import {
    getCoreRowModel,
    getFilteredRowModel,
    getSortedRowModel,
    useReactTable,
    flexRender,
} from '@tanstack/react-table';
import type {
    ColumnDef,
    SortingState,
} from '@tanstack/react-table';
import { DataTableToolbar } from './TableToolbar';
import { DataTableRow } from './TableRows';
import type { LiveItem } from '@/store/useConfigStore';

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
}

export function DataTable<TData extends LiveItem, TValue>({
    columns,
    data,
}: DataTableProps<TData, TValue>) {
    const [sorting, setSorting] = useState<SortingState>([{ id: 'timestamp', desc: true }]); // Default sort new to old
    const [globalFilter, setGlobalFilter] = useState('');

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
        <div className="flex flex-col h-full border rounded-lg shadow-sm bg-white overflow-hidden">
            <DataTableToolbar table={table} />
            <div className="flex-1 overflow-auto scrollbar-thin relative">
                <table className="w-full caption-bottom text-sm text-left">
                    <thead className="bg-gray-50 sticky top-0 z-20 border-b shadow-sm">
                        {table.getHeaderGroups().map((headerGroup) => (
                            <tr key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <th key={header.id} className="h-10 px-3 py-2 font-medium text-gray-500">
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext()
                                                )}
                                        </th>
                                    );
                                })}
                            </tr>
                        ))}
                    </thead>
                    <tbody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <DataTableRow
                                    key={row.id}
                                    row={row as any}
                                    isMatch={(row.original as any).isMatch}
                                />
                            ))
                        ) : (
                            <tr>
                                <td colSpan={columns.length} className="h-24 text-center text-gray-500">
                                    No results. Waiting for crawler...
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
            <div className="p-2 border-t text-xs text-gray-400 text-center bg-gray-50">
                Showing {table.getRowModel().rows.length} items (Capped at 200)
            </div>
        </div>
    );
}
