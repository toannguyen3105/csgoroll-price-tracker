import React from 'react';
import type { Intervals } from '../types';
import { Clock } from 'lucide-react';

interface Props {
    intervals: Intervals;
    setIntervals: React.Dispatch<React.SetStateAction<Intervals>>;
}

export const IntervalSettings: React.FC<Props> = ({ intervals, setIntervals }) => {
    const handleChange = (field: keyof Intervals, value: number) => {
        setIntervals(prev => ({ ...prev, [field]: value }));
    };

    return (
        <div className="p-4 bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center gap-2 mb-4">
                <Clock className="text-gray-500" size={20} />
                <h2 className="text-lg font-semibold text-gray-800">Interval Settings</h2>
            </div>

            <div className="grid grid-cols-1 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Range Interval (seconds)
                    </label>
                    <input
                        type="number"
                        value={intervals.rangeInterval}
                        onChange={(e) => handleChange('rangeInterval', Number(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    />
                    <p className="text-xs text-gray-500 mt-1">Delay between checking each price range.</p>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Batch Interval (seconds)
                    </label>
                    <input
                        type="number"
                        value={intervals.batchInterval}
                        onChange={(e) => handleChange('batchInterval', Number(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    />
                    <p className="text-xs text-gray-500 mt-1">Delay between items in a batch.</p>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Cycle Delay (minutes)
                    </label>
                    <input
                        type="number"
                        value={intervals.cycleDelay}
                        onChange={(e) => handleChange('cycleDelay', Number(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    />
                    <p className="text-xs text-gray-500 mt-1">Wait time before restarting the scan cycle.</p>
                </div>
            </div>
        </div>
    );
};
