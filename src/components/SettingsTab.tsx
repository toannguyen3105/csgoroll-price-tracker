import { Loader2, Save } from "lucide-react";
import { useTranslation } from "react-i18next";
import type { Dispatch, SetStateAction } from "react";

import {
  IntervalSettings,
  PriceRangeManager,
  TelegramConfig,
} from "@/components";
import type {
  Intervals,
  PriceRange,
  SaveStatus,
  TelegramConfig as ITelegramConfig,
} from "@/types";
import { cn } from "@/utils";

interface SettingsTabProps {
  priceRanges: PriceRange[];
  setPriceRanges: Dispatch<SetStateAction<PriceRange[]>>;
  intervals: Intervals;
  setIntervals: Dispatch<SetStateAction<Intervals>>;
  telegramConfig: ITelegramConfig;
  setTelegramConfig: Dispatch<SetStateAction<ITelegramConfig>>;
  onSave: () => void;
  saveStatus: SaveStatus;
}

export const SettingsTab = ({
  priceRanges,
  setPriceRanges,
  intervals,
  setIntervals,
  telegramConfig,
  setTelegramConfig,
  onSave,
  saveStatus,
}: SettingsTabProps) => {
  const { t } = useTranslation();

  return (
    <div className="h-full overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
      <div className="max-w-3xl mx-auto space-y-6 pb-20">
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-100 mb-4 flex items-center gap-2">
            {t("common.config")}
          </h2>
          <div className="space-y-8">
            <PriceRangeManager
              ranges={priceRanges}
              setRanges={setPriceRanges}
            />
            <IntervalSettings
              intervals={intervals}
              setIntervals={setIntervals}
            />
            <TelegramConfig
              config={telegramConfig}
              setConfig={setTelegramConfig}
            />
          </div>

          <div className="mt-8 pt-6 border-t border-slate-800">
            <button
              onClick={onSave}
              disabled={saveStatus === "saving"}
              className={cn(
                "w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-bold tracking-wide transition-all transform active:scale-[0.98] shadow-lg border",
                {
                  "bg-emerald-950/40 text-emerald-400 border-emerald-900/50 hover:bg-emerald-900/60 hover:text-emerald-300 shadow-emerald-900/10":
                    saveStatus === "success",
                  "bg-rose-950/40 text-rose-400 border-rose-900/50 hover:bg-rose-900/60 hover:text-rose-300 shadow-rose-900/10":
                    saveStatus === "error",
                  "bg-cyan-950/40 text-cyan-400 border-cyan-900/50 hover:bg-cyan-900/60 hover:text-cyan-300 shadow-cyan-900/10":
                    saveStatus !== "success" && saveStatus !== "error",
                }
              )}
            >
              {saveStatus === "saving" ? (
                <Loader2 className="animate-spin" size={18} />
              ) : saveStatus === "success" ? (
                <span>{t("common.saved")}</span>
              ) : (
                <>
                  <Save size={18} />
                  {t("common.save_settings")}
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
