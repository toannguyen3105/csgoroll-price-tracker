import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Plus, Search, Upload, Download } from "lucide-react";

import type { TargetItem } from "@/types";
import { useConfigStore } from "@/store/useConfigStore";
import { storageHelper } from "@/storage_helper";
import { TargetListTable } from "./TargetListTable";

interface Props {
  targetItems: TargetItem[];
  setTargetItems: React.Dispatch<React.SetStateAction<TargetItem[]>>;
}

export const TargetItemManager: React.FC<Props> = ({
  targetItems,
  setTargetItems,
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
          targetPrice: price, // Mapped to targetPrice in internal type but using price in old logic
          price: price, // Keeping price for compatibility if needed
          enabled: true,
          isActive: true,
          createdAt: Date.now(),
        },
        ...prev,
      ]);
      setNewItemName("");
      setNewItemPrice("");
      useConfigStore.getState().clearLiveResults();
    }
  };

  // CSV/JSON Import Helpers (omitted for brevity in this split, kept in main logic if critical or moved to utils)
  // For this refactor, I'm keeping them but condensing logic.

  // ... (Import logic assumed handled or simplified)

  const toggleItem = (id: string) => {
    setTargetItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, isActive: !item.isActive, enabled: !item.enabled }
          : item
      )
    );
    useConfigStore.getState().clearLiveResults();
  };

  const deleteItem = (id: string) => {
    setTargetItems((prev) => prev.filter((item) => item.id !== id));
    useConfigStore.getState().clearLiveResults();
  };

  const editItem = (item: TargetItem) => {
    // Logic for editing inline or popping to form
    setNewItemName(item.name);
    setNewItemPrice(item.targetPrice.toString());
    // For simple UX, populate add form and remove old on save, or complex inline edit
    // Using delete-then-add pattern for simplicity in this manager refactor
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
    const csvContent =
      "Item Name,Price\nAK-47 | Redline (Field-Tested),15.50\nAWP | Asiimov (Battle-Scarred),45.00";
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
              price: price, // Compatibility
              enabled: true,
              isActive: true,
              createdAt: Date.now(),
            });
          }
        }
      });

      if (newItems.length > 0) {
        setTargetItems((prev) => [...newItems, ...prev]); // Prepend new items
        useConfigStore.getState().clearLiveResults();
        // Reset input value to allow re-importing same file
        e.target.value = "";
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="h-full flex flex-col space-y-4">
      {/* Add Form */}
      <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700/50 shrink-0">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-sm font-semibold text-slate-100 flex items-center gap-2 uppercase tracking-wider">
            <Plus size={16} className="text-cyan-500" />{" "}
            {t("targets.add_new_target")}
          </h3>

          {/* CSV Import UI */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadTemplate}
              className="flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-bold text-cyan-400 bg-cyan-950/30 hover:bg-cyan-900/50 border border-cyan-900/50 rounded-md transition-colors uppercase tracking-wide"
              title={t("targets.download_template_title")}
            >
              <Download size={14} /> {t("targets.template_button")}
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
              className="flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-bold text-slate-300 bg-slate-700 hover:bg-slate-600 rounded-md transition-colors uppercase tracking-wide"
              title={t("targets.import_csv_title")}
            >
              <Upload size={14} /> {t("targets.import_csv_button")}
            </button>
          </div>
        </div>
        <form onSubmit={handleAdd} className="flex gap-3">
          <div className="flex-1">
            <input
              type="text"
              placeholder={t("targets.item_name_placeholder")}
              value={newItemName}
              onChange={(e) => setNewItemName(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-slate-900 border border-slate-700 rounded-md text-slate-200 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 placeholder-slate-600 transition-all"
            />
          </div>
          <div className="w-24">
            <input
              type="number"
              placeholder={t("targets.max_price_placeholder")}
              value={newItemPrice}
              onChange={(e) => setNewItemPrice(e.target.value)}
              step="0.01"
              className="w-full px-3 py-2 text-sm bg-slate-900 border border-slate-700 rounded-md text-slate-200 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 placeholder-slate-600 transition-all font-mono"
            />
          </div>
          <button
            type="submit"
            disabled={!newItemName || !newItemPrice}
            className="px-4 py-2 bg-cyan-600 text-white rounded-md text-sm font-bold uppercase tracking-wider hover:bg-cyan-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-[0_0_10px_rgba(8,145,178,0.3)] hover:shadow-[0_0_15px_rgba(8,145,178,0.5)]"
          >
            {t("targets.add_button")}
          </button>
        </form>
      </div>

      {/* List & Search */}
      <div className="flex-1 flex flex-col min-h-0 bg-slate-950 border border-slate-800 rounded-lg overflow-hidden">
        <div className="p-3 border-b border-slate-800 bg-slate-900/50">
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
              size={14}
            />
            <input
              type="text"
              placeholder={t("targets.search_placeholder")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-8 py-2 text-sm bg-slate-900 border border-slate-700 rounded-md text-slate-200 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 placeholder-slate-600 transition-all"
            />
          </div>
        </div>

        <div className="flex-1 overflow-hidden bg-slate-950">
          <TargetListTable
            items={filteredItems}
            onToggle={toggleItem}
            onDelete={deleteItem}
            onEdit={editItem}
          />
        </div>
      </div>
    </div>
  );
};
