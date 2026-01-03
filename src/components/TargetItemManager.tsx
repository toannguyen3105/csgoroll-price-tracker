import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Plus, Search, Upload, Download } from "lucide-react";

import type { LiveItem, TargetItem } from "@/types";
import { storageHelper } from "@/storage_helper";
import { TargetListTable } from "./TargetListTable";
import { cn } from "@/utils/cn";

interface Props {
  targetItems: TargetItem[];
  liveResults: LiveItem[];
  setTargetItems: React.Dispatch<React.SetStateAction<TargetItem[]>>;
  onClearResults: () => void;
}

export const TargetItemManager: React.FC<Props> = ({
  targetItems,
  liveResults,
  setTargetItems,
  onClearResults,
}) => {
  const { t } = useTranslation();
  const [newItemName, setNewItemName] = useState("");
  const [newItemPrice, setNewItemPrice] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  // Sync with storage immediately on change
  useEffect(() => {
    storageHelper.set({ targetItems });
  }, [targetItems]);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const price = parseFloat(newItemPrice);
    if (newItemName && !isNaN(price) && price > 0) {
      setTargetItems((prev) => [
        {
          id: crypto.randomUUID(),
          name: newItemName,
          targetPrice: price,
          price: price,
          enabled: true,
          isActive: true,
          createdAt: Date.now(),
        },
        ...prev,
      ]);
      setNewItemName("");
      setNewItemPrice("");
      onClearResults();
    }
  };

  const toggleItem = (id: string) => {
    setTargetItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, isActive: !item.isActive, enabled: !item.enabled }
          : item
      )
    );
    onClearResults();
  };

  const deleteItem = (id: string) => {
    setTargetItems((prev) => prev.filter((item) => item.id !== id));
    onClearResults();
  };

  const editItem = (item: TargetItem) => {
    setNewItemName(item.name);
    setNewItemPrice(item.targetPrice.toString());
    deleteItem(item.id);
  };

  const filteredItems = targetItems.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // CSV Import Logic
  const handleImportClick = () => {
    document.getElementById("csv-file-input")?.click();
  };

  const handleDownloadTemplate = () => {
    // Add \uFEFF check for Excel UTF-8 compatibility
    const csvContent =
      "\uFEFFItem Name,Price\nAK-47 | Redline (Field-Tested),15.50\nAWP | Asiimov (Battle-Scarred),45.00\n★ Specialist Gloves | Emerald Web (Battle-Scarred),2000.20";
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "target_template.csv");
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      if (!text) return;

      const lines = text.split(/\r?\n/);
      const newItems: TargetItem[] = [];

      lines.forEach((line) => {
        const parts = line.split(",");
        if (parts.length >= 2) {
          const name = parts[0].trim();
          const priceString = parts[1].trim();
          const price = parseFloat(priceString);

          if (name && !isNaN(price) && price > 0) {
            newItems.push({
              id: crypto.randomUUID(),
              name: name,
              targetPrice: price,
              price: price,
              enabled: true,
              isActive: true,
              createdAt: Date.now(),
            });
          }
        }
      });

      if (newItems.length > 0) {
        setTargetItems((prev) => [...newItems, ...prev]); // Prepend new items
        onClearResults();
        // Reset input value to allow re-importing same file
        e.target.value = "";
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="h-full flex flex-col gap-4 p-4 lg:p-6 overflow-hidden">
      {/* Creation Card */}
      {/* Creation Card */}
      <div
        className={cn(
          "bg-slate-900/60 backdrop-blur-md border border-white/5 rounded-xl p-5 shadow-xl",
          "shrink-0 max-w-4xl mx-auto w-full"
        )}
      >
        <div className="flex items-center gap-2 mb-4">
          <div className="p-2 bg-cyan-500/10 rounded-lg">
            <Plus size={20} className="text-cyan-400" />
          </div>
          <h3 className="text-base font-bold text-slate-100 uppercase tracking-wider">
            {t("targets.add_new_target")}
          </h3>
        </div>

        <form onSubmit={handleAdd} className="flex gap-4">
          <div className="flex-1 relative group">
            <input
              type="text"
              placeholder={t("targets.item_name_placeholder")}
              value={newItemName}
              onChange={(e) => setNewItemName(e.target.value)}
              className={cn(
                "w-full px-4 py-3 bg-slate-950/50 border border-slate-700/50 rounded-lg",
                "text-slate-200 placeholder-slate-600 transition-all",
                "focus:outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20"
              )}
            />
            <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-cyan-500/0 via-cyan-500/0 to-cyan-500/5 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity" />
          </div>
          <div className="w-32 relative">
            <input
              type="number"
              placeholder={t("targets.max_price_placeholder")}
              value={newItemPrice}
              onChange={(e) => setNewItemPrice(e.target.value)}
              step="0.01"
              className={cn(
                "w-full px-4 py-3 bg-slate-950/50 border border-slate-700/50 rounded-lg",
                "text-slate-200 placeholder-slate-600 transition-all font-mono",
                "focus:outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20"
              )}
            />
          </div>
          <button
            type="submit"
            disabled={!newItemName || !newItemPrice}
            className={cn(
              "px-8 py-3 bg-cyan-600 text-white rounded-lg text-sm font-bold uppercase tracking-wider",
              "hover:bg-cyan-500 transition-all shadow-lg shadow-cyan-900/20",
              "hover:shadow-cyan-500/20 hover:translate-y-[-1px] active:translate-y-[0px]",
              "disabled:opacity-50 disabled:cursor-not-allowed"
            )}
          >
            {t("targets.add_button")}
          </button>
        </form>
      </div>

      {/* Data Panel */}
      {/* Data Panel */}
      <div
        className={cn(
          "flex-1 flex flex-col min-h-0 bg-slate-900/60 backdrop-blur-md border border-white/5 rounded-xl shadow-xl",
          "overflow-hidden max-w-4xl mx-auto w-full"
        )}
      >
        {/* Toolbar */}
        <div className="p-4 border-b border-white/5 flex items-center justify-between gap-4 bg-slate-900/30">
          <div className="relative flex-1 max-w-md">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
              size={16}
            />
            <input
              type="text"
              placeholder={t("targets.search_placeholder")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={cn(
                "w-full pl-10 pr-4 py-2 text-sm bg-slate-950/50 border border-slate-700/50 rounded-lg",
                "text-slate-200 placeholder-slate-600 transition-all",
                "focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/20"
              )}
            />
          </div>

          <div className="flex items-center gap-2">
            <div className="h-6 w-px bg-slate-700/50 mx-2" />
            <button
              onClick={handleDownloadTemplate}
              className={cn(
                "flex items-center gap-2 px-3 py-2 text-xs font-bold rounded-lg transition-colors uppercase tracking-wide group",
                "text-cyan-400 bg-cyan-950/20 hover:bg-cyan-900/40 border border-cyan-900/30"
              )}
              title={t("targets.download_template_title")}
            >
              <Download
                size={14}
                className="group-hover:scale-110 transition-transform"
              />
              <span>{t("targets.template_button")}</span>
            </button>
            <input
              type="file"
              id="csv-file-input"
              accept=".csv"
              className="hidden"
              onChange={handleFileChange}
            />
            <button
              onClick={handleImportClick}
              className={cn(
                "flex items-center gap-2 px-3 py-2 text-xs font-bold rounded-lg transition-colors uppercase tracking-wide group",
                "text-emerald-400 bg-emerald-950/20 hover:bg-emerald-900/40 border border-emerald-900/30"
              )}
              title={t("targets.import_csv_title")}
            >
              <Upload
                size={14}
                className="group-hover:scale-110 transition-transform"
              />
              <span>{t("targets.import_csv_button")}</span>
            </button>
          </div>
        </div>

        {/* Table Content */}
        <div className="flex-1 overflow-hidden">
          <TargetListTable
            items={filteredItems}
            liveResults={liveResults}
            onToggle={toggleItem}
            onDelete={deleteItem}
            onEdit={editItem}
          />
        </div>
      </div>
    </div>
  );
};
