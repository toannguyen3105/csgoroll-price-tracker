import React from "react";
import type { Intervals } from "../types";
import { Clock } from "lucide-react";

interface Props {
  intervals: Intervals;
  setIntervals: React.Dispatch<React.SetStateAction<Intervals>>;
}

export const IntervalSettings: React.FC<Props> = ({
  intervals,
  setIntervals,
}) => {
  const handleChange = (field: keyof Intervals, value: number) => {
    setIntervals((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-700/50">
      <div className="flex items-center gap-2 mb-4">
        <Clock className="text-cyan-500" size={18} />
        <h2 className="text-sm font-semibold text-slate-100 uppercase tracking-wider">
          Interval Settings
        </h2>
      </div>

      <div className="grid grid-cols-1 gap-4">
        <div>
          <label className="block text-xs font-medium text-slate-400 mb-1 uppercase tracking-wide">
            Range Interval (seconds)
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
            Delay between checking each price range.
          </p>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-400 mb-1 uppercase tracking-wide">
            Batch Interval (seconds)
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
            Delay between items in a batch.
          </p>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-400 mb-1 uppercase tracking-wide">
            Cycle Delay (minutes)
          </label>
          <input
            type="number"
            value={intervals.cycleDelay}
            onChange={(e) => handleChange("cycleDelay", Number(e.target.value))}
            className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-md text-slate-200 text-sm focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
          />
          <p className="text-[10px] text-slate-500 mt-1">
            Wait time before restarting the scan cycle.
          </p>
        </div>
      </div>
    </div>
  );
};
