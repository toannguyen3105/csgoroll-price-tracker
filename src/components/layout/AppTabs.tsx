import { Settings, List } from "lucide-react";

interface AppTabsProps {
  activeTab: "settings" | "targets";
  setActiveTab: (tab: "settings" | "targets") => void;
}

export const AppTabs = ({ activeTab, setActiveTab }: AppTabsProps) => {
  return (
    <div className="bg-slate-900/50 px-5 pb-4 pt-0 shrink-0">
      <div className="flex bg-slate-800/80 p-1 rounded-lg border border-slate-700/50">
        <button
          onClick={() => setActiveTab("settings")}
          className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-md text-sm font-semibold transition-all duration-200 ${
            activeTab === "settings"
              ? "bg-slate-700 text-cyan-400 shadow-sm"
              : "text-slate-400 hover:text-slate-200 hover:bg-slate-700/50"
          }`}
        >
          <Settings size={16} /> SETTINGS
        </button>
        <button
          onClick={() => setActiveTab("targets")}
          className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-md text-sm font-semibold transition-all duration-200 ${
            activeTab === "targets"
              ? "bg-slate-700 text-cyan-400 shadow-sm"
              : "text-slate-400 hover:text-slate-200 hover:bg-slate-700/50"
          }`}
        >
          <List size={16} /> TARGET LIST
        </button>
      </div>
    </div>
  );
};
