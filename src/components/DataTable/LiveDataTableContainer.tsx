import React from 'react';
import { useConfigStore } from '@/store/useConfigStore';
import { DataTable } from './DataTable';
import { columns } from './columns';

export const LiveDataTableContainer: React.FC = () => {
    // Optimization: Selector ensures we only re-render when liveResults changes
    const liveResults = useConfigStore((state) => state.liveResults);

    return (
        <div className="h-full w-full flex flex-col">
            <DataTable
                columns={columns}
                data={liveResults}
            />
        </div>
    );
};
