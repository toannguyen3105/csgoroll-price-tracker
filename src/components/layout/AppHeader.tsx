import { useTranslation } from "react-i18next";
import { LanguageSwitcher } from "../LanguageSwitcher";
import { cn } from "@/utils/cn";

export const AppHeader = () => {
  const { t } = useTranslation();

  return (
    <header
      className={cn(
        "bg-slate-900 border-b border-slate-800 px-5 py-4",
        "flex items-center justify-between shrink-0"
      )}
    >
      <div>
        <h1 className="text-lg font-bold text-slate-100 tracking-tight flex items-center gap-2">
          {t("common.header_title")}
        </h1>
        <div className="flex items-center gap-2 mt-1">
          <span className="relative flex h-2 w-2">
            <span
              className={cn(
                "animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"
              )}
            ></span>
            <span
              className={cn(
                "relative inline-flex rounded-full h-2 w-2 bg-emerald-500"
              )}
            ></span>
          </span>
          <p className="text-[10px] font-medium text-emerald-500 uppercase tracking-wider">
            {t("common.system_active")}
          </p>
        </div>
      </div>
      <LanguageSwitcher />
    </header>
  );
};
