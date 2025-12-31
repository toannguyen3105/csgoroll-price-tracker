import { Trash2, Edit2, Play, Pause } from "lucide-react";
import type { TargetItem } from "@/types";

interface TargetListTableProps {
  items: TargetItem[];
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (item: TargetItem) => void;
}

export const TargetListTable = ({
  items,
  onToggle,
  onDelete,
  onEdit,
}: TargetListTableProps) => {
  return (
    <div className="flex flex-col h-full bg-slate-950 overflow-hidden relative">
      <div className="bg-slate-900/50 backdrop-blur-sm px-4 py-2 border-b border-slate-800 flex justify-between items-center shrink-0">
        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
          Active Targets ({items.length})
        </span>
      </div>
      <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent">
        <table className="w-full text-xs text-left border-collapse">
          <thead className="bg-slate-900/90 backdrop-blur-sm sticky top-0 z-10 shadow-sm border-b border-slate-800">
            <tr>
              <th className="px-4 py-3 font-semibold text-slate-400 uppercase tracking-wider">
                Item Name
              </th>
              <th className="px-4 py-3 font-semibold text-slate-400 uppercase tracking-wider">
                Max Price
              </th>
              <th className="px-4 py-3 font-semibold text-slate-400 uppercase tracking-wider text-right">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/50">
            {items.length === 0 ? (
              <tr>
                <td
                  colSpan={3}
                  className="px-4 py-8 text-center text-slate-500 italic"
                >
                  No targets set. Add one above.
                </td>
              </tr>
            ) : (
              items.map((item) => (
                <tr
                  key={item.id}
                  className={`group hover:bg-slate-800/50 transition-colors ${!item.isActive ? "opacity-50 grayscale" : ""}`}
                >
                  <td className="px-4 py-3 font-medium text-slate-200">
                    {item.name}
                  </td>
                  <td className="px-4 py-3 text-emerald-400 font-bold font-mono">
                    ${item.targetPrice.toFixed(2)}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => onToggle(item.id)}
                        className={`p-1.5 rounded transition-all ${
                          item.isActive
                            ? "text-emerald-500 hover:bg-emerald-900/20"
                            : "text-slate-400 hover:bg-slate-800 hover:text-slate-200"
                        }`}
                        title={item.isActive ? "Pause" : "Resume"}
                      >
                        {item.isActive ? (
                          <Pause size={14} />
                        ) : (
                          <Play size={14} />
                        )}
                      </button>
                      <button
                        onClick={() => onEdit(item)}
                        className="p-1.5 text-cyan-500 hover:bg-cyan-900/20 rounded transition-all"
                        title="Edit"
                      >
                        <Edit2 size={14} />
                      </button>
                      <button
                        onClick={() => onDelete(item.id)}
                        className="p-1.5 text-rose-500 hover:bg-rose-900/20 rounded transition-all"
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
