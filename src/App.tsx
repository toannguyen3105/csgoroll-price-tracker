import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import {
  AppHeader,
  AppTabs,
  IntervalSettings,
  LiveDataTableContainer,
  PriceRangeManager,
  TargetItemManager,
  TelegramConfig,
} from "@/components";
import { useCrawlerListener, useWithdrawQuery } from "@/hooks";
import "@/i18n";
import { storageHelper } from "@/storage_helper";
import { useConfigStore } from "@/store";
import type {
  AppState,
  Intervals,
  TelegramConfig as ITelegramConfig,
  PriceRange,
  TargetItem,
  AppTab,
  SaveStatus,
} from "@/types";
import { cn } from "@/utils";

const App = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<AppTab>("settings");
  const [loading, setLoading] = useState(true);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle");

  const _hasHydrated = useConfigStore((state) => state._hasHydrated);

  useCrawlerListener();
  useWithdrawQuery();

  const [priceRanges, setPriceRanges] = useState<PriceRange[]>([]);
  const [intervals, setIntervals] = useState<Intervals>({
    rangeInterval: 10,
    batchInterval: 10,
    cycleDelay: 1.1,
  });
  const [telegramConfig, setTelegramConfig] = useState<ITelegramConfig>({
    botToken: "",
    chatId: "",
  });
  const [targetItems, setTargetItems] = useState<TargetItem[]>([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await storageHelper.get([
          "priceRanges",
          "intervals",
          "telegramConfig",
          "targetItems",
        ]);
        if (data.priceRanges) setPriceRanges(data.priceRanges);
        if (data.intervals) setIntervals(data.intervals);
        if (data.telegramConfig) setTelegramConfig(data.telegramConfig);
        if (data.targetItems) setTargetItems(data.targetItems);
      } catch (error) {
        console.error("Failed to load settings:", error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const handleSaveSettings = async () => {
    setSaveStatus("saving");
    try {
      const state: AppState = {
        priceRanges,
        intervals,
        telegramConfig,
        targetItems,
      };
      await storageHelper.set(state);
      // Clear live results when settings change
      useConfigStore.getState().clearLiveResults();
      setSaveStatus("success");
      setTimeout(() => setSaveStatus("idle"), 2000);
    } catch (error) {
      console.error("Failed to save settings:", error);
      setSaveStatus("error");
    }
  };

  if (loading || !_hasHydrated) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="animate-spin text-blue-500" size={32} />
      </div>
    );
  }

  return (
    <div className="flex h-screen w-full bg-slate-950 text-slate-200 overflow-hidden">
      {/* Sidebar */}
      <aside className="w-[320px] flex flex-col h-full border-r border-slate-800 bg-slate-900/50 shrink-0">
        <AppHeader />
        <AppTabs activeTab={activeTab} setActiveTab={setActiveTab} />

        <main className="flex-1 overflow-y-auto p-4 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent min-h-0">
          {activeTab === "settings" ? (
            <div className="space-y-5">
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
          ) : (
            <div className="h-full">
              <LiveDataTableContainer />
            </div>
          )}
        </main>

        {activeTab === "settings" && (
          <footer className="bg-slate-900 border-t border-slate-800 px-4 py-4 shrink-0">
            <button
              onClick={handleSaveSettings}
              disabled={saveStatus === "saving"}
              className={cn(
                "w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-bold tracking-wide transition-all transform active:scale-[0.98]",
                {
                  "bg-emerald-600 text-white hover:bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.4)]":
                    saveStatus === "success",
                  "bg-rose-600 text-white hover:bg-rose-500 shadow-[0_0_15px_rgba(225,29,72,0.4)]":
                    saveStatus === "error",
                  "bg-cyan-600 text-white hover:bg-cyan-500 shadow-[0_0_15px_rgba(8,145,178,0.4)] hover:shadow-[0_0_20px_rgba(8,145,178,0.6)]":
                    saveStatus !== "success" && saveStatus !== "error",
                }
              )}
            >
              {saveStatus === "saving" ? (
                <Loader2 className="animate-spin" size={18} />
              ) : saveStatus === "success" ? (
                <span>{t("common.saved")}</span>
              ) : (
                t("common.save_settings")
              )}
            </button>
          </footer>
        )}
      </aside>

      {/* Main Content Area (Target Manager) */}
      <div className="flex-1 h-full bg-slate-950 overflow-hidden relative">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-cyan-900/10 via-slate-950 to-slate-950 pointer-events-none" />
        <TargetItemManager
          targetItems={targetItems}
          setTargetItems={setTargetItems}
        />
      </div>
    </div>
  );
};

export default App;
