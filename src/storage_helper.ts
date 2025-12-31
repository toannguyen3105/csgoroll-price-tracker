export const storageHelper = {
  get: async (keys: string[] | string | null): Promise<any> => {
    if (
      typeof chrome !== "undefined" &&
      chrome.storage &&
      chrome.storage.local
    ) {
      return await chrome.storage.local.get(keys);
    } else {
      // Fallback for local development
      console.warn("Chrome storage not available, using localStorage");
      if (keys === null) {
        // Return all
        const result: any = {};
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key)
            result[key] = JSON.parse(localStorage.getItem(key) || "null");
        }
        return result;
      }
      if (typeof keys === "string") {
        const value = localStorage.getItem(keys);
        return { [keys]: value ? JSON.parse(value) : undefined };
      }
      if (Array.isArray(keys)) {
        const result: any = {};
        keys.forEach((key) => {
          const value = localStorage.getItem(key);
          result[key] = value ? JSON.parse(value) : undefined;
        });
        return result;
      }
      return {};
    }
  },

  set: async (items: { [key: string]: any }): Promise<void> => {
    if (
      typeof chrome !== "undefined" &&
      chrome.storage &&
      chrome.storage.local
    ) {
      return await chrome.storage.local.set(items);
    } else {
      // Fallback for local development
      Object.keys(items).forEach((key) => {
        localStorage.setItem(key, JSON.stringify(items[key]));
      });
    }
  },
};
