import { useEffect, useState } from 'react';
import type { LogItem } from '../types';
import { Clock } from 'lucide-react';

export const CrawlFeed = () => {
    const [items, setItems] = useState<LogItem[]>([]);

    useEffect(() => {
        const handleMessage = (message: any) => {
            if (message.type === 'ITEM_SCANNED') {
                const newItem = message.payload as LogItem;
                setItems(prev => {
                    const newItems = [newItem, ...prev];
                    return newItems.slice(0, 50); // Keep last 50
                });
            }
        };

        // Safety check for Chrome Runtime
        if (typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.onMessage) {
            chrome.runtime.onMessage.addListener(handleMessage);
        }

        return () => {
            if (typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.onMessage) {
                chrome.runtime.onMessage.removeListener(handleMessage);
            }
        };
    }, []);

    const formatTime = (ts: number) => {
        return new Date(ts).toLocaleTimeString();
    };

    return (
        <div className="h-full flex flex-col bg-white border-l border-gray-200">
            <div className="px-4 py-3 border-b border-gray-200 bg-gray-50 flex justify-between items-center shrink-0">
                <h3 className="font-semibold text-gray-700 flex items-center gap-2">
                    <Clock size={16} /> Live Feed
                </h3>
                <span className="text-xs text-gray-500">Last 50 items</span>
            </div>

            <div className="flex-1 overflow-y-auto p-0">
                <table className="w-full text-left text-xs">
                    <thead className="bg-gray-100 text-gray-500 sticky top-0 z-10 shadow-sm">
                        <tr>
                            <th className="px-3 py-2">Time</th>
                            <th className="px-3 py-2">Item</th>
                            <th className="px-3 py-2">Price</th>
                            <th className="px-3 py-2">Markup</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {items.map((item) => (
                            <tr key={`${item.id}-${item.timestamp}`} className={`hover:bg-gray-50 transition-colors ${item.isTarget ? 'bg-green-50' : ''}`}>
                                <td className="px-3 py-2 text-gray-400 whitespace-nowrap">{formatTime(item.timestamp)}</td>
                                <td className="px-3 py-2 font-medium truncate max-w-[180px]" title={item.name}>
                                    {item.name}
                                </td>
                                <td className={`px-3 py-2 font-mono ${item.isTarget ? 'text-green-600 font-bold' : ''}`}>
                                    ${item.price.toFixed(2)}
                                </td>
                                <td className="px-3 py-2 text-gray-500">
                                    {item.markup ? `${item.markup}%` : '-'}
                                </td>
                            </tr>
                        ))}
                        {items.length === 0 && (
                            <tr>
                                <td colSpan={4} className="text-center py-10 text-gray-400">
                                    Waiting for crawler...
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
