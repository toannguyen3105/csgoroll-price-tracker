import { useTranslation } from "react-i18next";
import { Settings, Activity, Target } from "lucide-react";
import { cn } from "@/utils";
import type { AppTab } from "@/types";

interface AppTabsProps {
  activeTab: AppTab;
  setActiveTab: (tab: AppTab) => void;
  isCollapsed?: boolean;
}

export const AppTabs = ({
  activeTab,
  setActiveTab,
  isCollapsed,
}: AppTabsProps) => {
  const { t } = useTranslation();

  const tabs: { id: AppTab; label: string; icon: typeof Activity }[] = [
    { id: "monitor", label: t("common.live_feed"), icon: Activity },
    { id: "targets", label: t("common.targets"), icon: Target },
    { id: "settings", label: t("common.settings"), icon: Settings },
  ];

  return (
    <div className="px-3 py-2 shrink-0">
      <div className="flex flex-col gap-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            title={isCollapsed ? tab.label : undefined}
            className={cn(
              "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
              isCollapsed && "justify-center px-2",
              activeTab === tab.id
                ? "bg-slate-800 text-slate-100 shadow-sm border border-slate-700/50"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 border border-transparent"
            )}
          >
            <tab.icon size={18} />
            {!isCollapsed && <span>{tab.label}</span>}
          </button>
        ))}
      </div>
    </div>
  );
};
