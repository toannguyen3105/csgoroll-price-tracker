import React from "react";
import { useTranslation } from "react-i18next";
import { Clock } from "lucide-react";

import type { Intervals } from "@/types";

interface Props {
  intervals: Intervals;
  setIntervals: React.Dispatch<React.SetStateAction<Intervals>>;
}

export const IntervalSettings: React.FC<Props> = ({
  intervals,
  setIntervals,
}) => {
  const { t } = useTranslation();

  const handleChange = (field: keyof Intervals, value: number) => {
    setIntervals((prev) => ({ ...prev, [field]: value }));
  };

  const handleBlur = (field: keyof Intervals, value: number, min: number) => {
    if (value < min) {
      handleChange(field, min);
    }
  };

  return (
    <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-700/50">
      <div className="flex items-center gap-2 mb-4">
        <Clock className="text-cyan-500" size={18} />
        <h2 className="text-sm font-semibold text-slate-100 uppercase tracking-wider">
          {t("settings.interval_settings_title")}
        </h2>
      </div>

      <div className="grid grid-cols-1 gap-4">
        <div>
          <label className="block text-xs font-medium text-slate-400 mb-1 uppercase tracking-wide">
            {t("settings.range_interval")}
          </label>
          <input
            type="number"
            value={intervals.rangeInterval}
            onChange={(e) =>
              handleChange("rangeInterval", Number(e.target.value))
            }
            className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-md text-slate-200 text-sm focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
          />
          <p className="text-[10px] text-slate-500 mt-1">
            {t("settings.range_interval_desc")}
          </p>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-400 mb-1 uppercase tracking-wide">
            {t("settings.batch_interval")}
          </label>
          <input
            type="number"
            value={intervals.batchInterval}
            onChange={(e) =>
              handleChange("batchInterval", Number(e.target.value))
            }
            className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-md text-slate-200 text-sm focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
          />
          <p className="text-[10px] text-slate-500 mt-1">
            {t("settings.batch_interval_desc")}
          </p>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-400 mb-1 uppercase tracking-wide">
            {t("settings.cycle_delay")}
          </label>
          <input
            type="number"
            value={intervals.cycleDelay}
            onChange={(e) => handleChange("cycleDelay", Number(e.target.value))}
            onBlur={(e) => handleBlur("cycleDelay", Number(e.target.value), 1)}
            step="0.1"
            min="1"
            className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-md text-slate-200 text-sm focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
          />
          <p className="text-[10px] text-slate-500 mt-1">
            {t("settings.cycle_delay_desc")}
          </p>
        </div>
      </div>
    </div>
  );
};
