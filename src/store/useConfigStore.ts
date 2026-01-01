import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { chromeStorageWrapper } from "@/utils/chrome-storage-wrapper";
import i18n from "@/i18n/config";
import type {
  TargetItem,
  Intervals,
  TelegramConfig,
  LogEntry,
  Language,
  LiveItem,
} from "@/types";



interface ConfigState {
  targetItems: TargetItem[];
  intervals: Intervals;
  telegram: TelegramConfig;

  logs: LogEntry[];
  liveResults: LiveItem[];
  language: Language;
  _hasHydrated: boolean;

  // Actions
  updateIntervals: (newIntervals: Partial<Intervals>) => void;
  updateTelegram: (config: Partial<TelegramConfig>) => void;
  addTargetItem: (item: Omit<TargetItem, "id">) => void;
  deleteTargetItem: (id: string) => void;
  toggleTargetItem: (id: string) => void;
  setLogs: (
    message: string,
    level?: "info" | "success" | "warning" | "error"
  ) => void;
  clearLogs: () => void;

  addLiveResult: (item: LiveItem) => void;
  clearLiveResults: () => void;
  setLanguage: (lang: Language) => void;
  setHasHydrated: (state: boolean) => void;
}

export const useConfigStore = create<ConfigState>()(
  persist(
    (set) => ({
      targetItems: [],
      intervals: { rangeInterval: 10, batchInterval: 10, cycleDelay: 65 }, // Default values
      telegram: { botToken: "", chatId: "" },

      logs: [],
      liveResults: [],
      language: "en",
      _hasHydrated: false,

      updateIntervals: (newIntervals) =>
        set((state) => ({
          intervals: { ...state.intervals, ...newIntervals },
        })),

      updateTelegram: (config) =>
        set((state) => ({
          telegram: { ...state.telegram, ...config },
        })),

      addTargetItem: (item) =>
        set((state) => {
          const newItem = { ...item, id: crypto.randomUUID(), isActive: true };
          return { targetItems: [...state.targetItems, newItem] };
        }),

      deleteTargetItem: (id) =>
        set((state) => ({
          targetItems: state.targetItems.filter((i) => i.id !== id),
        })),

      toggleTargetItem: (id) =>
        set((state) => ({
          targetItems: state.targetItems.map((i) =>
            i.id === id ? { ...i, isActive: !i.isActive } : i
          ),
        })),

      setLogs: (message, level = "info") =>
        set((state) => {
          const newLog: LogEntry = {
            id: crypto.randomUUID(),
            level,
            message,
            timestamp: new Date().toISOString(),
          };
          const newLogs = [newLog, ...state.logs].slice(0, 100);
          return { logs: newLogs };
        }),

      clearLogs: () => set({ logs: [] }),



      addLiveResult: (item) =>
        set((state) => {
          // Deduplicate: Remove existing item with same ID first
          const filtered = state.liveResults.filter((i) => i.id !== item.id);
          const newResults = [item, ...filtered].slice(0, 200);
          return { liveResults: newResults };
        }),

      clearLiveResults: () => set({ liveResults: [] }),

      setLanguage: (lang) => {
        set({ language: lang });
        i18n.changeLanguage(lang);
      },

      setHasHydrated: (state) => set({ _hasHydrated: state }),
    }),
    {
      name: "crawler-storage",
      storage: createJSONStorage(() => chromeStorageWrapper),
      partialize: (state) => ({
        targetItems: state.targetItems,
        intervals: state.intervals,
        telegram: state.telegram,
        logs: state.logs,
        language: state.language,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
        if (state && state.language) {
          i18n.changeLanguage(state.language);
        }
      },
    }
  )
);

// Chrome Storage Sync Listener
if (
  typeof chrome !== "undefined" &&
  chrome.storage &&
  chrome.storage.onChanged
) {
  chrome.storage.onChanged.addListener((changes, areaName) => {
    if (areaName === "local" && changes["crawler-storage"]) {
      useConfigStore.persist.rehydrate();
    }
  });
}
