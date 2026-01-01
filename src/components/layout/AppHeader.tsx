import { useTranslation } from "react-i18next";
import { LanguageSwitcher } from "../LanguageSwitcher";
import { cn } from "@/utils/cn";

interface AppHeaderProps {
  isCollapsed?: boolean;
}

export const AppHeader = ({ isCollapsed }: AppHeaderProps) => {
  const { t } = useTranslation();

  return (
    <header
      className={cn(
        "bg-slate-900 border-b border-slate-800 px-4 py-4",
        "flex items-center justify-between shrink-0 h-[65px]"
      )}
    >
      <div
        className={cn(
          "flex items-center gap-3",
          isCollapsed && "justify-center w-full"
        )}
      >
        {/* Logo / Title Area */}
        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 text-white font-bold text-sm shrink-0 shadow-lg shadow-cyan-900/20">
          CP
        </div>

        {!isCollapsed && (
          <div className="flex flex-col">
            <h1 className="text-sm font-bold text-slate-100 tracking-tight leading-none">
              {t("common.header_title")}
            </h1>
            <div className="flex items-center gap-1.5 mt-1">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
              </span>
              <p className="text-[10px] font-medium text-emerald-500 uppercase tracking-wider leading-none">
                {t("common.system_active")}
              </p>
            </div>
          </div>
        )}
      </div>

      {!isCollapsed && <LanguageSwitcher />}
    </header>
  );
};
