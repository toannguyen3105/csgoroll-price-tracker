import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { chromeStorageWrapper } from '@/utils/chrome-storage-wrapper';

interface TargetItem {
    id: string;
    name: string;
    targetPrice: number;
    isActive: boolean;
}

interface Intervals {
    range: number;
    batch: number;
    cycle: number;
}

interface TelegramConfig {
    botToken: string;
    chatId: string;
}

interface ConfigState {
    targetList: TargetItem[];
    intervals: Intervals;
    telegram: TelegramConfig;
    isCrawling: boolean;
    logs: string[];

    // Actions
    updateIntervals: (newIntervals: Partial<Intervals>) => void;
    updateTelegram: (config: Partial<TelegramConfig>) => void;
    addTargetItem: (item: Omit<TargetItem, 'id'>) => void;
    deleteTargetItem: (id: string) => void;
    toggleTargetItem: (id: string) => void;
    setLogs: (message: string) => void;
    clearLogs: () => void;
    setCrawlingStatus: (status: boolean) => void;
}

export const useConfigStore = create<ConfigState>()(
    persist(
        (set) => ({
            targetList: [],
            intervals: { range: 10, batch: 10, cycle: 65 }, // Default values
            telegram: { botToken: '', chatId: '' },
            isCrawling: false,
            logs: [],

            updateIntervals: (newIntervals) => set((state) => ({
                intervals: { ...state.intervals, ...newIntervals }
            })),

            updateTelegram: (config) => set((state) => ({
                telegram: { ...state.telegram, ...config }
            })),

            addTargetItem: (item) => set((state) => {
                const newItem = { ...item, id: crypto.randomUUID(), isActive: true };
                return { targetList: [...state.targetList, newItem] };
            }),

            deleteTargetItem: (id) => set((state) => ({
                targetList: state.targetList.filter((i) => i.id !== id)
            })),

            toggleTargetItem: (id) => set((state) => ({
                targetList: state.targetList.map((i) =>
                    i.id === id ? { ...i, isActive: !i.isActive } : i
                )
            })),

            setLogs: (message) => set((state) => {
                const newLogs = [message, ...state.logs].slice(0, 100);
                return { logs: newLogs };
            }),

            clearLogs: () => set({ logs: [] }),

            setCrawlingStatus: (status) => set({ isCrawling: status }),
        }),
        {
            name: 'crawler-storage',
            storage: createJSONStorage(() => chromeStorageWrapper),
        }
    )
);

// Chrome Storage Sync Listener
if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.onChanged) {
    chrome.storage.onChanged.addListener((changes, areaName) => {
        if (areaName === 'local' && changes['crawler-storage']) {
            // console.log('[Store] Detected external storage change, syncing...');
            useConfigStore.persist.rehydrate();
        }
    });
}
