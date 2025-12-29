import { Trash2, Edit2, Play, Pause } from 'lucide-react';
import type { TargetItem } from '@/types';

interface TargetListTableProps {
    items: TargetItem[];
    onToggle: (id: string) => void;
    onDelete: (id: string) => void;
    onEdit: (item: TargetItem) => void;
}

export const TargetListTable = ({ items, onToggle, onDelete, onEdit }: TargetListTableProps) => {
    return (
        <div className="border rounded-lg overflow-hidden flex flex-col h-[300px]">
            <div className="bg-gray-50 px-4 py-2 border-b flex justify-between items-center shrink-0">
                <span className="text-xs font-medium text-gray-500">Active Targets ({items.length})</span>
            </div>
            <div className="flex-1 overflow-y-auto">
                <table className="w-full text-xs text-left">
                    <thead className="bg-white border-b sticky top-0">
                        <tr>
                            <th className="px-4 py-2 font-medium text-gray-500">Item Name</th>
                            <th className="px-4 py-2 font-medium text-gray-500">Max Price</th>
                            <th className="px-4 py-2 font-medium text-gray-500 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {items.length === 0 ? (
                            <tr>
                                <td colSpan={3} className="px-4 py-8 text-center text-gray-400">
                                    No targets set. Add one above.
                                </td>
                            </tr>
                        ) : (
                            items.map((item) => (
                                <tr key={item.id} className={`group hover:bg-gray-50 ${!item.isActive ? 'opacity-50' : ''}`}>
                                    <td className="px-4 py-2 font-medium text-gray-700">{item.name}</td>
                                    <td className="px-4 py-2 text-green-600 font-medium">${item.targetPrice.toFixed(2)}</td>
                                    <td className="px-4 py-2 text-right">
                                        <div className="flex items-center justify-end gap-1">
                                            <button
                                                onClick={() => onToggle(item.id)}
                                                className={`p-1 rounded ${item.isActive ? 'text-green-500 hover:bg-green-50' : 'text-gray-400 hover:bg-gray-100'}`}
                                                title={item.isActive ? 'Pause' : 'Resume'}
                                            >
                                                {item.isActive ? <Pause size={14} /> : <Play size={14} />}
                                            </button>
                                            <button
                                                onClick={() => onEdit(item)}
                                                className="p-1 text-blue-500 hover:bg-blue-50 rounded"
                                                title="Edit"
                                            >
                                                <Edit2 size={14} />
                                            </button>
                                            <button
                                                onClick={() => onDelete(item.id)}
                                                className="p-1 text-red-500 hover:bg-red-50 rounded"
                                                title="Delete"
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
