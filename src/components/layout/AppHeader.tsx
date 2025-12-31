import { LanguageSwitcher } from "../LanguageSwitcher";

export const AppHeader = () => {
  return (
    <header className="bg-slate-900 border-b border-slate-800 px-5 py-4 flex items-center justify-between shrink-0">
      <div>
        <h1 className="text-lg font-bold text-slate-100 tracking-tight flex items-center gap-2">
          CRAWLER CONFIG
        </h1>
        <div className="flex items-center gap-2 mt-1">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <p className="text-[10px] font-medium text-emerald-500 uppercase tracking-wider">
            System Active
          </p>
        </div>
      </div>
      <LanguageSwitcher />
    </header>
  );
};
