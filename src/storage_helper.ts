/* eslint-disable @typescript-eslint/no-explicit-any */

const isChromeStorageAvailable = () => {
  try {
    return (
      typeof chrome !== "undefined" &&
      !!chrome.storage &&
      !!chrome.storage.local
    );
  } catch {
    return false;
  }
};

const getLocalStorage = () => {
  try {
    if (typeof window !== "undefined" && window.localStorage) {
      return window.localStorage;
    }
  } catch {
    // Ignore
  }
  return null;
};

export const storageHelper = {
  get: async (keys: string[] | string | null): Promise<any> => {
    if (isChromeStorageAvailable()) {
      return await chrome.storage.local.get(keys);
    }

    const storage = getLocalStorage();
    if (storage) {
      // Fallback for local development (Browser only)
      console.warn("Chrome storage not available, using localStorage");
      if (keys === null) {
        // Return all
        const result: any = {};
        for (let i = 0; i < storage.length; i++) {
          const key = storage.key(i);
          if (key)
            result[key] = JSON.parse(storage.getItem(key) || "null");
        }
        return result;
      }
      if (typeof keys === "string") {
        const value = storage.getItem(keys);
        return { [keys]: value ? JSON.parse(value) : undefined };
      }
      if (Array.isArray(keys)) {
        const result: any = {};
        keys.forEach((key) => {
          const value = storage.getItem(key);
          result[key] = value ? JSON.parse(value) : undefined;
        });
        return result;
      }
      return {};
    }
    
    return {};
  },

  set: async (items: { [key: string]: any }): Promise<void> => {
    if (isChromeStorageAvailable()) {
      return await chrome.storage.local.set(items);
    }

    const storage = getLocalStorage();
    if (storage) {
      // Fallback for local development (Browser only)
      console.warn("Chrome storage not available, using localStorage");
      Object.keys(items).forEach((key) => {
        storage.setItem(key, JSON.stringify(items[key]));
      });
    } else {
      console.warn("No storage mechanism available");
    }
  },
};
