import { flexRender } from '@tanstack/react-table';
import type { Row } from '@tanstack/react-table';
import React from 'react';

interface TableRowProps<TData> {
    row: Row<TData>;
    isMatch: boolean;
}

// Memoized Row Component for Performance
export const DataTableRow = React.memo(
    <TData,>({ row, isMatch }: TableRowProps<TData>) => {
        return (
            <tr
                className={`border-b transition-colors hover:bg-gray-50/50 ${isMatch ? 'bg-green-50 hover:bg-green-100/50' : ''
                    }`}
            >
                {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="p-3 align-middle text-sm">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                ))}
            </tr>
        );
    },
    (prev, next) => prev.row.original === next.row.original // Only re-render if data changes
);
