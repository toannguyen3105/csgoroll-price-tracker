import type { StateStorage } from 'zustand/middleware';

export const chromeStorageWrapper: StateStorage = {
    getItem: async (name: string): Promise<string | null> => {
        // console.log(`[Storage] GET ${name}`);
        if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
            const data = await chrome.storage.local.get(name);
            return (data[name] as string) || null;
        } else {
            // Fallback for local development (pnpm dev)
            return localStorage.getItem(name);
        }
    },
    setItem: async (name: string, value: string): Promise<void> => {
        // console.log(`[Storage] SET ${name}`, value);
        if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
            await chrome.storage.local.set({ [name]: value });
        } else {
            // Fallback
            localStorage.setItem(name, value);
        }
    },
    removeItem: async (name: string): Promise<void> => {
        // console.log(`[Storage] REMOVE ${name}`);
        if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
            await chrome.storage.local.remove(name);
        } else {
            // Fallback
            localStorage.removeItem(name);
        }
    },
};
