import { useTranslation } from "react-i18next";
import { Settings, Activity } from "lucide-react";
import { cn } from "@/utils";
import type { AppTab } from "@/types";

interface AppTabsProps {
  activeTab: AppTab;
  setActiveTab: (tab: AppTab) => void;
}

export const AppTabs = ({ activeTab, setActiveTab }: AppTabsProps) => {
  const { t } = useTranslation();

  return (
    <div className="bg-slate-900/50 px-5 pb-4 pt-0 shrink-0">
      <div className="flex bg-slate-800/80 p-1 rounded-lg border border-slate-700/50">
        <button
          onClick={() => setActiveTab("settings")}
          className={cn(
            "flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-md text-sm font-semibold transition-all duration-200 uppercase tracking-wide",
            activeTab === "settings"
              ? "bg-slate-700 text-cyan-400 shadow-sm"
              : "text-slate-400 hover:text-slate-200 hover:bg-slate-700/50"
          )}
        >
          <Settings size={16} /> {t("common.settings")}
        </button>
        <button
          onClick={() => setActiveTab("monitor")}
          className={cn(
            "flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-md text-sm font-semibold transition-all duration-200 uppercase tracking-wide",
            activeTab === "monitor"
              ? "bg-slate-700 text-emerald-400 shadow-sm"
              : "text-slate-400 hover:text-slate-200 hover:bg-slate-700/50"
          )}
        >
          <Activity size={16} /> {t("common.live_feed")}
        </button>
      </div>
    </div>
  );
};
