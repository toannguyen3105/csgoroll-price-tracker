import React from "react";
import { useTranslation } from "react-i18next";
import { Plus, Trash2 } from "lucide-react";

import type { PriceRange } from "@/types";
import { cn } from "@/utils";

type RangeField = "min" | "max";

interface Props {
  ranges: PriceRange[];
  setRanges: React.Dispatch<React.SetStateAction<PriceRange[]>>;
}

export const PriceRangeManager: React.FC<Props> = ({ ranges, setRanges }) => {
  const { t } = useTranslation();

  const addRange = () => {
    const newId = Date.now().toString();
    setRanges([...ranges, { id: newId, min: 0, max: 0 }]);
  };

  const removeRange = (id: string) => {
    setRanges(ranges.filter((r) => r.id !== id));
  };

  const updateRange = (id: string, field: RangeField, value: number) => {
    setRanges(
      ranges.map((r) => {
        if (r.id === id) {
          return { ...r, [field]: value };
        }
        return r;
      })
    );
  };

  return (
    <div className="space-y-4 p-4 bg-slate-800/50 rounded-lg border border-slate-700/50">
      <div className="flex justify-between items-center">
        <h2 className="text-sm font-semibold text-slate-100 uppercase tracking-wider">
          {t("settings.price_ranges")}
        </h2>
        <button
          onClick={addRange}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-cyan-600 rounded-md hover:bg-cyan-500 transition shadow-[0_0_10px_rgba(8,145,178,0.3)] hover:shadow-[0_0_15px_rgba(8,145,178,0.5)]"
        >
          <Plus size={14} />
          {t("settings.add_range")}
        </button>
      </div>

      <div className="space-y-2">
        {ranges.length === 0 && (
          <p className="text-slate-500 text-xs text-center py-4 border border-dashed border-slate-700 rounded-md">
            {t("settings.no_ranges")}
          </p>
        )}
        {ranges.map((range) => (
          <div key={range.id} className="flex items-center gap-3">
            <div className="flex-1">
              <input
                type="number"
                value={range.min}
                onChange={(e) =>
                  updateRange(range.id, "min", Number(e.target.value))
                }
                placeholder={t("settings.min_price")}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-md text-slate-200 text-sm focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 placeholder-slate-600 transition-all"
              />
            </div>
            <span className="text-slate-600 font-medium">-</span>
            <div className="flex-1 relative">
              <input
                type="number"
                value={range.max}
                onChange={(e) =>
                  updateRange(range.id, "max", Number(e.target.value))
                }
                placeholder={t("settings.max_price")}
                className={cn(
                  "w-full px-3 py-2 bg-slate-900 border rounded-md text-slate-200 text-sm focus:outline-none transition-all",
                  {
                    "border-rose-500 focus:border-rose-500 focus:ring-1 focus:ring-rose-500":
                      range.min >= range.max && range.max !== 0,
                    "border-slate-700 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500":
                      range.min < range.max || range.max === 0,
                  }
                )}
              />
            </div>
            <button
              onClick={() => removeRange(range.id)}
              className="p-2 text-slate-500 hover:text-rose-400 transition rounded-md hover:bg-rose-500/10"
            >
              <Trash2 size={16} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
