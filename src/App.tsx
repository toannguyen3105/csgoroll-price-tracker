import { Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";

import {
  AppHeader,
  AppTabs,
  LiveDataTableContainer,
  SettingsTab,
  TargetItemManager,
} from "@/components";
import { useCrawlerListener } from "@/hooks";
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
  const [activeTab, setActiveTab] = useState<AppTab>("monitor");
  const [loading, setLoading] = useState(true);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle");
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const _hasHydrated = useConfigStore((state) => state._hasHydrated);

  useCrawlerListener();

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
      {/* Sidebar Navigation */}
      <aside
        className={cn(
          "flex flex-col h-full border-r border-slate-800 bg-slate-900/50 shrink-0 z-10 transition-all duration-300 ease-in-out relative",
          isSidebarCollapsed ? "w-[70px]" : "w-[260px]"
        )}
      >
        <AppHeader isCollapsed={isSidebarCollapsed} />
        <AppTabs
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          isCollapsed={isSidebarCollapsed}
        />

        <div className="flex-1" />

        <footer
          className={cn(
            "bg-slate-900 border-t border-slate-800 py-4 shrink-0 flex flex-col gap-3",
            isSidebarCollapsed ? "px-2" : "px-4"
          )}
        >
          {/* Footer content removed */}
        </footer>

        {/* Floating Sidebar Toggle Button */}
        <button
          onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          className="absolute -right-3 top-1/2 -translate-y-1/2 z-20 h-6 w-6 rounded-full bg-slate-800 border border-slate-600 flex items-center justify-center text-slate-400 hover:text-slate-200 hover:bg-slate-700 hover:border-slate-500 transition-all shadow-md focus:outline-none"
        >
          {isSidebarCollapsed ? (
            <ChevronRight size={14} />
          ) : (
            <ChevronLeft size={14} />
          )}
        </button>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 h-full bg-slate-950 overflow-hidden relative flex flex-col">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-cyan-900/10 via-slate-950 to-slate-950 pointer-events-none" />

        <div className="flex-1 overflow-hidden relative z-0">
          {activeTab === "monitor" && (
            <div className="h-full w-full">
              <LiveDataTableContainer />
            </div>
          )}

          {activeTab === "targets" && (
            <TargetItemManager
              targetItems={targetItems}
              setTargetItems={setTargetItems}
            />
          )}

          {activeTab === "settings" && (
            <SettingsTab
              priceRanges={priceRanges}
              setPriceRanges={setPriceRanges}
              intervals={intervals}
              setIntervals={setIntervals}
              telegramConfig={telegramConfig}
              setTelegramConfig={setTelegramConfig}
              onSave={handleSaveSettings}
              saveStatus={saveStatus}
            />
          )}
        </div>
      </main>
    </div>
  );
};

export default App;
