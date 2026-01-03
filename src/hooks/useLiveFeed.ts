import { useEffect, useState } from "react";

import type { LiveItem, RuntimeMessage } from "@/types";
import { mockLiveResults } from "@/mocks/data";

export const useLiveFeed = () => {
  const [liveResults, setLiveResults] = useState<LiveItem[]>([]);

  const addLiveResult = (item: LiveItem) => {
    setLiveResults((prev) => {
      // Deduplicate: Remove existing item with same ID first
      const filtered = prev.filter((i) => i.id !== item.id);
      // Keep only last 200 items
      return [item, ...filtered].slice(0, 200);
    });
  };

  const clearLiveResults = () => {
    setLiveResults([]);
  };

  useEffect(() => {
    // Mock Data Logic
    if (import.meta.env.VITE_USE_MOCK_DATA === "true") {
      setTimeout(() => setLiveResults(mockLiveResults), 0);

      const interval = setInterval(() => {
        const randomPrice = Math.floor(Math.random() * 500) + 10;
        const newItem: LiveItem = {
          id: crypto.randomUUID(),
          name: `Mock Item ${Math.floor(Math.random() * 1000)}`,
          price: randomPrice,
          markup: Math.floor(Math.random() * 20) - 10,
          isMatch: Math.random() > 0.8,
          timestamp: new Date().toISOString(),
        };
        addLiveResult(newItem);
      }, 3000); // Add item every 3 seconds

      return () => clearInterval(interval);
    }
  }, []);

  useEffect(() => {
    const handleMessage = (message: RuntimeMessage) => {
      if (message && message.type === "ITEM_SCANNED") {
        const payload = message.payload;

        const newItem: LiveItem = {
          id: payload.id || crypto.randomUUID(),
          name: payload.name || "Unknown Item",
          price: Number(payload.price) || 0,
          markup: Number(payload.markup) || 0,
          isMatch: !!payload.isTarget,
          timestamp: payload.timestamp || new Date().toISOString(),
        };

        addLiveResult(newItem);
      }
    };

    if (
      typeof chrome !== "undefined" &&
      chrome.runtime &&
      chrome.runtime.onMessage
    ) {
      chrome.runtime.onMessage.addListener(handleMessage);
    }

    return () => {
      if (
        typeof chrome !== "undefined" &&
        chrome.runtime &&
        chrome.runtime.onMessage
      ) {
        chrome.runtime.onMessage.removeListener(handleMessage);
      }
    };
  }, []);

  return {
    liveResults,
    clearLiveResults,
  };
};
