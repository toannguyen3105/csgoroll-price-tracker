import type { Table } from '@tanstack/react-table';
import { Search, X } from 'lucide-react';

interface DataTableToolbarProps<TData> {
    table: Table<TData>;
}

export function DataTableToolbar<TData>({ table }: DataTableToolbarProps<TData>) {
    const isFiltered = table.getState().globalFilter && table.getState().globalFilter.length > 0;

    return (
        <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-white">
            <div className="flex flex-1 items-center space-x-2">
                <div className="relative w-full max-w-sm">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                    <input
                        placeholder="Filter items..."
                        value={(table.getState().globalFilter as string) ?? ""}
                        onChange={(event) => table.setGlobalFilter(event.target.value)}
                        className="h-9 w-full rounded-md border border-gray-300 bg-transparent pl-9 pr-8 py-1 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                    {isFiltered && (
                        <button
                            onClick={() => table.resetGlobalFilter()}
                            className="absolute right-2 top-2 text-gray-400 hover:text-gray-600"
                        >
                            <X size={16} />
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
