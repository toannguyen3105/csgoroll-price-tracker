import { useState, useEffect } from 'react';
import type { TargetItem } from '../types';
import { Upload, Download, Trash2, AlertCircle, Edit2, X, Check } from 'lucide-react';
import { storageHelper } from '../storage_helper';

interface Props {
    targetItems: TargetItem[];
    setTargetItems: React.Dispatch<React.SetStateAction<TargetItem[]>>;
}

export const TargetItemManager: React.FC<Props> = ({ targetItems, setTargetItems }) => {
    const [textInput, setTextInput] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [editingIndex, setEditingIndex] = useState<number | null>(null);
    const [editPrice, setEditPrice] = useState<string>('');

    // Sync with storage immediately on change
    useEffect(() => {
        storageHelper.set({ targetItems });
    }, [targetItems]);

    const downloadTemplate = () => {
        const csvContent = "data:text/csv;charset=utf-8,name,price\nAK-47 | Redline (Field-Tested),15.50\nAWP | Asiimov (Battle-Scarred),60.00";
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "target_template.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const parseCSV = (text: string) => {
        const lines = text.split('\n');
        const newItems: TargetItem[] = [];

        // Skip header if present
        const startIdx = lines[0].toLowerCase().includes('price') ? 1 : 0;

        for (let i = startIdx; i < lines.length; i++) {
            const line = lines[i].trim();
            if (!line) continue;

            const lastCommaIndex = line.lastIndexOf(',');
            if (lastCommaIndex === -1) continue;

            const name = line.substring(0, lastCommaIndex).trim();
            const priceStr = line.substring(lastCommaIndex + 1).trim();
            const price = parseFloat(priceStr);

            if (name && !isNaN(price) && price > 0) {
                newItems.push({ name, price, enabled: true });
            }
        }
        return newItems;
    };

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        setError(null);
        const file = event.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            const text = e.target?.result as string;
            try {
                const items = parseCSV(text);
                setTargetItems(prev => [...prev, ...items]);
                event.target.value = ''; // Reset
            } catch (err) {
                setError('Failed to parse CSV file.');
            }
        };
        reader.readAsText(file);
    };

    const handleTextImport = () => {
        setError(null);
        try {
            const json = JSON.parse(textInput);
            if (!Array.isArray(json)) throw new Error('Input must be an array');

            const newItems: TargetItem[] = [];
            for (const item of json) {
                if (typeof item.name === 'string' && typeof item.price === 'number' && item.price > 0) {
                    newItems.push({ name: item.name, price: item.price, enabled: true });
                }
            }

            if (newItems.length === 0) {
                setError('No valid items found in JSON.');
                return;
            }

            setTargetItems(prev => [...prev, ...newItems]);
            setTextInput('');
        } catch (err) {
            setError('Invalid JSON format. Expected: [{"name": "Item", "price": 10}, ...]');
        }
    };

    const clearList = () => {
        if (window.confirm("Are you sure you want to clear ALL items?")) {
            setTargetItems([]);
        }
    };

    const toggleItem = (index: number) => {
        setTargetItems(prev => {
            const next = [...prev];
            next[index] = { ...next[index], enabled: !next[index].enabled };
            return next;
        });
    };

    const deleteItem = (index: number) => {
        if (window.confirm(`Remove "${targetItems[index].name}"?`)) {
            setTargetItems(prev => prev.filter((_, i) => i !== index));
        }
    };

    const startEditing = (index: number, currentPrice: number) => {
        setEditingIndex(index);
        setEditPrice(currentPrice.toString());
    };

    const saveEdit = (index: number) => {
        const newPrice = parseFloat(editPrice);
        if (!isNaN(newPrice) && newPrice > 0) {
            setTargetItems(prev => {
                const next = [...prev];
                next[index] = { ...next[index], price: newPrice };
                return next;
            });
            setEditingIndex(null);
        }
    };

    const cancelEdit = () => {
        setEditingIndex(null);
    };

    return (
        <div className="h-full flex flex-col space-y-4">

            {/* Import Actions */}
            <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm space-y-3">
                <div className="flex flex-wrap gap-2">
                    <button
                        onClick={downloadTemplate}
                        className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition"
                    >
                        <Download size={14} /> Template
                    </button>
                    <label className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition cursor-pointer">
                        <Upload size={14} /> Import CSV
                        <input type="file" accept=".csv" onChange={handleFileUpload} className="hidden" />
                    </label>
                </div>
                <div className="flex gap-2">
                    <textarea
                        value={textInput}
                        onChange={(e) => setTextInput(e.target.value)}
                        placeholder='Or paste JSON: [{"name": "AK-47", "price": 10}, ...]'
                        className="flex-1 h-12 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs font-mono"
                    />
                    <button
                        onClick={handleTextImport}
                        disabled={!textInput.trim()}
                        className="px-3 py-2 text-xs font-medium text-blue-600 hover:bg-blue-50 rounded-md disabled:opacity-50"
                    >
                        Add JSON
                    </button>
                </div>
                {error && (
                    <div className="flex items-center gap-2 text-xs text-red-600 bg-red-50 p-2 rounded-md">
                        <AlertCircle size={14} /> {error}
                    </div>
                )}
            </div>

            {/* Table List */}
            <div className="flex-1 bg-white border border-gray-200 rounded-lg overflow-hidden flex flex-col shadow-sm">
                <div className="bg-gray-50 px-4 py-2 border-b border-gray-200 flex justify-between items-center shrink-0">
                    <h3 className="font-semibold text-gray-700">Target List ({targetItems.length})</h3>
                    {targetItems.length > 0 && (
                        <button onClick={clearList} className="text-xs text-red-600 hover:text-red-800 flex items-center gap-1">
                            <Trash2 size={12} /> Clear All
                        </button>
                    )}
                </div>

                <div className="overflow-y-auto flex-1">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50 text-gray-500 font-medium sticky top-0 z-10 shadow-sm">
                            <tr>
                                <th className="px-4 py-2 w-12 text-center">On/Off</th>
                                <th className="px-4 py-2">Name</th>
                                <th className="px-4 py-2 w-24">Price</th>
                                <th className="px-4 py-2 w-10"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {targetItems.map((item, idx) => (
                                <tr key={idx} className={`hover:bg-gray-50 ${!item.enabled ? 'opacity-60 bg-gray-50' : ''}`}>
                                    <td className="px-4 py-2 text-center">
                                        <button
                                            onClick={() => toggleItem(idx)}
                                            className={`w-8 h-4 rounded-full relative transition-colors ${item.enabled ? 'bg-green-500' : 'bg-gray-300'}`}
                                        >
                                            <span className={`absolute top-0.5 left-0.5 w-3 h-3 bg-white rounded-full transition-transform ${item.enabled ? 'translate-x-4' : ''}`} />
                                        </button>
                                    </td>
                                    <td className="px-4 py-2 truncate max-w-[150px]" title={item.name}>
                                        {item.name}
                                    </td>
                                    <td className="px-4 py-2">
                                        {editingIndex === idx ? (
                                            <div className="flex items-center gap-1">
                                                <input
                                                    type="number"
                                                    value={editPrice}
                                                    onChange={(e) => setEditPrice(e.target.value)}
                                                    className="w-16 px-1 py-0.5 border rounded text-xs"
                                                    autoFocus
                                                />
                                                <button onClick={() => saveEdit(idx)} className="text-green-600 hover:text-green-800"><Check size={14} /></button>
                                                <button onClick={cancelEdit} className="text-red-500 hover:text-red-700"><X size={14} /></button>
                                            </div>
                                        ) : (
                                            <div onClick={() => startEditing(idx, item.price)} className="cursor-pointer hover:bg-gray-100 rounded px-1 -ml-1 flex items-center gap-1 group">
                                                <span className="font-mono text-green-600">${item.price.toFixed(2)}</span>
                                                <Edit2 size={10} className="text-gray-400 opacity-0 group-hover:opacity-100" />
                                            </div>
                                        )}
                                    </td>
                                    <td className="px-4 py-2 text-center">
                                        <button onClick={() => deleteItem(idx)} className="text-gray-400 hover:text-red-600 transition">
                                            <Trash2 size={14} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {targetItems.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="text-center py-8 text-gray-400">
                                        No items in watch list.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};
