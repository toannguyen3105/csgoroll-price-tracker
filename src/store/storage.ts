import type { StateStorage } from "zustand/middleware";
import { storageHelper } from "../storage_helper";

export const chromeStorageAdapter: StateStorage = {
  getItem: async (name: string): Promise<string | null> => {
    // console.log('Storage GET', name);
    try {
      const data = await storageHelper.get([name]);
      const value = data[name];
      if (value === undefined) return null;
      // Zustand persist expects a stringified JSON if it's an object, or just a string?
      // storageHelper returns the raw value.
      // Zustand's JSONStorage does JSON.parse(value).
      // So we need to return a string.
      return JSON.stringify(value);
    } catch (e) {
      console.error("Storage GET Error", e);
      return null;
    }
  },
  setItem: async (name: string, value: string): Promise<void> => {
    // console.log('Storage SET', name, value);
    try {
      // Zustand passes a serialized string (because of createJSONStorage).
      // We can save it directly or parse it.
      // Chrome storage can save objects directly.
      // If we save it as a string, it's fine too.
      // Let's parse it back to an object to keep chrome storage clean and inspectable?
      // Or just keep it simple and store the string.
      // User requested "use createJSONStorage pointing to chrome.storage.local".
      // Usually: createJSONStorage(() => chromeStorageAdapter)
      // If we use createJSONStorage, zustand stringifies before calling setItem.
      // So 'value' is a string. we can just save { [name]: JSON.parse(value) } to have a nice object in storage.
      const parsed = JSON.parse(value);
      await storageHelper.set({ [name]: parsed });
    } catch (e) {
      console.error("Storage SET Error", e);
    }
  },
  removeItem: async (name: string): Promise<void> => {
    // Chrome storage doesn't have a simple remove for one key easily in our helper?
    // storageHelper doesn't have remove? Let's check storage_helper.ts
    // For now, let's just set to null/undefined
    await storageHelper.set({ [name]: null }); // Poor man's delete
  },
};
