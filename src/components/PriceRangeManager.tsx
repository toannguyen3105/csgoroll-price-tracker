import React from 'react';
import { Plus, Trash2 } from 'lucide-react';
import type { PriceRange } from '../types';

interface Props {
    ranges: PriceRange[];
    setRanges: React.Dispatch<React.SetStateAction<PriceRange[]>>;
}

export const PriceRangeManager: React.FC<Props> = ({ ranges, setRanges }) => {
    const addRange = () => {
        const newId = Date.now().toString();
        setRanges([...ranges, { id: newId, min: 0, max: 0 }]);
    };

    const removeRange = (id: string) => {
        setRanges(ranges.filter(r => r.id !== id));
    };

    const updateRange = (id: string, field: 'min' | 'max', value: number) => {
        setRanges(ranges.map(r => {
            if (r.id === id) {
                return { ...r, [field]: value };
            }
            return r;
        }));
    };

    return (
        <div className="space-y-4 p-4 bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold text-gray-800">Price Ranges</h2>
                <button
                    onClick={addRange}
                    className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition"
                >
                    <Plus size={16} />
                    Add Range
                </button>
            </div>

            <div className="space-y-3">
                {ranges.length === 0 && (
                    <p className="text-gray-500 text-sm text-center py-4">No price ranges configured.</p>
                )}
                {ranges.map((range) => (
                    <div key={range.id} className="flex items-center gap-3">
                        <div className="flex-1">
                            <input
                                type="number"
                                value={range.min}
                                onChange={(e) => updateRange(range.id, 'min', Number(e.target.value))}
                                placeholder="Min"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                            />
                        </div>
                        <span className="text-gray-400">-</span>
                        <div className="flex-1 relative">
                            <input
                                type="number"
                                value={range.max}
                                onChange={(e) => updateRange(range.id, 'max', Number(e.target.value))}
                                placeholder="Max"
                                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 text-sm ${range.min >= range.max && range.max !== 0
                                    ? 'border-red-300 focus:ring-red-500 bg-red-50'
                                    : 'border-gray-300 focus:ring-blue-500'
                                    }`}
                            />
                        </div>
                        <button
                            onClick={() => removeRange(range.id)}
                            className="p-2 text-gray-400 hover:text-red-500 transition rounded-md hover:bg-red-50"
                        >
                            <Trash2 size={18} />
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};
