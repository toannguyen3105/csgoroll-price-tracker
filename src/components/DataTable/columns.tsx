import type { ColumnDef } from '@tanstack/react-table';
import type { LiveItem } from '@/store/useConfigStore';
import { ArrowUpDown } from 'lucide-react';

export const columns: ColumnDef<LiveItem>[] = [
    {
        accessorKey: 'timestamp',
        header: ({ column }) => {
            return (
                <button
                    className="flex items-center gap-1 hover:text-blue-600 transition-colors"
                    onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                >
                    Time
                    <ArrowUpDown size={14} />
                </button>
            );
        },
        cell: ({ row }) => {
            const date = new Date(row.getValue('timestamp'));
            return (
                <span className="text-gray-500 font-mono text-xs">
                    {date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                </span>
            );
        },
    },
    {
        accessorKey: 'name',
        header: 'Item Name',
        cell: ({ row }) => (
            <div className="flex flex-col">
                <span className="font-medium text-gray-800 text-sm truncate max-w-[180px]" title={row.getValue('name')}>
                    {row.getValue('name')}
                </span>
            </div>
        ),
    },
    {
        accessorKey: 'price',
        header: ({ column }) => {
            return (
                <button
                    className="flex items-center gap-1 hover:text-blue-600 transition-colors"
                    onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                >
                    Price
                    <ArrowUpDown size={14} />
                </button>
            );
        },
        cell: ({ row }) => <span className="font-bold text-green-600">${row.getValue<number>('price').toFixed(2)}</span>,
    },
    {
        accessorKey: 'markup',
        header: 'Markup',
        cell: ({ row }) => (
            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${row.getValue<number>('markup') <= 0 ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                }`}>
                {row.getValue<number>('markup')}%
            </span>
        ),
    },
    {
        id: 'status',
        header: 'Status',
        cell: ({ row }) => {
            const isMatch = row.original.isMatch;
            return isMatch ? (
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-500 text-white">
                    MATCH
                </span>
            ) : null;
        },
    },
];
