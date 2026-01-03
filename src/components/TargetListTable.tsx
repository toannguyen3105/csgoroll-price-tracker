import { useTranslation } from "react-i18next";
import { Trash2, Edit2, Play, Pause } from "lucide-react";
import type { LiveItem, TargetItem } from "@/types";
import { cn } from "@/utils";

interface TargetListTableProps {
  items: TargetItem[];
  liveResults: LiveItem[];
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (item: TargetItem) => void;
}

export const TargetListTable = ({
  items,
  liveResults,
  onToggle,
  onDelete,
  onEdit,
}: TargetListTableProps) => {
  const { t } = useTranslation();

  const getCurrentPrice = (targetName: string) => {
    // Find the most recent match for this item in live results
    const match = liveResults.find((item) =>
      item.name.toLowerCase().includes(targetName.toLowerCase())
    );
    return match ? match.price : null;
  };

  const getStatus = (item: TargetItem, currentPrice: number | null) => {
    if (!item.isActive)
      return { label: t("targets.status_paused"), color: "text-slate-500" };
    if (currentPrice !== null && currentPrice <= item.targetPrice) {
      return { label: t("targets.status_matched"), color: "text-cyan-400" };
    }
    return { label: t("targets.status_watching"), color: "text-emerald-400" };
  };

  return (
    <div className="flex flex-col h-full bg-slate-950 overflow-hidden relative">
      <div className="bg-slate-900/50 backdrop-blur-sm px-4 py-2 border-b border-slate-800 flex justify-between items-center shrink-0">
        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
          {t("targets.active_targets")} ({items.length})
        </span>
      </div>
      <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent">
        <table className="w-full text-xs text-left border-collapse">
          <thead className="bg-slate-900/90 backdrop-blur-sm sticky top-0 z-10 shadow-sm border-b border-slate-800">
            <tr>
              <th className="px-4 py-3 font-semibold text-slate-400 uppercase tracking-wider">
                {t("targets.item_name")}
              </th>
              <th className="px-4 py-3 font-semibold text-slate-400 uppercase tracking-wider">
                {t("targets.current_price_header")}
              </th>
              <th className="px-4 py-3 font-semibold text-slate-400 uppercase tracking-wider">
                {t("targets.max_price_header")}
              </th>
              <th className="px-4 py-3 font-semibold text-slate-400 uppercase tracking-wider">
                {t("targets.status_header")}
              </th>
              <th className="px-4 py-3 font-semibold text-slate-400 uppercase tracking-wider text-right">
                {t("targets.actions")}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/50">
            {items.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="px-4 py-8 text-center text-slate-500 italic"
                >
                  {t("targets.no_targets_set")}
                </td>
              </tr>
            ) : (
              items.map((item) => {
                const currentPrice = getCurrentPrice(item.name);
                const status = getStatus(item, currentPrice);

                return (
                  <tr
                    key={item.id}
                    className={cn(
                      "group hover:bg-slate-800/50 transition-colors",
                      {
                        "opacity-50 grayscale": !item.isActive,
                        "bg-cyan-900/10 hover:bg-cyan-900/20":
                          status.label === t("targets.status_matched"),
                      }
                    )}
                  >
                    <td className="px-4 py-3 font-medium text-slate-200">
                      {item.name}
                    </td>
                    <td className="px-4 py-3 text-emerald-400 font-bold font-mono">
                      ${item.targetPrice.toFixed(2)}
                    </td>
                    <td className="px-4 py-3 font-mono text-slate-300">
                      {currentPrice ? `$${currentPrice.toFixed(2)}` : "N/A"}
                    </td>
                    <td
                      className={cn(
                        "px-4 py-3 font-bold uppercase text-[10px]",
                        status.color
                      )}
                    >
                      {status.label}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => onToggle(item.id)}
                          className={cn("p-1.5 rounded transition-all", {
                            "text-emerald-500 hover:bg-emerald-900/20":
                              item.isActive,
                            "text-slate-400 hover:bg-slate-800 hover:text-slate-200":
                              !item.isActive,
                          })}
                          title={
                            item.isActive
                              ? t("common.pause")
                              : t("common.resume")
                          }
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
                          title={t("common.edit")}
                        >
                          <Edit2 size={14} />
                        </button>
                        <button
                          onClick={() => onDelete(item.id)}
                          className="p-1.5 text-rose-500 hover:bg-rose-900/20 rounded transition-all"
                          title={t("common.delete")}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
